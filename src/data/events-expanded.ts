import type { HistoricalEvent } from '../domain/types';

// Curated events. Maintain stable person IDs; provenance and review limits: docs/EVENT_SOURCES.md.
export const expandedEvents = [
  {
    id: 'qin-wall',
    dynastyId: 'qin',
    title: '秦修长城与北击匈奴',
    start: -215,
    end: -214,
    category: '建设',
    location: '河套地区',
    coordinates: [109.8, 40.65],
    emperorIds: ['qin-shi-huang'],
    summary: '秦将北方防御与边地经营相结合，连接、修筑原有长城。',
    content:
      '蒙恬率军北击匈奴后，秦在河套及其周边加强驻防，并连接、修筑战国时期已有的长城。工程依靠大量徭役，既服务于边地防御，也加重了民众负担。地图标记河套地区，不能据此还原长城的完整线路。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 23 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=23',
      },
      {
        title: '延伸阅读 · 秦长城（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%A7%A6%E9%95%BF%E5%9F%8E',
      },
    ],
  },
  {
    id: 'dazexiang',
    dynastyId: 'qin',
    title: '陈胜吴广起义',
    start: -209,
    end: -209,
    category: '战争',
    location: '大泽乡 · 今宿州一带',
    coordinates: [117, 33.48],
    emperorIds: ['qin-er-shi'],
    summary: '戍卒起事引发广泛反秦行动，秦末战争由此展开。',
    content:
      '陈胜、吴广在赴戍途中于大泽乡起事，随后建立张楚政权。起义虽很快受挫，却带动各地反秦力量兴起。地图为今宿州大泽乡一带的概略位置，起义影响远超这一处地点。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 25 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=25',
      },
      {
        title: '延伸阅读 · 陈胜吴广起义（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%99%88%E8%83%9C%E5%90%B4%E5%B9%BF%E8%B5%B7%E4%B9%89',
      },
    ],
  },
  {
    id: 'julu',
    dynastyId: 'qin',
    title: '巨鹿之战',
    start: -207,
    end: -207,
    category: '战争',
    location: '巨鹿故地 · 今平乡一带',
    coordinates: [115.03, 37.06],
    emperorIds: ['qin-er-shi'],
    summary: '项羽击破秦军主力，秦末战争的力量对比发生转折。',
    content:
      '项羽率楚军救赵，在巨鹿一带与秦军交战，击败王离所部。此后章邯军投降，秦朝失去重要军事支柱。古巨鹿与今日同名县的范围不完全相同，地图采用今平乡一带约址。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 58 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=58',
      },
      {
        title: '延伸阅读 · 巨鹿之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%B7%A8%E9%B9%BF%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'qin-books',
    dynastyId: 'qin',
    title: '秦始皇下令焚书',
    start: -213,
    end: -213,
    category: '文化',
    location: '咸阳',
    coordinates: [108.7, 34.33],
    emperorIds: ['qin-shi-huang'],
    summary: '秦廷限制民间持有部分典籍，强化思想与政治控制。',
    content:
      '秦始皇采纳李斯建议，下令收缴、焚毁民间所藏的部分史书及诸子典籍，医药、卜筮、种树等书不在同一禁毁范围。事件对典籍流传产生长期影响。此处记录焚书政令，不把次年的相关案件混作同一事件；地图为政令发布中心咸阳。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 25 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=25',
      },
      {
        title: '延伸阅读 · 焚书坑儒（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%84%9A%E4%B9%A6%E5%9D%91%E5%84%92',
      },
    ],
  },
  {
    id: 'chu-han',
    dynastyId: 'western-han',
    title: '楚汉战争',
    start: -206,
    end: -202,
    category: '战争',
    location: '垓下 · 今固镇一带',
    coordinates: [117.59, 33.32],
    emperorIds: ['han-gao-zu'],
    summary: '刘邦与项羽争夺天下，汉朝在战争中确立统治。',
    content:
      '秦亡后，刘邦和项羽之间的战争逐步成为天下争夺的中心。刘邦在诸侯联盟、后勤与军事协同方面取得优势，最终在垓下击败项羽。地图标记决战区域，不表示整场战争只发生于此。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 57 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=57',
      },
      {
        title: '延伸阅读 · 楚汉战争（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%A5%9A%E6%B1%89%E6%88%98%E4%BA%89',
      },
    ],
  },
  {
    id: 'wen-jing',
    dynastyId: 'western-han',
    title: '文景之治',
    start: -180,
    end: -141,
    category: '政治',
    location: '长安',
    coordinates: [108.86, 34.38],
    emperorIds: ['han-wen-di', 'import-c9dbdcb39a96'],
    summary: '休养生息与减轻赋役，推动汉初社会经济恢复。',
    content:
      '汉文帝、汉景帝时期延续汉初休养生息政策，重视农业，减轻部分赋税与徭役，国家积累逐渐增加。繁荣并未消除诸侯王与中央的矛盾。所列年份概括两帝执政时期，长安标记政策中心。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 28 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=28',
      },
      {
        title: '延伸阅读 · 文景之治（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%96%87%E6%99%AF%E4%B9%8B%E6%B2%BB',
      },
    ],
  },
  {
    id: 'seven-states',
    dynastyId: 'western-han',
    title: '七国之乱',
    start: -154,
    end: -154,
    category: '战争',
    location: '睢阳 · 今商丘一带',
    coordinates: [115.65, 34.39],
    emperorIds: ['import-c9dbdcb39a96'],
    summary: '诸侯王联合反叛，平乱后中央进一步削弱王国权力。',
    content:
      '吴、楚等七国以反对削藩为由起兵。汉廷任周亚夫等统军，梁国的抵抗也牵制了叛军；叛乱最终被平定。地图标记梁国都城睢阳一带，反映其中一处重要战场。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 28 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=28',
      },
      {
        title: '延伸阅读 · 七国之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%83%E5%9B%BD%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'tui-en',
    dynastyId: 'western-han',
    title: '颁行推恩令',
    start: -127,
    end: -127,
    category: '政治',
    location: '长安',
    coordinates: [108.86, 34.38],
    emperorIds: ['han-wu-di'],
    summary: '允许诸侯王分封子弟，使王国领地逐步分散。',
    content:
      '汉武帝采纳主父偃建议，允许诸侯王将部分封地分给子弟为侯。封国通过继承不断分割，中央借此削弱大诸侯王的势力。地图标记长安，表示政令的决策中心。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 29 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=29',
      },
      {
        title: '延伸阅读 · 推恩令（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%8E%A8%E6%81%A9%E4%BB%A4',
      },
    ],
  },
  {
    id: 'hexi-campaign',
    dynastyId: 'western-han',
    title: '河西之战',
    start: -121,
    end: -121,
    category: '战争',
    location: '河西走廊 · 今张掖一带',
    coordinates: [100.45, 38.93],
    emperorIds: ['han-wu-di'],
    summary: '霍去病出击河西，汉朝经营河西走廊的条件逐渐形成。',
    content:
      '汉武帝派霍去病多次进击河西匈奴势力，随后浑邪王等部归汉。河西走廊成为汉朝联系西域的重要通道，郡县和移民经营则是后续逐步展开的过程。地图为张掖一带，不表示全部行军路线。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 29 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=29',
      },
      {
        title: '延伸阅读 · 河西之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%B2%B3%E8%A5%BF%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'mobei-campaign',
    dynastyId: 'western-han',
    title: '漠北之战',
    start: -119,
    end: -119,
    category: '战争',
    location: '漠北 · 今蒙古高原中部（区域示意）',
    coordinates: [106, 47],
    emperorIds: ['han-wu-di'],
    summary: '卫青、霍去病分别率军深入漠北，汉匈战争规模扩大。',
    content:
      '汉武帝组织大规模远征，由卫青、霍去病分别率军北进，与匈奴主力交战。战争改变了双方在漠南的力量对比，也消耗了大量人力、财力和马匹。战场定位存在讨论，此点仅示意蒙古高原区域。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 65 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=65',
      },
      {
        title: '延伸阅读 · 漠北之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%BC%A0%E5%8C%97%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'taichu-calendar',
    dynastyId: 'western-han',
    title: '颁行太初历',
    start: -104,
    end: -104,
    category: '文化',
    location: '长安',
    coordinates: [108.86, 34.38],
    emperorIds: ['han-wu-di'],
    summary: '历法改革确立新的岁首及历算体系。',
    content:
      '汉武帝时期组织历法改革，太初历以正月为岁首，对岁、月及节气的安排作出调整。落下闳、邓平等参与相关工作，历法成为国家礼制与日常生产的重要基础。地图标记中央制定、颁行历法的长安。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 83 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=83',
      },
      {
        title: '延伸阅读 · 太初历（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%A4%AA%E5%88%9D%E5%8E%86',
      },
    ],
  },
  {
    id: 'xin-founding',
    dynastyId: 'polity-7b8a6bebd3',
    title: '王莽建立新朝',
    start: 9,
    end: 9,
    category: '政治',
    location: '长安',
    coordinates: [108.86, 34.38],
    emperorIds: ['import-7c4a4c49fe06'],
    summary: '王莽代汉建新，西汉统治结束。',
    content:
      '王莽在掌握朝政后称帝，改国号为新，并推行一系列涉及土地、货币和经济管理的改革。改革执行中的混乱与社会矛盾相互作用，后来引发广泛反抗。地图标记新朝政治中心长安。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 30 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=30',
      },
      {
        title: '延伸阅读 · 新朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%96%B0%E6%9C%9D',
      },
    ],
  },
  {
    id: 'ban-chao',
    dynastyId: 'eastern-han',
    title: '班超经营西域',
    start: 73,
    end: 102,
    category: '交流',
    location: '疏勒 · 今喀什一带',
    coordinates: [75.99, 39.47],
    emperorIds: ['import-f6d5b183a201', 'import-73ba7c465922', 'import-afa38a1f1c1a'],
    summary: '班超长期活动于西域，推动东汉恢复与当地诸国的联系。',
    content:
      '班超自汉明帝时期出使西域，此后长期通过外交与军事行动联络当地诸国，后任西域都护。其活动与西域各地政治力量密切相关，并非一次连续不变的远征。地图标记疏勒约址，是其重要活动地点之一。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 76 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=76',
      },
      {
        title: '延伸阅读 · 班超（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%8F%AD%E8%B6%85',
      },
    ],
  },
  {
    id: 'cai-lun-paper',
    dynastyId: 'eastern-han',
    title: '蔡伦改进造纸术',
    start: 105,
    end: 105,
    category: '文化',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['import-afa38a1f1c1a'],
    summary: '改进原料与工艺，使纸的制造和使用进一步发展。',
    content:
      '据史书记载，蔡伦向朝廷奏报利用树皮、麻头、破布、旧渔网等材料造纸的方法。考古发现表明纸在此之前已出现，因此应理解为工艺改进与推广，而不是纸的最初发明。地图标记东汉都城洛阳。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 78 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=78',
      },
      {
        title: '延伸阅读 · 蔡伦（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%94%A1%E4%BC%A6',
      },
    ],
  },
  {
    id: 'yellow-turban',
    dynastyId: 'eastern-han',
    title: '黄巾起义',
    start: 184,
    end: 184,
    category: '战争',
    location: '钜鹿 · 今平乡一带',
    coordinates: [115.03, 37.06],
    emperorIds: ['import-54d3a956fc47'],
    summary: '大规模民变冲击东汉统治，地方军事力量随之扩张。',
    content:
      '张角等借太平道组织起义，在多地同时发动反抗。主要起义虽遭镇压，其余部长期活动；朝廷平乱过程中，地方官员和豪强的军事力量也不断扩大。地图标记张角活动相关的钜鹿地区。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 31 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=31',
      },
      {
        title: '延伸阅读 · 黄巾之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%BB%84%E5%B7%BE%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'guandu',
    dynastyId: 'eastern-han',
    title: '官渡之战',
    start: 200,
    end: 200,
    category: '战争',
    location: '官渡 · 今中牟一带',
    coordinates: [113.98, 34.74],
    emperorIds: ['import-84380ac89de4'],
    summary: '曹操击败袁绍，为整合北方奠定基础。',
    content:
      '袁绍与曹操在官渡一带展开决战。曹操袭击袁军粮仓乌巢，促使战局转变；此后经过多年的战争，才逐步控制河北。地图为官渡古战场一带，事件发生时名义上的朝代仍是东汉。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 85 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=85',
      },
      {
        title: '延伸阅读 · 官渡之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%AE%98%E6%B8%A1%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'red-cliffs',
    dynastyId: 'eastern-han',
    title: '赤壁之战',
    start: 208,
    end: 208,
    category: '战争',
    location: '赤壁 · 今湖北赤壁一带（约址）',
    coordinates: [113.63, 29.89],
    emperorIds: ['import-84380ac89de4'],
    summary: '孙刘联军阻止曹操南进，为三国格局形成创造条件。',
    content:
      '曹操南下后，孙权与刘备结盟，由周瑜等统军与曹军对抗。联军利用水战和火攻击退曹军，长江流域的政治格局由此发生深刻变化。战场细节仍有讨论，地图标记通行认定的赤壁一带。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 86 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=86',
      },
      {
        title: '延伸阅读 · 赤壁之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%B5%A4%E5%A3%81%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'shu-founding',
    dynastyId: 'shu',
    title: '刘备在成都称帝',
    start: 221,
    end: 221,
    category: '政治',
    location: '成都',
    coordinates: [104.07, 30.67],
    emperorIds: ['shu-zhao-lie'],
    summary: '刘备建立蜀汉，三方政权并立逐渐定型。',
    content:
      '曹丕代汉后，刘备在成都称帝，仍以汉为国号，后世称蜀汉。其政权以益州为中心，在汉室继承的政治主张下与曹魏竞争。地图标记称帝和政权中枢所在地成都。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 210 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=210',
      },
      {
        title: '延伸阅读 · 蜀汉（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%9C%80%E6%B1%89',
      },
    ],
  },
  {
    id: 'zhuge-northern',
    dynastyId: 'shu',
    title: '诸葛亮北伐',
    start: 228,
    end: 234,
    category: '战争',
    location: '祁山 · 今礼县一带',
    coordinates: [105.17, 34.12],
    emperorIds: ['shu-hou-zhu'],
    summary: '蜀汉多次向曹魏进军，争夺陇右与关中通道。',
    content:
      '诸葛亮在蜀汉后主时期多次北伐曹魏，主要战区涉及祁山、陇右及渭水流域。双方围绕粮运、据点与战略通道反复争夺，诸葛亮最终病逝五丈原。地图选取祁山这一代表地点，不把多次战役合并为单一战场。',
    sources: [
      {
        title: '延伸阅读 · 诸葛亮北伐（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%AF%B8%E8%91%9B%E4%BA%AE%E5%8C%97%E4%BC%90',
      },
    ],
  },
  {
    id: 'gaoping',
    dynastyId: 'wei',
    title: '高平陵之变',
    start: 249,
    end: 249,
    category: '政治',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['import-9f9e59d77c26'],
    summary: '司马懿发动政变，曹魏朝政转入司马氏控制。',
    content:
      '曹芳与曹爽出城拜谒高平陵时，司马懿在洛阳起事，控制都城及重要军事设施。曹爽随后交出兵权并被诛杀，司马氏由此取得决定性的政治优势。地图标记政变中枢洛阳，并非陵墓精确位置。',
    sources: [
      {
        title: '维基百科 · 曹芳',
        url: 'https://zh.wikipedia.org/wiki/%E6%9B%B9%E8%8A%B3',
      },
      {
        title: '延伸阅读 · 高平陵之变（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%AB%98%E5%B9%B3%E9%99%B5%E4%B9%8B%E5%8F%98',
      },
    ],
  },
  {
    id: 'shiting',
    dynastyId: 'wu',
    title: '石亭之战',
    start: 228,
    end: 228,
    category: '战争',
    location: '石亭 · 今潜山一带（约址）',
    coordinates: [116.58, 30.63],
    emperorIds: ['wu-da-di'],
    summary: '孙吴利用诈降诱敌，击败曹魏南征部队。',
    content:
      '曹休率魏军南下，孙吴方面以周鲂诈降诱使其深入，陆逊等在石亭一带迎击，魏军遭受重大损失。此役巩固了孙吴对长江中下游防区的控制。地图采用今安徽潜山一带的概略位置。',
    sources: [
      {
        title: '维基百科 · 孙权',
        url: 'https://zh.wikipedia.org/wiki/%E5%AD%AB%E6%AC%8A',
      },
      {
        title: '延伸阅读 · 石亭之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%9F%B3%E4%BA%AD%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'dongxing',
    dynastyId: 'wu',
    title: '东兴之战',
    start: 252,
    end: 252,
    category: '战争',
    location: '东兴堤 · 巢湖东南一带',
    coordinates: [117.85, 31.45],
    emperorIds: ['import-d016b3ce2de6'],
    summary: '孙吴在东兴防线击退魏军，稳定了孙权死后的局势。',
    content:
      '孙权去世后，诸葛恪主持孙吴军政，修筑东兴堤并设防。曹魏军队进攻时，吴军在风雪中反击获胜。地图标记巢湖东南的东兴堤区域，古堤遗址与水岸位置不宜视为精确复原。',
    sources: [
      {
        title: '维基百科 · 孙亮',
        url: 'https://zh.wikipedia.org/wiki/%E5%AD%AB%E4%BA%AE',
      },
      {
        title: '延伸阅读 · 东兴之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%9C%E5%85%B4%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'wei-conquers-shu',
    dynastyId: 'wei',
    title: '魏灭蜀之战',
    start: 263,
    end: 263,
    category: '战争',
    location: '成都',
    coordinates: [104.07, 30.67],
    emperorIds: ['import-2846d654a5ab', 'shu-hou-zhu'],
    summary: '曹魏攻取蜀汉，三国鼎立开始走向终结。',
    content:
      '司马昭组织魏军伐蜀，钟会进攻剑阁方向，邓艾则经阴平险道进入蜀地。魏军逼近成都后，刘禅出降，蜀汉灭亡。地图标记最后的受降中心成都，不代表两路魏军的全部路线。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 36 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=36',
      },
      {
        title: '延伸阅读 · 魏灭蜀之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%AD%8F%E7%81%AD%E8%9C%80%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'western-jin-founding',
    dynastyId: 'western-jin',
    title: '西晋建立',
    start: 266,
    end: 266,
    category: '政治',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['jin-wu-di'],
    summary: '司马炎代魏称帝，西晋建立。',
    content:
      '司马炎继承司马氏在曹魏的权力，迫使曹奂禅位，建立晋朝并定都洛阳。新政权继续准备对孙吴的战争，直到280年才完成统一。地图标记建国与政治中枢洛阳。建国时间按教材公元266年记录；传统年表也常按魏咸熙二年列为265年。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 210 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=210',
      },
      {
        title: '延伸阅读 · 西晋（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%A5%BF%E6%99%8B',
      },
    ],
  },
  {
    id: 'eight-princes',
    dynastyId: 'western-jin',
    title: '八王之乱',
    start: 291,
    end: 306,
    category: '战争',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['import-65bd2f645f25'],
    summary: '宗室与朝廷集团争权，长期内战削弱西晋。',
    content:
      '晋惠帝时期，宗室诸王与外戚等政治集团先后卷入权力斗争，冲突从宫廷政变扩大为大规模战争。持续征战破坏社会经济，也削弱了中央对地方的控制。地图标记争夺中心洛阳，战区并不限于都城。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 91 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=91',
      },
      {
        title: '延伸阅读 · 八王之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%85%AB%E7%8E%8B%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'yongjia',
    dynastyId: 'western-jin',
    title: '永嘉之乱与洛阳陷落',
    start: 311,
    end: 311,
    category: '战争',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['import-a9989d58a594'],
    summary: '洛阳被攻陷，西晋统治与人口分布受到巨大冲击。',
    content:
      '汉赵军队攻陷洛阳，晋怀帝被俘。战乱造成大量人口死亡、流散和南迁，西晋中央随后在长安短暂延续，至316年灭亡。地图标记311年被攻陷的洛阳，不将这一年直接等同于西晋最终结束。',
    sources: [
      {
        title: '维基百科 · 晋怀帝',
        url: 'https://zh.wikipedia.org/wiki/%E6%99%8B%E6%80%80%E5%B8%9D',
      },
      {
        title: '延伸阅读 · 永嘉之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%B0%B8%E5%98%89%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'eastern-jin-founding',
    dynastyId: 'eastern-jin',
    title: '东晋建立',
    start: 317,
    end: 317,
    category: '政治',
    location: '建康 · 今南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['jin-yuan-di'],
    summary: '司马睿在江南建立政权，晋朝统治南移。',
    content:
      '西晋覆亡后，司马睿于317年在建康称晋王，次年称帝，史称东晋。南渡士族与江南地方势力共同参与政权构建，北方则继续多政权竞争。地图标记建康；317年为东晋通常采用的建国纪年。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 37 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=37',
      },
      {
        title: '延伸阅读 · 东晋（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%9C%E6%99%8B',
      },
    ],
  },
  {
    id: 'lanting',
    dynastyId: 'eastern-jin',
    title: '兰亭雅集',
    start: 353,
    end: 353,
    category: '文化',
    location: '兰亭 · 绍兴',
    coordinates: [120.5, 29.89],
    emperorIds: ['import-475dbf2afc4b'],
    summary: '王羲之等人的雅集与《兰亭集序》成为书法文化的重要典故。',
    content:
      '王羲之与友人在会稽兰亭举行修禊雅集，作诗并撰写序文，后世称《兰亭集序》。传世书法主要通过摹本、刻本流传，不能把今天看到的版本直接当作原迹。地图标记绍兴兰亭一带。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级上册》PDF 第 105 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级上册.pdf#page=105',
      },
      {
        title: '延伸阅读 · 兰亭集序（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%85%B0%E4%BA%AD%E9%9B%86%E5%BA%8F',
      },
    ],
  },
  {
    id: 'liu-song-founding',
    dynastyId: 'polity-843e143e98',
    title: '刘裕建立宋朝',
    start: 420,
    end: 420,
    category: '政治',
    location: '建康 · 今南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['import-c89735722654'],
    summary: '刘裕代晋建宋，南朝政权序列由此开始。',
    content:
      '掌握东晋军政大权的刘裕迫使晋恭帝禅位，在建康建立宋朝，后世称刘宋，以区别赵宋。南方进入宋、齐、梁、陈相继更替的时期。地图标记建国中枢建康。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 37 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=37',
      },
      {
        title: '延伸阅读 · 刘宋（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%88%98%E5%AE%8B',
      },
    ],
  },
  {
    id: 'northern-wei-unification',
    dynastyId: 'northern-wei',
    title: '北魏统一北方',
    start: 439,
    end: 439,
    category: '战争',
    location: '姑臧 · 今武威',
    coordinates: [102.63, 37.93],
    emperorIds: ['import-abe9c5ab3624'],
    summary: '北魏灭北凉，结束北方长期分裂的一大阶段。',
    content:
      '北魏太武帝拓跋焘进攻北凉并攻取姑臧，北方主要地区归于北魏统治。此后形成北魏与南朝对峙的格局，但边缘地区的政治关系仍较复杂。地图标记此次战役的中心姑臧。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 38 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=38',
      },
      {
        title: '延伸阅读 · 北魏（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%8C%97%E9%AD%8F',
      },
    ],
  },
  {
    id: 'equal-field',
    dynastyId: 'northern-wei',
    title: '北魏推行均田制',
    start: 485,
    end: 485,
    category: '政治',
    location: '平城 · 今大同',
    coordinates: [113.3, 40.08],
    emperorIds: ['wei-xiao-wen'],
    summary: '通过授田与户籍管理，恢复生产并加强国家控制。',
    content:
      '北魏在冯太后与孝文帝执政时期颁行均田令，按身份、年龄等条件分配部分土地，并规定还受办法。制度与租调、户籍相联系，实际实施受地方条件影响。地图标记当时都城平城。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 49 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=49',
      },
      {
        title: '延伸阅读 · 均田制（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%9D%87%E7%94%B0%E5%88%B6',
      },
    ],
  },
  {
    id: 'six-garrisons',
    dynastyId: 'northern-wei',
    title: '六镇起义',
    start: 523,
    end: 525,
    category: '战争',
    location: '武川镇 · 今武川一带',
    coordinates: [111.45, 41.1],
    emperorIds: ['import-a66737e8c532'],
    summary: '北部边镇冲突扩展，北魏政治秩序逐步瓦解。',
    content:
      '北魏北部军镇长期面临地位下降、生活困窘等问题。523年怀荒镇发生起事，524年起动乱扩大到多个军镇，525年主要镇民起义被镇压，余波仍继续影响北方。事件推动军政力量重组，成为北魏末年分裂的重要背景。地图标记武川一带，仅为六镇中的一个代表地点。',
    sources: [
      {
        title: '延伸阅读 · 六镇之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%85%AD%E9%95%87%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'hou-jing',
    dynastyId: 'polity-4d290326f6',
    title: '侯景之乱',
    start: 548,
    end: 552,
    category: '战争',
    location: '建康 · 今南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['import-319d89e88b0d'],
    summary: '侯景攻陷建康，梁朝统治与江南社会遭到重创。',
    content:
      '侯景叛乱后围攻并占领建康，梁武帝死于围困中的台城。此后梁朝各方势力与侯景反复交战，直到侯景败亡；中央控制和江南经济已遭严重破坏。地图标记战争中心建康。',
    sources: [
      {
        title: '维基百科 · 梁武帝',
        url: 'https://zh.wikipedia.org/wiki/%E6%A2%81%E6%AD%A6%E5%B8%9D',
      },
      {
        title: '延伸阅读 · 侯景之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%BE%AF%E6%99%AF%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'zhou-conquers-qi',
    dynastyId: 'polity-5a0894b8c4',
    title: '北周灭北齐',
    start: 577,
    end: 577,
    category: '战争',
    location: '邺城 · 今临漳一带',
    coordinates: [114.62, 36.28],
    emperorIds: ['import-c4a9f30f10ab'],
    summary: '北周击败北齐，北方再次趋于统一。',
    content:
      '北周武帝宇文邕率军攻打北齐，经过晋阳、邺城等战役后灭齐，掌握北方主要地区。北周随后由隋取代，为隋朝继续南下创造条件。地图标记北齐都城邺城约址。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 39 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=39',
      },
      {
        title: '延伸阅读 · 北周灭北齐之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%8C%97%E5%91%A8%E7%81%AD%E5%8C%97%E9%BD%90%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'sui-founding',
    dynastyId: 'sui',
    title: '隋朝建立',
    start: 581,
    end: 581,
    category: '政治',
    location: '长安',
    coordinates: [108.94, 34.26],
    emperorIds: ['sui-wen-di'],
    summary: '杨坚代周建隋，重新整合北方政权。',
    content:
      '杨坚掌握北周朝政后受禅称帝，建立隋朝。隋初推进政治、军事和财政整合，并着手建设大兴城。地图标记长安区域，后续都城营建不是在建国当天完成的。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 41 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=41',
      },
      {
        title: '延伸阅读 · 隋朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%9A%8B%E6%9C%9D',
      },
    ],
  },
  {
    id: 'sui-unification',
    dynastyId: 'sui',
    title: '隋灭陈统一南北',
    start: 589,
    end: 589,
    category: '战争',
    location: '建康 · 今南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['sui-wen-di', 'import-2d4020004009'],
    summary: '隋军攻取建康，长期南北分立局面告一段落。',
    content:
      '隋文帝组织大军渡江攻陈，隋军进入建康，陈后主被俘。隋朝由此完成对南北主要地区的统一，并继续重建行政秩序。地图标记陈朝都城建康，战争并非只在此处展开。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 41 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=41',
      },
      {
        title: '延伸阅读 · 隋灭陈之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%9A%8B%E7%81%AD%E9%99%88%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'sui-goguryeo',
    dynastyId: 'sui',
    title: '隋炀帝征高句丽',
    start: 612,
    end: 614,
    category: '战争',
    location: '辽东 · 今辽阳一带',
    coordinates: [123.17, 41.27],
    emperorIds: ['sui-yang-di'],
    summary: '连续远征消耗巨大，加剧隋末社会危机。',
    content:
      '隋炀帝先后三次大举进攻高句丽，动员大量兵员、粮饷与民夫。远征遭受严重挫折，其负担与国内徭役、灾荒等因素共同激化矛盾。地图标记辽东战区入口，不能代替完整行军路线。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 41 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=41',
      },
      {
        title: '延伸阅读 · 隋与高句丽的战争（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%9A%8B%E4%B8%8E%E9%AB%98%E5%8F%A5%E4%B8%BD%E7%9A%84%E6%88%98%E4%BA%89',
      },
    ],
  },
  {
    id: 'tang-founding',
    dynastyId: 'tang',
    title: '唐朝建立',
    start: 618,
    end: 618,
    category: '政治',
    location: '长安',
    coordinates: [108.94, 34.26],
    emperorIds: ['tang-gao-zu'],
    summary: '李渊在长安称帝，唐朝建立。',
    content:
      '李渊起兵并占据长安后，于618年称帝，改国号为唐。唐初仍面对多个割据集团，统一主要地区经历了后续多年的战争。地图标记唐朝建立时的政治中枢长安。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 42 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=42',
      },
      {
        title: '延伸阅读 · 唐朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%94%90%E6%9C%9D',
      },
    ],
  },
  {
    id: 'eastern-turk',
    dynastyId: 'tang',
    title: '唐灭东突厥',
    start: 630,
    end: 630,
    category: '战争',
    location: '阴山南麓 · 今呼和浩特一带',
    coordinates: [111.7, 40.85],
    emperorIds: ['tang-tai-zong'],
    summary: '唐军击败东突厥，北方政治格局发生变化。',
    content:
      '唐太宗派李靖、李勣等出击东突厥，颉利可汗被俘。唐廷随后对突厥部众的安置与管理采取多种办法，周边族群关系继续变化。地图标记阴山南麓区域，不表示每场战斗的精确地点。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 43 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=43',
      },
      {
        title: '延伸阅读 · 唐灭东突厥之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%94%90%E7%81%AD%E4%B8%9C%E7%AA%81%E5%8E%A5%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'anxi-protectorate',
    dynastyId: 'tang',
    title: '安西都护府设立',
    start: 640,
    end: 640,
    category: '政治',
    location: '交河故城 · 今吐鲁番（约址）',
    coordinates: [89.07, 42.95],
    emperorIds: ['tang-tai-zong'],
    summary: '唐在西域设置都护机构，后续治所和管理范围多次变化。',
    content:
      '唐灭高昌后设置安西都护府，初治西州交河，随后曾移治龟兹等地。机构的设置、迁移和安西四镇的形成有不同时间节点，不能混作640年同时完成。地图采用最初治所交河故城约址。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 43 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=43',
      },
      {
        title: '延伸阅读 · 安西都护府（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%AE%89%E8%A5%BF%E9%83%BD%E6%8A%A4%E5%BA%9C',
      },
    ],
  },
  {
    id: 'shenlong-coup',
    dynastyId: 'tang',
    title: '神龙政变',
    start: 705,
    end: 705,
    category: '政治',
    location: '洛阳',
    coordinates: [112.45, 34.62],
    emperorIds: ['wu-ze-tian', 'tang-zhong-zong'],
    summary: '政变促使武则天退位，唐朝国号恢复。',
    content:
      '张柬之等发动政变，诛杀张易之、张昌宗，促使武则天退位，唐中宗复位。唐朝国号恢复，但宫廷权力斗争并未由此终止。地图标记政变发生的洛阳宫廷区域。',
    sources: [
      {
        title: '维基百科 · 唐中宗',
        url: 'https://zh.wikipedia.org/wiki/%E5%94%90%E4%B8%AD%E5%AE%97',
      },
      {
        title: '延伸阅读 · 神龙政变（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%A5%9E%E9%BE%99%E6%94%BF%E5%8F%98',
      },
    ],
  },
  {
    id: 'jianzhen',
    dynastyId: 'tang',
    title: '鉴真东渡抵达日本',
    start: 754,
    end: 754,
    category: '交流',
    location: '平城京 · 今奈良',
    coordinates: [135.84, 34.69],
    emperorIds: ['tang-xuan-zong'],
    summary: '鉴真历经多次渡海尝试，赴日传授佛教戒律与文化。',
    content:
      '鉴真接受日本僧人邀请，多次尝试渡海，终于抵达日本并进入平城京。他参与传戒与寺院活动，促进佛教、医药、建筑等领域的交流。地图标记其在日本的重要活动中心奈良，不表示跨海航路。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级下册》PDF 第 25 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级下册.pdf#page=25',
      },
      {
        title: '延伸阅读 · 鉴真（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%89%B4%E7%9C%9F',
      },
    ],
  },
  {
    id: 'two-tax',
    dynastyId: 'tang',
    title: '推行两税法',
    start: 780,
    end: 780,
    category: '政治',
    location: '长安',
    coordinates: [108.94, 34.26],
    emperorIds: ['import-9362b5ef6563'],
    summary: '赋税征收向以资产、土地和夏秋两次征收为核心转变。',
    content:
      '唐德宗采纳杨炎建议推行两税法，将原有多种征敛加以归并，按户等、土地等条件征收，主要分夏秋两次。制度回应了均田与租庸调体系衰落后的财政变化。地图标记政策中枢长安。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 50 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=50',
      },
      {
        title: '延伸阅读 · 两税法（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%A4%E7%A8%8E%E6%B3%95',
      },
    ],
  },
  {
    id: 'yuanhe-revival',
    dynastyId: 'tang',
    title: '元和中兴',
    start: 806,
    end: 820,
    category: '政治',
    location: '长安',
    coordinates: [108.94, 34.26],
    emperorIds: ['import-8828184f9ff1'],
    summary: '唐宪宗加强中央权力，削藩一度取得进展。',
    content:
      '唐宪宗时期，朝廷围绕财政、用人与藩镇问题进行调整，并在淮西等地取得军事胜利。中央威望有所恢复，但宦官、藩镇与财政结构中的长期矛盾仍然存在。地图标记中央决策所在地长安。',
    sources: [
      {
        title: '维基百科 · 唐宪宗',
        url: 'https://zh.wikipedia.org/wiki/%E5%94%90%E5%AE%AA%E5%AE%97',
      },
      {
        title: '延伸阅读 · 元和中兴（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%85%83%E5%92%8C%E4%B8%AD%E5%85%B4',
      },
    ],
  },
  {
    id: 'huang-chao',
    dynastyId: 'tang',
    title: '黄巢起义',
    start: 875,
    end: 884,
    category: '战争',
    location: '长安',
    coordinates: [108.94, 34.26],
    emperorIds: ['import-1e1fe84a8e86'],
    summary: '起义军辗转多地并攻入长安，唐朝统治受到沉重打击。',
    content:
      '黄巢领导的起义军在南北多地流动作战，后来攻占长安并建立政权。唐廷借助地方与外部军事力量镇压起义，藩镇力量进一步扩张。地图选择长安这一关键地点，起义路线远不止关中。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 45 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=45',
      },
      {
        title: '延伸阅读 · 黄巢之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%BB%84%E5%B7%A2%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'later-zhou-reform',
    dynastyId: 'polity-827ea57f2b',
    title: '后周显德改革',
    start: 954,
    end: 959,
    category: '政治',
    location: '开封',
    coordinates: [114.31, 34.8],
    emperorIds: ['import-7409008294ee'],
    summary: '柴荣整军、理财并推进统一战争，为北宋接续奠定条件。',
    content:
      '后周世宗柴荣即位后整顿禁军、调整财政与田赋，限制部分寺院经济，并向南唐、辽等用兵。后周国力增强，但柴荣早逝使其事业未能完成。地图标记后周中枢开封。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 45 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=45',
      },
      {
        title: '延伸阅读 · 柴荣（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%9F%B4%E8%8D%A3',
      },
    ],
  },
  {
    id: 'liao-founding',
    dynastyId: 'polity-ad181593b1',
    title: '耶律阿保机建契丹国',
    start: 916,
    end: 916,
    category: '政治',
    location: '上京 · 今巴林左旗一带',
    coordinates: [119.38, 43.98],
    emperorIds: ['import-57556a24eeb5'],
    summary: '契丹政权建立皇帝制度，形成北方重要政治力量。',
    content:
      '耶律阿保机在整合契丹各部的基础上称帝，建立契丹国家，后续发展为辽朝。国号、都城营建与统治制度在不同时期继续变化，不能把后来制度全部前置到916年。地图标记后来的上京地区，作为政权中心的地理参照。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 65 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=65',
      },
      {
        title: '延伸阅读 · 辽朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%BE%BD%E6%9C%9D',
      },
    ],
  },
  {
    id: 'xia-founding',
    dynastyId: 'polity-5b5d254bcd',
    title: '元昊称帝建西夏',
    start: 1038,
    end: 1038,
    category: '政治',
    location: '兴庆府 · 今银川',
    coordinates: [106.28, 38.47],
    emperorIds: ['import-6c57b67de9f5'],
    summary: '党项政权称帝，与宋、辽形成并立格局。',
    content:
      '元昊在兴庆府称帝，国号大夏，史称西夏。此前党项政权已有长期地方经营，其文字、军政与礼制建设随后继续发展。地图标记兴庆府；1038年表示称帝建国，而非该政权势力最早出现。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 66 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=66',
      },
      {
        title: '延伸阅读 · 西夏（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%A5%BF%E5%A4%8F',
      },
    ],
  },
  {
    id: 'jin-founding',
    dynastyId: 'polity-b59df8c44a',
    title: '完颜阿骨打建立金朝',
    start: 1115,
    end: 1115,
    category: '政治',
    location: '会宁府 · 今哈尔滨阿城',
    coordinates: [126.98, 45.55],
    emperorIds: ['import-195bc0824a58'],
    summary: '女真各部的联合走向建国，金辽战争进一步展开。',
    content:
      '完颜阿骨打在反辽战争中称帝，建立金朝。金随后继续向辽进攻，并与北宋发生外交和军事联系。地图标记上京会宁府区域，代表金初的政治中心。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 66 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=66',
      },
      {
        title: '延伸阅读 · 金朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%87%91%E6%9C%9D',
      },
    ],
  },
  {
    id: 'chanyuan',
    dynastyId: 'northern-song',
    title: '澶渊之盟',
    start: 1004,
    end: 1005,
    category: '交流',
    location: '澶州 · 今濮阳',
    coordinates: [115.03, 35.71],
    emperorIds: ['import-f76139a7513b', 'import-05e6e5076d2d'],
    summary: '宋辽在战争后达成和议，边境关系进入较长期稳定阶段。',
    content:
      '辽军南下，宋真宗亲赴澶州，双方在军事对峙中展开谈判。和议确定宋向辽提供岁币等安排，减少了此后很长时期的大规模边境战争。谈判跨越公历年，范围列为1004至1005年；地图标记澶州。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 61 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=61',
      },
      {
        title: '延伸阅读 · 澶渊之盟（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%BE%B6%E6%B8%8A%E4%B9%8B%E7%9B%9F',
      },
    ],
  },
  {
    id: 'qingli-reform',
    dynastyId: 'northern-song',
    title: '庆历新政',
    start: 1043,
    end: 1045,
    category: '政治',
    location: '开封',
    coordinates: [114.31, 34.8],
    emperorIds: ['import-59fda90d0cb9'],
    summary: '范仲淹等推动吏治改革，因阻力而短期中止。',
    content:
      '宋仁宗任用范仲淹、富弼等，提出考核官员、限制恩荫、兴办学校等改革主张。改革触动既有利益，在政治反对下很快受挫。地图标记朝廷决策所在地开封。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 62 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=62',
      },
      {
        title: '延伸阅读 · 庆历新政（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%BA%86%E5%8E%86%E6%96%B0%E6%94%BF',
      },
    ],
  },
  {
    id: 'movable-type',
    dynastyId: 'northern-song',
    title: '毕昇活字印刷',
    start: 1041,
    end: 1048,
    category: '文化',
    location: '汴京 · 今开封（区域参照）',
    coordinates: [114.31, 34.8],
    emperorIds: ['import-59fda90d0cb9'],
    summary: '胶泥活字技术被记载，印刷工艺出现重要创新。',
    content:
      '沈括《梦溪笔谈》记载，毕昇在庆历年间用胶泥制作活字，经过烧制、排版和固定进行印刷。具体发明年份和操作地点不能精确确定，故使用庆历年间的范围。地图以北宋都城作为时代参照，不声称是已证实的发明遗址。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级下册》PDF 第 65 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级下册.pdf#page=65',
      },
      {
        title: '延伸阅读 · 毕昇（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%AF%95%E6%98%87',
      },
    ],
  },
  {
    id: 'jingkang',
    dynastyId: 'northern-song',
    title: '靖康之变',
    start: 1126,
    end: 1127,
    category: '战争',
    location: '开封',
    coordinates: [114.31, 34.8],
    emperorIds: ['import-7a83509066bd', 'import-b419c90db337'],
    summary: '金军攻陷汴京并掳走徽钦二帝，北宋灭亡。',
    content:
      '金军两次大举南下，围攻北宋都城，最终攻破汴京，俘虏宋徽宗、宋钦宗及大批宗室与官民。北宋统治结束，赵构随后在南方重建宋政权。地图标记战争与俘掠发生的中心开封。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 63 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=63',
      },
      {
        title: '延伸阅读 · 靖康之变（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%9D%96%E5%BA%B7%E4%B9%8B%E5%8F%98',
      },
    ],
  },
  {
    id: 'caishi',
    dynastyId: 'southern-song',
    title: '采石之战',
    start: 1161,
    end: 1161,
    category: '战争',
    location: '采石矶 · 今马鞍山',
    coordinates: [118.47, 31.66],
    emperorIds: ['song-gao-zong'],
    summary: '宋军依托长江防线，阻击金军渡江。',
    content:
      '金主完颜亮大举南侵，宋方在采石一带组织水陆防御，虞允文参与督战。宋军阻止金军渡江，金军内部局势也随后发生变化。地图标记采石矶，并非整场南侵战争的全部战场。',
    sources: [
      {
        title: '维基百科 · 赵构',
        url: 'https://zh.wikipedia.org/wiki/%E8%B6%99%E6%A7%8B',
      },
      {
        title: '延伸阅读 · 采石之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%87%87%E7%9F%B3%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'xiangyang-siege',
    dynastyId: 'southern-song',
    title: '襄阳之战',
    start: 1268,
    end: 1273,
    category: '战争',
    location: '襄阳',
    coordinates: [112.14, 32.04],
    emperorIds: ['import-8632303510d1'],
    summary: '长期围攻后襄樊失守，南宋长江防线受到严重威胁。',
    content:
      '蒙古及其后建立的元朝长期围攻襄阳、樊城，双方围绕汉水交通与城防展开争夺。襄樊失守后，元军得以沿汉水进入长江流域，加速南宋覆亡。地图标记襄阳；事件跨越元朝定国号前后。',
    sources: [
      {
        title: '维基百科 · 宋度宗',
        url: 'https://zh.wikipedia.org/wiki/%E5%AE%8B%E5%BA%A6%E5%AE%97',
      },
      {
        title: '延伸阅读 · 襄阳之战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%A5%84%E9%98%B3%E4%B9%8B%E6%88%98',
      },
    ],
  },
  {
    id: 'yamen',
    dynastyId: 'southern-song',
    title: '崖山之战',
    start: 1279,
    end: 1279,
    category: '战争',
    location: '崖门 · 今江门新会',
    coordinates: [113.08, 22.27],
    emperorIds: ['import-6e78712419a9'],
    summary: '南宋最后的海上抵抗失败，宋朝统治结束。',
    content:
      '南宋流亡朝廷在崖门海域集结舰队，与元军决战后败亡，幼帝赵昺死亡。陆秀夫、张世杰等人的事迹成为后世记忆的重要部分。地图标记崖门海域，海岸线已随历史时期变化。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 68 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=68',
      },
      {
        title: '延伸阅读 · 崖山海战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%B4%96%E5%B1%B1%E6%B5%B7%E6%88%98',
      },
    ],
  },
  {
    id: 'shoushi-calendar',
    dynastyId: 'yuan',
    title: '颁行授时历',
    start: 1281,
    end: 1281,
    category: '文化',
    location: '大都 · 今北京',
    coordinates: [116.4, 39.9],
    emperorIds: ['yuan-shi-zu'],
    summary: '郭守敬等改进观测与历算，形成影响深远的历法。',
    content:
      '元廷组织大规模天文观测，郭守敬、王恂等参与历法编制，授时历于1281年颁行。其历算方法与测量工作对后来的历法具有重要影响。地图标记大都的历法编制、颁行中心。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 80 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=80',
      },
      {
        title: '延伸阅读 · 授时历（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%8E%88%E6%97%B6%E5%8E%86',
      },
    ],
  },
  {
    id: 'tonghui-canal',
    dynastyId: 'yuan',
    title: '通惠河开凿',
    start: 1292,
    end: 1293,
    category: '建设',
    location: '大都 · 今北京',
    coordinates: [116.4, 39.9],
    emperorIds: ['yuan-shi-zu'],
    summary: '通惠河连接大都与通州水运，改善漕粮运输。',
    content:
      '郭守敬主持相关水利规划，利用北京一带水源组织河道与船闸，使漕船能够更接近大都。通惠河是元代漕运体系的一部分，后世河道和通航条件又有变化。地图标记大都端点，不绘制未经复原的完整河线。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级下册》PDF 第 69 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级下册.pdf#page=69',
      },
      {
        title: '延伸阅读 · 通惠河（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%80%9A%E6%83%A0%E6%B2%B3',
      },
    ],
  },
  {
    id: 'ming-founding',
    dynastyId: 'ming',
    title: '明朝建立',
    start: 1368,
    end: 1368,
    category: '政治',
    location: '应天府 · 今南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['ming-tai-zu'],
    summary: '朱元璋在应天称帝，明朝建立并继续推进统一战争。',
    content:
      '朱元璋称帝、定国号大明，以应天府为都城，并派军北伐，攻取元大都。元朝中央退往北方，各地军事竞争并未立即结束。地图标记明朝最初的政治中心应天府。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 84 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=84',
      },
      {
        title: '延伸阅读 · 明朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%98%8E%E6%9C%9D',
      },
    ],
  },
  {
    id: 'jingnan',
    dynastyId: 'ming',
    title: '靖难之役',
    start: 1399,
    end: 1402,
    category: '战争',
    location: '南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['import-c20ac6251367', 'ming-cheng-zu'],
    summary: '燕王朱棣起兵夺位，明初皇权继承发生剧变。',
    content:
      '建文帝削藩引发朱棣起兵，战争从北方逐步推进至南京。朱棣攻取南京后即帝位，建文帝的结局存在史料争议。地图标记战争终局所在地南京，不将路线简化为一处战场。',
    sources: [
      {
        title: '教材背景 · 《义务教育教科书·中国历史·七年级下册》PDF 第 85 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/初中/历史/统编版-人民教育出版社/七年级/义务教育教科书·历史七年级下册.pdf#page=85',
      },
      {
        title: '延伸阅读 · 靖难之役（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E9%9D%96%E9%9A%BE%E4%B9%8B%E5%BD%B9',
      },
    ],
  },
  {
    id: 'yongle-encyclopedia',
    dynastyId: 'ming',
    title: '编纂《永乐大典》',
    start: 1403,
    end: 1408,
    category: '文化',
    location: '南京',
    coordinates: [118.78, 32.06],
    emperorIds: ['ming-cheng-zu'],
    summary: '朝廷组织大规模类书编纂，汇集古代文献。',
    content:
      '明成祖命解缙、姚广孝等组织编纂，搜集经史子集等多类书籍内容，最终形成规模庞大的《永乐大典》。全书后经历抄录、散佚与损毁，现存仅为少部分。地图标记主要编纂地南京。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 98 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=98',
      },
      {
        title: '延伸阅读 · 永乐大典（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%B0%B8%E4%B9%90%E5%A4%A7%E5%85%B8',
      },
    ],
  },
  {
    id: 'tumu',
    dynastyId: 'ming',
    title: '土木堡之变',
    start: 1449,
    end: 1449,
    category: '战争',
    location: '土木堡 · 今怀来',
    coordinates: [115.52, 40.39],
    emperorIds: ['ming-ying-zong', 'import-5e8924d4470f'],
    summary: '明军北征失败，皇帝被俘，引发京师防御与皇位更替。',
    content:
      '明英宗亲征瓦剌，在土木堡一带遭围，明军遭受惨败，英宗被俘。朝廷随后拥立景帝，组织北京防御。地图标记土木堡约址；英宗回国与后来复位是后续不同事件。',
    sources: [
      {
        title: '维基百科 · 明英宗',
        url: 'https://zh.wikipedia.org/wiki/%E6%98%8E%E8%8B%B1%E5%AE%97',
      },
      {
        title: '维基百科 · 景泰帝',
        url: 'https://zh.wikipedia.org/wiki/%E6%99%AF%E6%B3%B0%E5%B8%9D',
      },
      {
        title: '延伸阅读 · 土木堡之变（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%9C%9F%E6%9C%A8%E5%A0%A1%E4%B9%8B%E5%8F%98',
      },
    ],
  },
  {
    id: 'single-whip',
    dynastyId: 'ming',
    title: '推广一条鞭法',
    start: 1581,
    end: 1581,
    category: '政治',
    location: '北京',
    coordinates: [116.4, 39.9],
    emperorIds: ['import-1ae73364810e'],
    summary: '赋役项目归并、更多折银征收，推动明代财政制度变化。',
    content:
      '一条鞭法在各地已有试行，张居正执政时期进一步推广，将多项赋役归并征收，并扩大折银缴纳。各地实施并不完全一致，1581年为通常采用的全国推广节点。地图标记中央决策所在地北京。',
    sources: [
      {
        title: '维基百科 · 明神宗',
        url: 'https://zh.wikipedia.org/wiki/%E6%98%8E%E7%A5%9E%E5%AE%97',
      },
      {
        title: '延伸阅读 · 一条鞭法（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%80%E6%9D%A1%E9%9E%AD%E6%B3%95',
      },
    ],
  },
  {
    id: 'qing-name',
    dynastyId: 'qing',
    title: '皇太极改国号为清',
    start: 1636,
    end: 1636,
    category: '政治',
    location: '盛京 · 今沈阳',
    coordinates: [123.43, 41.8],
    emperorIds: ['import-db219dc2b5be'],
    summary: '后金改国号为大清，皇太极称帝。',
    content:
      '皇太极在整合满洲、蒙古等政治力量的背景下称帝，将国号由金改为清。这一变化早于清军入关，不能把1636年与1644年混为同一建国节点。地图标记当时政治中心盛京。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 87 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=87',
      },
      {
        title: '延伸阅读 · 清朝（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%B8%85%E6%9C%9D',
      },
    ],
  },
  {
    id: 'three-feudatories',
    dynastyId: 'qing',
    title: '三藩之乱',
    start: 1673,
    end: 1681,
    category: '战争',
    location: '昆明',
    coordinates: [102.71, 25.04],
    emperorIds: ['qing-kang-xi'],
    summary: '撤藩引发大规模战争，平乱后清廷加强对地方的控制。',
    content:
      '清廷推进撤藩，吴三桂等先后起兵，战争波及南方多省。清军最终攻取昆明，三藩势力被消灭。地图标记吴三桂集团的重要中心与战争终局所在地昆明。',
    sources: [
      {
        title: '维基百科 · 康熙帝',
        url: 'https://zh.wikipedia.org/wiki/%E5%BA%B7%E7%86%99%E5%B8%9D',
      },
      {
        title: '延伸阅读 · 三藩之乱（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E4%B8%89%E8%97%A9%E4%B9%8B%E4%B9%B1',
      },
    ],
  },
  {
    id: 'qing-taiwan',
    dynastyId: 'qing',
    title: '清军进取台湾',
    start: 1683,
    end: 1683,
    category: '战争',
    location: '澎湖',
    coordinates: [119.57, 23.57],
    emperorIds: ['qing-kang-xi'],
    summary: '澎湖海战后郑氏政权归降，台湾行政建置随后调整。',
    content:
      '施琅率清军在澎湖击败郑氏舰队，郑克塽随后归降。清廷在次年设置台湾府，隶属福建；海战、归降和设府应区分时间。地图标记澎湖这一关键海战区域。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 90 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=90',
      },
      {
        title: '延伸阅读 · 澎湖海战（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%BE%8E%E6%B9%96%E6%B5%B7%E6%88%98',
      },
    ],
  },
  {
    id: 'opium-war',
    dynastyId: 'qing',
    title: '第一次鸦片战争',
    start: 1840,
    end: 1842,
    category: '战争',
    location: '虎门',
    coordinates: [113.67, 22.79],
    emperorIds: ['import-78edb83a61f2'],
    summary: '英国对华发动战争，清朝在军事失败后被迫签订条约。',
    content:
      '围绕鸦片贸易、禁烟和通商关系的冲突升级为战争，英军先后沿中国海岸及长江作战。清朝战败后签订《南京条约》，中国的主权和对外关系发生重大变化。地图标记虎门战区，不表示战争只发生在珠江口。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 105 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=105',
      },
      {
        title: '延伸阅读 · 第一次鸦片战争（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E7%AC%AC%E4%B8%80%E6%AC%A1%E9%B8%A6%E7%89%87%E6%88%98%E4%BA%89',
      },
    ],
  },
  {
    id: 'nanjing-treaty',
    dynastyId: 'qing',
    title: '《南京条约》签订',
    start: 1842,
    end: 1842,
    category: '交流',
    location: '南京下关江面',
    coordinates: [118.75, 32.09],
    emperorIds: ['import-78edb83a61f2'],
    summary: '清政府与英国签订条约，割地、赔款并开放通商口岸。',
    content:
      '《南京条约》规定割让香港岛、赔款及开放广州、厦门、福州、宁波、上海等口岸。条约及后续约章严重损害中国主权，并改变沿海通商体系。地图标记南京下关附近江面，表示条约签订位置的概略参照。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 105 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=105',
      },
      {
        title: '延伸阅读 · 南京条约（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E5%8D%97%E4%BA%AC%E6%9D%A1%E7%BA%A6',
      },
    ],
  },
  {
    id: 'self-strengthening',
    dynastyId: 'qing',
    title: '洋务运动',
    start: 1861,
    end: 1895,
    category: '建设',
    location: '江南制造总局 · 上海',
    coordinates: [121.49, 31.19],
    emperorIds: ['import-87f236261403', 'import-8b2c0a9c5a51'],
    summary: '清朝部分官员兴办军事、民用企业及新式教育。',
    content:
      '以自强、求富为目标的洋务活动涉及军工、航运、矿业、学堂与留学等领域，李鸿章、曾国藩、左宗棠、张之洞等参与推进。其作用与局限须结合具体项目理解，不能将各地活动视为统一执行的一项计划。地图选择上海江南制造总局所在地作为代表。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 111 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=111',
      },
      {
        title: '延伸阅读 · 洋务运动（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E6%B4%8B%E5%8A%A1%E8%BF%90%E5%8A%A8',
      },
    ],
  },
  {
    id: 'xinhai',
    dynastyId: 'qing',
    title: '辛亥革命',
    start: 1911,
    end: 1912,
    category: '政治',
    location: '武昌',
    coordinates: [114.3, 30.55],
    emperorIds: ['qing-pu-yi'],
    summary: '武昌起义及各省响应推动清朝覆亡和共和政体建立。',
    content:
      '武昌起义后，多省先后宣布独立，革命派与清廷、北洋势力之间展开军事和政治博弈。中华民国成立，清帝随后退位，帝制结束。地图标记武昌这一重要起点，不把全国革命活动压缩为单一城市事件。',
    sources: [
      {
        title: '教材背景 · 《普通高中教科书·历史必修·中外历史纲要（上）》PDF 第 125 页（公开存档）',
        url: 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7/高中/历史/统编版-人民教育出版社/普通高中教科书·历史必修 中外历史纲要（上）.pdf#page=125',
      },
      {
        title: '延伸阅读 · 辛亥革命（维基百科）',
        url: 'https://zh.wikipedia.org/wiki/%E8%BE%9B%E4%BA%A5%E9%9D%A9%E5%91%BD',
      },
    ],
  },
] satisfies HistoricalEvent[];
