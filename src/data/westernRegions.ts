import type { HistoricalEvent, Source } from '../domain/types';

const whitePaper: Source = {
  title: '国务院新闻办公室《新疆的若干历史问题》（2019-07-21），第一部分',
  url: 'https://www.gov.cn/zhengce/2019-07/21/content_5412300.htm',
};
const textbook: Source = {
  title: '教育部组织编写、人教社《中外历史纲要（上）》第37页：唐朝前期疆域和边疆各族分布图',
  url: 'https://www.pep.com.cn/',
};

// Dates are documentary evidence. Coordinates are approximate modern locations,
// not government-provided historical coordinates or jurisdiction polygons.
export const westernRegionEvents: HistoricalEvent[] = [
  {
    id: 'western-regions-protectorate',
    dynastyId: 'western-han',
    title: '西域都护府设立',
    start: -60,
    end: -60,
    category: '政治',
    location: '乌垒城 · 今轮台一带（约址）',
    coordinates: [84.25, 41.78],
    emperorIds: ['import-15075cf0e160'],
    summary: '西汉设置西域都护府，管理西域军政事务。',
    content:
      '国务院新闻办公室《新疆的若干历史问题》记载，公元前60年西汉设西域都护府，作为管理西域的军政机构。人教社《中外历史纲要（上）》第23页记载其设于乌垒城，位于今新疆巴州轮台县。此处为历史地点概略定位；机构治所的点位不能代替其辖境。西汉形势图包含西域，但原图未注明单一快照年份。',
    sources: [
      whitePaper,
      { ...textbook, title: '人教社《中外历史纲要（上）》第23页：西汉形势图及乌垒城注释' },
    ],
  },
  {
    id: 'western-regions-chief-official',
    dynastyId: 'eastern-han',
    title: '东汉改设西域长史府',
    start: 123,
    end: 123,
    category: '政治',
    location: '西域 · 吐鲁番地区（区域示意）',
    coordinates: [89.2, 42.9],
    emperorIds: ['import-4ce9407f8a70'],
    summary: '东汉改设西域长史府，继续行使管理西域的职权。',
    content:
      '国务院新闻办公室《新疆的若干历史问题》记载，公元123年，东汉改西域都护府为西域长史府，继续行使管理西域的职权。地图点位仅用于定位西域东部区域，不表示123年长史府治所的已考定坐标。旧版东汉疆域图尚未依据中国出版的历史地图完成校订，不应将其缺失的区域理解为与汉廷不存在管理关系。',
    sources: [whitePaper],
  },
  {
    id: 'beiting-protectorate',
    dynastyId: 'tang',
    title: '北庭都护府设立',
    start: 702,
    end: 702,
    category: '政治',
    location: '北庭 · 今吉木萨尔北（约址）',
    coordinates: [89.21, 44.0],
    emperorIds: ['wu-ze-tian'],
    summary: '北庭都护府与安西都护府分治天山南北。',
    content:
      '人教社教材的唐朝前期疆域图在北庭都护府旁明确标注“702年置”，治所在今新疆吉木萨尔北。国务院新闻办公室的白皮书记载，唐代先后设置安西大都护府和北庭大都护府，统辖天山南北。702年当时为武周时期，本项目按唐专题收录。教材的疆域参考年是669年，北庭是后加的机构年代注记，因此事件热点只在筛选范围包含702年时出现。',
    sources: [textbook, whitePaper],
  },
  {
    id: 'ili-general',
    dynastyId: 'qing',
    title: '伊犁将军设置',
    start: 1762,
    end: 1762,
    category: '政治',
    location: '伊犁地区（区域示意）',
    coordinates: [81.0, 44.0],
    emperorIds: ['qing-qian-long'],
    summary: '清政府设伊犁将军，在新疆实行军政合一的军府体制。',
    content:
      '国务院新闻办公室《新疆的若干历史问题》记载，清政府于1762年设立伊犁将军，实行军政合一的军府体制。地图标记用于定位伊犁地区，不代表机构设立当日的建筑位置。1820年教材疆域图包含这一时期的西部边疆；该图不能用来表示清朝每一年的疆域。',
    sources: [whitePaper],
  },
  {
    id: 'xinjiang-province',
    dynastyId: 'qing',
    title: '新疆建省',
    start: 1884,
    end: 1884,
    category: '政治',
    location: '迪化 · 今乌鲁木齐（约址）',
    coordinates: [87.62, 43.82],
    emperorIds: ['import-8b2c0a9c5a51'],
    summary: '清政府在新疆建省，边疆治理体制发生变化。',
    content:
      '国务院新闻办公室《新疆的若干历史问题》记载，1884年在新疆地区建省，并解释“新疆”取“故土新归”之意。点位为省治所在今乌鲁木齐的概略位置，不是全省辖境。1820年疆域参考图早于此事件，不会因筛选1884年而自动套用；可从“疆域依据”手动选择其他年代作比较。',
    sources: [whitePaper],
  },
];
