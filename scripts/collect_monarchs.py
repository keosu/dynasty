"""Repeatable, cached public Wikipedia importer. See docs/DATA_IMPORT.md.
Extracts published reigns; does not infer kinship or manufacture achievements.
"""
import hashlib
import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urljoin

import requests
from bs4 import BeautifulSoup
from opencc import OpenCC

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache' / 'wikipedia'
CACHE.mkdir(parents=True, exist_ok=True)
OUT = ROOT / 'src' / 'data' / 'generated'
OUT.mkdir(parents=True, exist_ok=True)
CC = OpenCC('t2s')
BASE = 'https://zh.wikipedia.org'
SOURCE = BASE + '/wiki/中国君主列表'
SESSION = requests.Session()
SESSION.headers['User-Agent'] = 'ShanHeJiResearchImporter/0.2 (local historical encyclopedia; cached, 3 workers)'

def fetch(url):
    file = CACHE / (hashlib.sha256(url.encode()).hexdigest() + '.html')
    if file.exists(): return file.read_text(encoding='utf-8')
    for attempt in range(3):
        try:
            response = SESSION.get(url, timeout=35)
            response.raise_for_status()
            response.encoding = 'utf-8'
            file.write_text(response.text, encoding='utf-8')
            time.sleep(.6)
            return response.text
        except requests.RequestException:
            if attempt == 2: raise
            time.sleep(12 if 'response' in locals() and response.status_code == 429 else 2 ** attempt)

def clean(cell):
    text = cell.get_text(' ', strip=True) if hasattr(cell, 'get_text') else cell
    return CC.convert(re.sub(r'\s+', ' ', re.sub(r'\[.*?\]', '', text)).strip())

def grid(table):
    carry = {}
    for tr in table.find_all('tr'):
        if tr.find_parent('table') is not table: continue
        row, future = {}, {}
        for index, (cell, left) in carry.items():
            row[index] = cell
            if left > 1: future[index] = (cell, left - 1)
        cursor = 0
        for cell in tr.find_all(['td','th'], recursive=False):
            while cursor in row: cursor += 1
            span = int(cell.get('colspan', 1))
            duration = int(cell.get('rowspan', 1))
            for offset in range(span):
                row[cursor + offset] = cell
                if duration > 1: future[cursor + offset] = (cell, duration - 1)
            cursor += span
        carry = future
        if row: yield [row.get(i) for i in range(max(row) + 1)]

KNOWN = {'秦':'qin','西汉':'western-han','东汉':'eastern-han','魏':'wei','曹魏':'wei','蜀汉':'shu','吴':'wu','西晋':'western-jin','东晋':'eastern-jin','北魏':'northern-wei','隋':'sui','唐':'tang','武周':'tang','北宋':'northern-song','南宋':'southern-song','元':'yuan','明':'ming','清朝':'qing'}
def dynasty_id(name): return KNOWN.get(name, 'polity-' + hashlib.sha1(name.encode()).hexdigest()[:10])
def normalize_group(section, name):
    if section=='北朝': return {'魏':'北魏','齐':'北齐','周':'北周'}.get(name,name)
    if section=='南朝': return {'宋':'刘宋','齐':'南齐','梁':'梁朝','陈':'陈朝'}.get(name,name)
    if section in ['成汉','汉赵']: return section
    if section=='五代十国' and name=='吴': return '杨吴'
    if section=='元' and name=='大元': return '元'
    if section=='辽' and ('大契丹' in name or name=='辽'): return '辽'
    if section=='西夏' and '夏王国' in name: return '西夏前身'
    return name
def parse_years(text):
    text = re.sub(r'（[^）]*）','',clean(text))
    matches = re.findall(r'(前?)(\d{1,4})年', text)
    if not matches: return None
    values = [-int(v) if sign else int(v) for sign,v in matches]
    if len(values)==1: return {'start':values[0],'end':values[0]}
    return {'start':values[0],'end':values[1]}

def parse_periods(text):
    text=re.sub(r'（[^）]*）','',clean(text))
    matches=re.findall(r'(前?)(\d{1,4})年',text)
    values=[-int(v) if sign else int(v) for sign,v in matches]
    return [{'start':values[i],'end':values[i+1] if i+1<len(values) else values[i]} for i in range(0,len(values),2)]

def collect():
    soup = BeautifulSoup(fetch(SOURCE), 'html.parser')
    people = {}
    warnings = []
    started = False
    section, group = '', ''
    for element in soup.select('h2,h3,h4,table.wikitable'):
        if element.name != 'table':
            section = clean(element).replace('[编辑]','').strip()
            if section == '秦': started = True
            if section in ['中华帝国','其余地方政权','注释','参见','参考文献','延伸阅读']: started = False
            group = normalize_group(section,section)
            continue
        if not started or element.find_parent('table'): continue
        name_i = time_i = title_i = era_i = None
        for row in grid(element):
            if any(c is None for c in row): continue
            texts = [clean(c) for c in row]
            if len({id(c) for c in row})==1 or len(set(t for t in texts if t))==1:
                candidate=next((t for t in texts if t),'').replace(' ','')
                if len(candidate)<18 and not re.fullmatch(r'\d+',candidate):
                    group = normalize_group(section,candidate)
                    if section=='唐' and group=='周': group='武周'
                continue
            name_indices=[i for i,t in enumerate(texts) if t in ['姓名','名讳','本名','名','名字','契丹文姓名','女真名','西夏名','汉文姓名','汉名']]
            found_name = name_indices[0] if name_indices else None
            found_time = next((i for i,t in enumerate(texts) if t in ['统治时间','统治时期','在位时间','在位时期']),None)
            if found_name is not None and found_time is not None:
                name_i,time_i=found_name,found_time
                candidate_name_indices=name_indices
                title_i=next((i for i,t in enumerate(texts) if t in ['庙号','尊号','称号','谥号']),None)
                era_i=next((i for i,t in enumerate(texts) if t in ['年号','年号及使用时间']),None)
                continue
            if name_i is None or max(name_i,time_i)>=len(row): continue
            cell=row[name_i]
            anchors=[a for a in cell.select('a[href]') if a.get('href','').startswith('/wiki/') and ':' not in unquote(a['href']).split('/wiki/')[-1]]
            if not anchors:
                for other_i in candidate_name_indices:
                    if other_i>=len(row):continue
                    anchors=[a for a in row[other_i].select('a[href]') if a.get('href','').startswith('/wiki/') and ':' not in unquote(a['href']).split('/wiki/')[-1]]
                    if anchors:break
            if not anchors: continue
            name=clean(anchors[0])
            if not name or len(name)>35: continue
            reigns=parse_periods(texts[time_i])
            if section=='元' and group=='元' and len(row)>time_i+1:
                reigns=parse_periods(texts[time_i+1]) or reigns
            if not reigns or any(r['start']>r['end'] for r in reigns):
                warnings.append({'name':name,'group':group,'reason':'无法自动解析在位区间','raw':texts[time_i]}); continue
            url=urljoin(BASE,anchors[0]['href'])
            slug=CC.convert(unquote(url.split('/wiki/')[-1]))
            key=dynasty_id(group)+':'+slug
            title = (clean(row[title_i]) if title_i is not None else '').split('（')[0]
            title = slug if len(slug)<14 and '(' not in slug else (group+title if title and len(title)<8 else name)
            existing=people.get(key)
            if not existing:
                existing={'id':'import-'+hashlib.sha1(key.encode()).hexdigest()[:12],'dynastyId':dynasty_id(group),'dynastyName':group,'name':name,'title':title,'lifespan':'未提取','reigns':[],'summary':'','achievements':[],'assessment':'','sources':[{'title':'维基百科 · '+slug,'url':url},{'title':'中国君主列表 · 在位记录','url':SOURCE}],'sourceTitle':slug,'reignText':[],'eraNames':clean(row[era_i]) if era_i is not None and era_i<len(row) else '', 'imported':True,'articleSections':[],'parentNames':[]}
                people[key]=existing
            for reign in reigns:
                if reign not in existing['reigns']: existing['reigns'].append(reign)
            if texts[time_i] not in existing['reignText']: existing['reignText'].append(texts[time_i])
    records=list(people.values())
    (OUT/'monarchs.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Parsed',len(records),'monarchs in',len(set(p['dynastyId'] for p in records)),'polities',flush=True)
    def enrich(person):
        try:
            page=BeautifulSoup(fetch(person['sources'][0]['url']),'html.parser')
            candidates=page.select('.mw-parser-output')
            root=max(candidates,key=lambda el:len(el.get_text())) if candidates else page
            for unwanted in root.select('sup,.mw-editsection,.reference,.noprint'): unwanted.decompose()
            paragraphs=[]
            for p in root.find_all('p'):
                if p.find_parent(['table','figure','nav']): continue
                value=clean(p)
                if len(value)>35: paragraphs.append(value)
                if len(paragraphs)==3: break
            person['summary']='\n'.join(paragraphs)[:1800]
            for row in root.select('table.infobox tr'):
                cells=row.find_all(['th','td'],recursive=False)
                if len(cells)<2: continue
                label=clean(cells[0]); val=clean(cells[-1])
                if label in ['父亲','父親','父']: person['parentNames']=[clean(a) for a in cells[-1].select('a') if a.get('href','').startswith('/wiki/')][:2]
                if label in ['出生','逝世']: person.setdefault('lifeFacts',{})[label]=val[:160]
            if not person['parentNames']:
                for cell in root.select('td,th'):
                    if re.match(r'^父(?:亲)?\s*[：:]',clean(cell)):
                        person['parentNames']=[clean(a) for a in cell.select('a') if a.get('href','').startswith('/wiki/')][:2]
                        if person['parentNames']:break
            life=person.get('lifeFacts',{})
            if life: person['lifespan']='；'.join(k+'：'+v for k,v in life.items())
            for heading in root.select('h2,h3'):
                label=clean(heading)
                if not any(word in label for word in ['生平','早年','即位','登基','统治','在位','政治','评价','评议','功绩','改革']): continue
                collected=[]
                start=heading.parent if heading.parent and 'mw-heading' in heading.parent.get('class',[]) else heading
                for sibling in start.next_siblings:
                    if getattr(sibling,'name',None) in ['h2','h3'] or ('mw-heading' in getattr(sibling,'attrs',{}).get('class',[])): break
                    if getattr(sibling,'name',None) in ['p','ul','ol']:
                        content=clean(sibling)
                        if len(content)>25: collected.append(content)
                    if sum(map(len,collected))>1400: break
                if collected: person['articleSections'].append({'title':label,'content':'\n'.join(collected)[:1800]})
                if len(person['articleSections'])>=6: break
            person['fetchStatus']='ok' if person['summary'] else 'empty'
        except Exception as exc:
            person['fetchStatus']='failed'
            return person['name']+': '+str(exc)
        return None
    with ThreadPoolExecutor(max_workers=1) as pool:
        futures=[pool.submit(enrich,p) for p in records]
        for n,future in enumerate(as_completed(futures),1):
            error=future.result()
            if error: warnings.append({'reason':'页面采集失败','detail':error})
            if n%25==0: print('Fetched',n,'/',len(records),flush=True)
    # Extract explicit "X之子 / X第N子 / X与Y所生长子" clauses, never adjacency.
    for child in records:
        if child['parentNames']: continue
        intro=re.sub(r'\s+','',child['summary'].split('\n')[0])
        matches=[]
        for parent in records:
            if parent['id']==child['id'] or parent['dynastyId']!=child['dynastyId']:continue
            for name in set([parent['name'],parent['sourceTitle']]):
                pattern=re.escape(name)+r'(?:'+re.escape(parent['name'])+r')?(?:与[^，。；]{1,14})?(?:的|之|所生)?(?:第[一二三四五六七八九十0-9]+|嫡长|庶长|长|次|唯一|惟一)?(?:儿子|子)'
                match=re.search(pattern,intro)
                if match:matches.append((parent['name'],match.group(0)));break
        if len(matches)==1:
            child['parentNames']=[matches[0][0]]
            child['parentEvidence']=matches[0][1]
    (OUT/'monarchs.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    biographies=ROOT/'public/data/biographies'
    biographies.mkdir(exist_ok=True)
    catalog=[]
    for person in records:
        (biographies/(person['id']+'.json')).write_text(json.dumps(person,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
        catalog.append({**{k:v for k,v in person.items() if k not in ['articleSections','lifeFacts']},'summary':person['summary'].split('\n')[0][:650],'biographyId':person['id']})
    (OUT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    groups=[]
    for ident in dict.fromkeys(p['dynastyId'] for p in records):
        subset=[p for p in records if p['dynastyId']==ident]
        years=[r for p in subset for r in p['reigns']]
        groups.append({'id':ident,'name':subset[0]['dynastyName'],'start':min(r['start'] for r in years),'end':max(r['end'] for r in years),'count':len(subset)})
    manifest={'source':SOURCE,'retrievedAt':datetime.now(timezone.utc).isoformat(),'license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','changes':'繁简转换、字段提取、删去脚注标记、段落截取；原始年份保留于 reignText。','scope':'中国君主列表的秦至清主表，含表中并立政权、前身及延续政权；不含传说、先秦诸侯、中华帝国与其他地方政权。','count':len(records),'articleSuccess':sum(p.get('fetchStatus')=='ok' for p in records),'groups':groups,'warnings':warnings}
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'count':manifest['count'],'articles':manifest['articleSuccess'],'groups':groups,'warnings':warnings},ensure_ascii=False),flush=True)

if __name__=='__main__': collect()
