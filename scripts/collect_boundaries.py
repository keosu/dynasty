"""Subset explicitly identified historical features, retaining provenance/license."""
import json
from pathlib import Path
from datetime import datetime, timezone
from collect_monarchs import fetch

ROOT=Path(__file__).resolve().parents[1]
BASE='https://raw.githubusercontent.com/aourednik/historical-basemaps/master/'
SELECTIONS={
    'western-han':[(-100,'Han Empire'),(-1,'Han')],
    'eastern-han':[(100,'Han'),(200,'Han')],
    'western-jin':[(300,'Jin')],
    'eastern-jin':[(400,'Jin')],
    'northern-wei':[(500,'Toba Wei')],
    'sui':[(600,'Sui Empire')],
    'tang':[(800,'Tang Empire'),(900,'Tang Empire')],
    'northern-song':[(1000,'Song Empire'),(1100,'Song Empire')],
    'southern-song':[(1200,'Song Empire')],
    'yuan':[(1300,'Great Khanate')],
    'ming':[(1492,'Ming Empire'),(1500,'Ming Chinese Empire'),(1600,'Ming Chinese Empire')],
    'qing':[(1800,'Qing Empire')],
}
def run():
    output=[]
    for dynasty, selections in SELECTIONS.items():
        for year, name in selections:
            filename=f'geojson/world_{year if year>0 else "bc"+str(abs(year))}.geojson'
            source=BASE+filename
            data=json.loads(fetch(source))
            features=[f for f in data['features'] if f['properties'].get('NAME')==name]
            if not features: raise ValueError(f'Missing exact feature {year}: {name}')
            output.append({'dynastyId':dynasty,'year':year,'sourceName':name,'sourceUrl':'https://github.com/aourednik/historical-basemaps/blob/master/'+filename,'license':'GPL-3.0','precision':'原作者标注的概略历史边界；未经本站学术审订','features':features})
            print(dynasty,year,len(features),flush=True)
    target=ROOT/'public/data/historical-boundaries.json'
    target.write_text(json.dumps({'retrievedAt':datetime.now(timezone.utc).isoformat(),'author':'André Ourednik and historical-basemaps contributors','source':'https://github.com/aourednik/historical-basemaps','license':'GPL-3.0','changes':'仅按 NAME 字段提取指定政权，未重绘边界。','snapshots':output},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    license_dir=ROOT/'public/data/licenses'
    license_dir.mkdir(exist_ok=True)
    (license_dir/'historical-basemaps-GPL-3.0.txt').write_text(fetch(BASE+'LICENSE'),encoding='utf-8')
    print('Saved',target.stat().st_size,flush=True)
if __name__=='__main__': run()
