# 公开资料采集与版本维护

## 已采集结果

本次从中文维基百科《中国君主列表》的秦至清主表提取 **392 条君主记录，65 个政权专题**，并获取了全部 392 条对应人物条目的正文。原有 35 位校订人物与导入条目按姓名、帝号和来源别名合并，最终仍为 392 位，不重复计算赵光义／赵炅等同一人物。

覆盖主表中的三国、两晋、十六国、南北朝、五代十国、辽、西辽、西夏、金、元、北元、明、南明与清等。来源表还包含部分称王、摄政、追尊、自立与复辟记录，因此条目总数不应直接解释为中国历史上正式称帝者的唯一总数。传说时代、先秦诸侯、中华帝国和主表以外的所有地方自立政权不在本次采集范围。

机器可读的实际采集时间、分政权数量、成功数与异常记录在 `src/data/generated/manifest.json`。本次正文成功数 392，未解决的采集异常为 0。自动采集并不代表所有史实都经过学术审订。

## 可重复运行

Python 3.10+。采集依赖隔离在项目虚拟环境中，不需要更改全局 Python。

```powershell
python -m venv .venv
.venv/Scripts/python -m pip install -r scripts/requirements.txt
.venv/Scripts/python -X utf8 scripts/collect_monarchs.py
.venv/Scripts/python -X utf8 scripts/collect_boundaries.py
```

采集器使用本地 `.cache/wikipedia/` 缓存。人物请求使用单线程与间隔；HTTP 429 退避后重试。再次执行会优先复用已下载的内容，不重复请求成功页面。需要更新某篇资料时可删除对应缓存文件；不要把运行采集器加入网站请求链路。

## 文件与合并

- `src/data/generated/monarchs.json`：完整提取记录，便于校对与复现。
- `src/data/generated/catalog.json`：轻量人物索引、概要、在位区间、亲属字段与正文 ID，供搜索和图表使用。
- `public/data/biographies/<ID>.json`：按人物拆分的正文与章节摘录，进入详情时加载。
- `src/data/emperors.ts`：已有校订资料与自动导入数据合并；已校订的简介、评价与在位区间优先，原文年代保留在 `reignText`。
- `src/data/dynasties.ts`：原有地理专题与新增政权目录合并；没有疆域来源的新政权使用空边界，不编造图形。

解析器展开 rowspan/colspan，并按上下文区分曹魏与北魏、孙吴与杨吴、南齐与北齐等同名政权。多段在位分别提取，例如唐昭宗的 888—900 与 901—904。原始在位文字保留，可发现、核对公历换算及源表差异。

血缘来源首先读取人物信息框与家族表中明确的父亲字段；缺失时只匹配概要中明确的“某人之子／第几子”等句式，并保存匹配证据。不会将相邻君主自动当作父子。图中的在位顺序和父子关系是两个独立视图；在位区间交叠以虚线标明，不能把年份排序当作已证实的直接继位。

## 地图来源

自然地理升级为 Natural Earth 1:50m 的陆地、河流与湖泊。它们表示现代自然地理，而非各朝代古河道复原。

旧版从 André Ourednik 与 Historical Basemaps 贡献者的开放数据中提取 **18 个历史快照**。此文件目前保留作为存档，其中西汉、唐、清的5个旧快照已停止使用；其余13个快照标为“旧版未校订”。

源库存在错误和缺口，例如700年文件的中国区域仍标示Sui Empire；旧前端将800年唐图用于包含盛唐的范围也造成西域遗漏。现在西汉、唐、清改用中国统编教材地图数字化参考，明确不是官方GIS。时间范围以外不自动套用快照，无图层时不回退到手绘轮廓。实际底本、配准和待完成范围见 [疆域校订记录](BOUNDARY_SOURCES.md)。

`public/data/historical-boundaries.json` 保留每个快照的源文件 URL、政权原名、年份与许可；`scripts/collect_boundaries.py` 是筛选与重建这些分发数据的源程序。

新资料独立保存在 `public/data/textbook-boundaries.json`，由 `scripts/georeference_textbook.py` 和 `scripts/textbook-maps.json` 生成，依赖见 `scripts/requirements-map.txt`。重跑旧采集器不会覆盖教材资料或恢复已淘汰图层。官方文字来源的西域事件在 `src/data/westernRegions.ts`。教材原图权利归原权利人，不声明开放许可；原教材审图号不适用于本站配准结果。

## 署名与许可

- 维基百科文字摘录：**CC BY-SA 4.0**。每条人物附具体原文链接；本项目进行了繁简转换、脚注清理和段落节选，没有宣称原文为本站原创。来源表有时也包含未称帝者，正文和原始字段保留上下文。
- Natural Earth：公有领域数据，来源与使用说明链接保留在地图和关于页面。
- Historical Basemaps：**GPL-3.0**。数据作者 André Ourednik 与项目贡献者；保留来源、原始属性和完整许可证 `public/data/licenses/historical-basemaps-GPL-3.0.txt`，分发的是源 GeoJSON 的指定要素子集。

发布或继续分发数据时，请连同署名、对应许可和数据源程序一起提供。代码与第三方数据分别管理。
