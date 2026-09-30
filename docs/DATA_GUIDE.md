# 数据维护指南

## 新增人物

1. 在 `src/data/emperors.ts` 新增一条 `Emperor`，分配稳定、唯一的 ID。
2. `dynastyId` 必须匹配已有朝代。填写生卒、简介、功绩、评价及具体来源 URL。
3. 多次在位使用多个 `reigns`，不要用一个大区间包含被废期间。年份为历史纪年整数，公元前使用负数，不使用0年。
4. 用 `parentNames` 保存有明确来源的父亲名称；在位区间用于生成更替视图，不能据相邻年份推断血缘。原有 `src/data/succession.ts` 仍保留校订过的更替说明。
5. 必要时在事件的 `emperorIds` 加入该人物，页面会自动关联。

## 新增事件

当前共 101 件事件，由 `src/data/events.ts` 统一导出。原有 26 件行式记录依次为 ID、朝代 ID、标题、起年、止年、类型、地点、经纬度、关联帝王 ID、摘要、正文、来源条目名；70 件补充事件在 `src/data/events-expanded.ts` 中以完整 `HistoricalEvent` 对象人工维护；5 件西域治理事件在 `src/data/westernRegions.ts` 中独立维护。不要把人工校订内容放入生成目录。

新增事件使用稳定 ID 和最终 `emperors` 中的关联人物 ID，提供具体来源名称与 URL。跨朝代活动归入一个主要专题，并在正文明确跨度。地点只代表事件的一个入口；行军、旅行、运河等多地点活动需要在正文说明地图标记的角色。教材背景页、人物缓存和延伸阅读的区别及尚待核验的条目见 [EVENT_SOURCES.md](EVENT_SOURCES.md)。地图、列表、人物关联和语音共用该数据，无需各自复制事件正文。

## 新增朝代与疆域

朝代专题在 `src/data/dynasties.ts` 维护起止、都城、色彩、概要与来源，导入政权由名录索引扩展。历史边界与界面分离，不通过填入手绘多边形补齐地图；坐标顺序为 `[经度, 纬度]`，仍需检查闭环、自相交、都城位置和年份。

当前地图分为教材单朝参考图 `public/data/textbook-boundaries.json`、并立场景 `public/data/conflict-boundaries.json` 和旧版 `public/data/historical-boundaries.json`。前两者由 `scripts/georeference_textbook.py` 按 `textbook-maps.json`、`conflict-maps.json` 配置生成，同时更新场景快捷入口索引。旧版采集器 `scripts/collect_boundaries.py` 只维护旧快照。

`src/domain/boundaries.ts` 合并来源并统一球面环方向：只自动选择与所选范围相交的参考图，教材优先，然后比较与时间中点的距离；没有匹配时提示缺图，不使用手绘回退。西汉、唐、清被替换的 5 个旧快照始终排除。范围外年份只能手动参考，不能把参考年改写为筛选年，也不能用逐年插值冒充历史证据。

新增并立场景须使用同年参考资料，各政权提供颜色、标签、都城、关联朝代 ID 和轮廓。先核查 [BOUNDARY_SOURCES.md](BOUNDARY_SOURCES.md) 的来源、许可、配准规则和缺口；教材衍生数据不能标为官方 GIS。

## 参考资料与质量

每条资料必须携带可阅读的来源名称与 URL。现有种子数据采用百科条目做检索入口；正式发布前应增加可核验的原始史料卷次、页码、历史地图版本和审阅信息。将有争议的年代或评价写进说明，不静默选择一说。

建议后续增加 `reviewStatus`、`reviewedAt`、`reviewedBy` 与资料版本号。地图数据宜增加许可证和获取日期字段。新增数据完成后运行 `npm test`、`npm run build`；涉及交互时再运行 `npm run test:e2e`。

## 自动导入资料

不要直接修改 `src/data/generated/` 来做长期校订：再次采集会覆盖它。请在校订人物数组维护覆盖字段；采集器和正文拆分流程见 [DATA_IMPORT.md](DATA_IMPORT.md)。
