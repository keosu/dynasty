# 山河纪 · 开发交接

更新：2026-09-30。已建立 Git 基线并更新应用主题，新增可选的彩色暗色主题。本文是接续入口；来源细节保存在专题文档中。

## 五分钟接续

1. 先读本文的覆盖表、剩余工作和注意事项。
2. 按下方文件索引，只打开当前任务相关文件。不要全量读取 `src/data/generated/`、`public/data/biographies/` 或 `.cache/`。
3. 本地已有 `node_modules/` 和 Python `.venv/`。运行 `npm run dev` 启动，默认端口 5173；不要假定旧服务仍在运行。
4. 做疆域工作先读 [BOUNDARY_SOURCES.md](BOUNDARY_SOURCES.md)，查看对应地图配置；不要再次把 CHGIS 当作现成可再发布的历代疆域总库。

本目录已初始化本地 Git，主题改造前的基线提交为 `d465d35`；未配置远程或推送。缓存、依赖和构建产物仍由 `.gitignore` 排除，不能依赖 Git 恢复这些未跟踪文件。技术栈是 React 19 + TypeScript + Vite + D3 Geo + TopoJSON，纯静态，无后端及 API 密钥。路由为 Hash 路由。

## 已实现

- 三种主题：青瓷亮色（瓷白／湖蓝）、静夜暗色（深蓝）、琉璃夜色（墨底、青绿、琥珀、珊瑚、淡紫）。顶部调色盘可选择并保存，支持键盘方向键、Escape 和点击外部关闭；地图、世系和百科页面共用。固定视口地图、可折叠和调宽侧栏、移动端布局。
- 底部双端时间轴、键盘和年份输入、放大本朝；按时间范围筛选在位君主和热点事件。
- 地图缩放、拖动、事件聚合、图层开关、来源面板及手动参考年份。
- 392 条君主记录、65 个政权专题、392 份人物正文；正文按需加载。范围是维基百科《中国君主列表》秦至清主表，包含表内前身、延续、自立或摄政等记录，不是所有历史称帝者的最终全集。
- 31 件精选事件，其中 5 件为西域治理相关事件，来源文字与概略点位分开记录。
- 在位顺序图将复位分段；父子关系图只使用有来源的关系。人物简介、功绩、事件、评价和正文可查看。
- Web Speech API 讲解和播放控制；实际音色和联网需求取决于浏览器及系统语音包。
- 并立场景支持各政权着色、名称和都城、图例显隐、点击档案、参考年在位者和语音；快捷入口与时间轴分段联动。

## 疆域覆盖：不要误认为已经逐朝逐年齐全

| 数据           | 当前覆盖                                                                                                  | 维护入口                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 教材单朝参考图 | 西汉后期、唐 669 年、清 1820 年，包含西域                                                                 | `scripts/textbook-maps.json` → `public/data/textbook-boundaries.json`      |
| 三国同年场景   | 262 年：魏、蜀汉、吴                                                                                      | `scripts/conflict-maps.json` → `public/data/conflict-boundaries.json`      |
| 南北朝同年场景 | 572 年：北周、北齐、陈、后梁（西梁）                                                                      | 同上                                                                       |
| 宋辽夏同年场景 | 1111 年：北宋、辽、西夏                                                                                   | 同上                                                                       |
| 宋金夏同年场景 | 1142 年：南宋、金、西夏                                                                                   | 同上                                                                       |
| 旧版未校订快照 | 东汉 100/200、西晋 300、东晋 400、北魏 500、隋 600、北宋 1000/1100、南宋 1200、元 1300、明 1492/1500/1600 | `scripts/collect_boundaries.py` → `public/data/historical-boundaries.json` |

教材共 3 张单朝参考图、4 个并立场景（13 组政权轮廓）。它们来自中国统编教材的 PDF 色块配准，**不是官方 GIS**。旧文件保留 18 个快照，但运行时无条件排除西汉、唐、清的 5 个旧快照，只使用其余 13 个；教材加载失败也不恢复已淘汰轮廓。

西汉原图没有单一年份，界面显示“西汉后期”；检索区间 -60…8 不代表整个区间疆域不变。其余教材场景只代表标注年。自动选择须与筛选区间相交，教材优先于旧快照，再取离区间中点最近者；无匹配就显示缺图。范围外只能通过来源面板手动参考，改朝代或时间后取消指定。

## 剩余工作及建议顺序

1. 补充缺失疆域与更多参考年，优先秦、东汉等，以及南北朝不同阶段；不能把 572 年当作整个南北朝。
2. 补齐已开场景的周边政权：1111/1142 年的大理、1142 年西辽等目前未着色。场景内留白不表示当时没有政权。
3. 改善南北朝 572 年底本与配准精度。此图概化较强，控制点最大残差 18.88 像素、留出最大 28.54 像素（2 倍渲染）；明确采用 20/32 上限，其他场景仍为 10/18。指标衡量配准，不代表真实边界精度。
4. 校订其他 13 个社区旧快照，并增加地名、控制层级和证据。教材主图的南海附图尚未处理；572 年海南仅有图框内北部，不能自行补画。
5. 人物名录已完成该来源主表导入，但简介、功绩、评价质量和血缘完整度仍需逐项审订；可继续扩展可靠史料与重要事件。

没有待完成的代码迁移或必须恢复的生成进程。后续以用户新指令为准，上述顺序仅供接续参考。

## 按任务找文件

| 任务                             | 首先打开                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| 全局路由、朝代／区间状态、搜索   | `src/App.tsx`                                                                                  |
| 主题目录、持久化、启动时应用     | `src/theme.ts`、`src/main.tsx`；选择器在 `src/components/ThemePicker.tsx`                      |
| 工作区、筛选、面板、场景快捷入口 | `src/pages/AtlasPage.tsx`                                                                      |
| 地图加载、投影、缩放、路径与点击 | `src/components/HistoryMap.tsx`                                                                |
| 并立政权图例、当年在位者、讲解   | `src/components/ConflictLegend.tsx`                                                            |
| 双端时间轴和并立朝代分行         | `src/components/Timeline.tsx`                                                                  |
| 参考图合并、来源优先级、年份匹配 | `src/domain/boundaries.ts`                                                                     |
| 球面多边形环方向                 | `src/domain/mapGeometry.ts`                                                                    |
| 世系、更替、人物详情             | `src/pages/GenealogyPage.tsx`、`src/pages/EncyclopediaPages.tsx`                               |
| 校订数据                         | `src/data/emperors.ts`、`dynasties.ts`、`events.ts`、`westernRegions.ts`、`succession.ts`      |
| 导入索引、范围与统计             | `src/data/generated/catalog.json`、`manifest.json`、`monarchs.json`                            |
| 并立入口索引                     | `src/data/generated/conflict-periods.json`，由地图生成器输出                                   |
| 布局与样式                       | 依次加载 `src/styles.css`（基础）、`src/app.css`（工作区）、`src/themes.css`（配色和主题外观） |

更多说明：[ARCHITECTURE.md](ARCHITECTURE.md)、[DATA_GUIDE.md](DATA_GUIDE.md)、[DATA_IMPORT.md](DATA_IMPORT.md)。

## 数据维护中容易踩的坑

- `scripts/georeference_textbook.py` 同时生成单朝教材图、并立图和场景入口索引；修改配置后同步生成三个输出，不直接长期修补生成 JSON。
- PDF 路径索引与版本绑定，替换 PDF 必须重新核验散列、页码、路径、控制点。固定存档版本和 SHA-256 在 `textbook-maps.json`。
- `make_valid` 可能返回包含退化线段的 GeometryCollection，必须保留全部面分量，否则会漏掉主要陆地。小政权按明确层级裁除色块交叠，不随意改叠放顺序。
- 1142 年金都城为上京会宁府；572 年后梁是西梁，其君主关联梁朝专题 `polity-4d290326f6`，参考年为萧岿，不是五代后梁。
- 校订层与原始导入人物 ID 可能不同，关联人物前检查最终 `emperors` 数据，不仅查生成记录。世系不能从相邻在位年份推断亲子关系。
- `dynasties.ts` 中旧手绘多边形仍是元数据的一部分，不作为地图缺图回退；不要未经依赖分析就删整个字段或相关朝代分类逻辑。
- 样式加载顺序为 `styles.css` → `app.css` → `themes.css`，不能视为重复文件直接删除。主题 token 已集中到 `themes.css`；深色强调背景使用 `--on-accent` 深色文字，避免沿用白字导致低对比度。政权颜色仍由历史数据定义，不随主题替换。
- 主题 ID 保持 `light` / `dark` / `colorful`，沿用 `shanhe-theme` 本地存储键，兼容旧偏好。启动时先应用主题再挂载 React；无法访问本地存储仍可在当前会话切换。
- 主题卡片使用原生 label/radio。点击 label 时会先产生 `relatedTarget = null` 的失焦，再转发点击；不能在这个失焦时卸载面板，否则出现“选择主题没反应”。外部点击交给 pointerdown 处理，键盘移到外部可聚焦元素时才通过 blur 关闭。浏览器测试通过点击卡片文字选主题，避免直接 `.check()` 掩盖此类问题。
- CHGIS V4 已核查的 T-S 政权界线仅含闽、殷、清源、平海、东都、东宁等 11 个要素，不含汉唐西域全国轮廓；V4/V6 有商业与再发布限制，未导入。详情与链接在疆域来源文档。
- 国务院白皮书可验证西域治理年代，但不提供边界坐标。教材权利归原权利人；维基人物为 CC BY-SA 4.0，旧 Historical Basemaps 为 GPL-3.0，自然地理 Natural Earth 为公有领域。保留许可证及来源。

## 本地输入和目录清理策略

保留 `node_modules/`、`.venv/`，下次可直接启动；保留所有运行时人物、疆域和 1:50m 底图及许可证。

保留 `.cache/pep-0.pdf`（高中教材）、`pep-2.pdf`（七年级下册），这是当前生成器的输入；另保留 `pep-1.pdf`（七年级上册）供后续地图研究。保留 `.cache/wikipedia/` 避免重新抓取人物。上述缓存均忽略提交，不公开分发完整教材。生成器会按配置下载缺失的当前输入并核验散列。

保留 `.cache/official-source-*.html`、`fudan-0/1/2.html`、`chgis-0/1.html`、`more-0.html` 作为来源核查证据；文件含义见 [CLEANUP.md](CLEANUP.md)。

本次清理范围及实际记录见 [CLEANUP.md](CLEANUP.md)。可随时重建的 `dist/`、`test-results/`、`playwright-report/`、`*.tsbuildinfo`、Python 缓存不应当作交接资料。删除前确认绝对路径位于本项目内，不批量删除整个 `.cache/`。

## 运行与验证

```powershell
npm run dev
npm test
npm run build
npm run test:e2e
# 首次缺 Chromium 时：npx playwright install chromium

# 仅在更改地图配置、需要复现时运行：
.venv/Scripts/python -m pip install -r scripts/requirements-map.txt
.venv/Scripts/python -X utf8 scripts/georeference_textbook.py
```

人物采集器是 `scripts/collect_monarchs.py`，依赖 `scripts/requirements.txt`；不是常规验证步骤，使用前阅读数据导入说明。

最近一次功能实现验证（2026-09-23，整理前）：单元测试 4 个文件共 20 项通过；Playwright 14 项通过；生产构建通过。四个并立场景几何有效，成对重叠面积小于 1e-7。桌面四场景和移动布局已检查。

2026-09-30 主题更新验证：`npm test` 20 项通过，`npm run test:e2e` 14 项通过，`npm run build` 通过。现有主题用例扩展到三主题、点击卡片文字、键盘切换、刷新持久化和跨页面应用；移动用例验证选择器不超出屏幕。另以 Chromium 模拟手机触控，验证点击色块、说明和标题均可切换。桌面亮色、两种暗色、琉璃世系、并立地图和手机截图已检查。截图保存在忽略提交的 `test-results/`。并立截图现在也等待 250ms 的主题过渡，原先立即截图产生混合颜色的问题已处理。
