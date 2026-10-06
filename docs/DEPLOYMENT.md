# PWA 与 GitHub Pages

仓库：https://github.com/keosu/dynasty

站点：https://keosu.github.io/dynasty/

## 自动发布

`.github/workflows/pages.yml` 在推送 `main` 或手动运行时发布，PR 只验证。使用 Node.js 24、`npm ci`，依次执行单元测试、原有 Playwright 用例、生产 PWA 用例，再根据 Pages 返回的 `base_path` 构建并上传 `dist/`，由官方 Pages Actions 部署。

仓库 Settings → Pages → Build and deployment 的 Source 必须为 **GitHub Actions**。工作流使用仓库自带的 `GITHUB_TOKEN`，无需另存 PAT；构建只有 contents/read 和 pages/read，部署作业只有 pages/write 和 id-token/write。`github-pages` 环境记录部署，生产部署串行执行。仓库可见性为 Public；`package.json` 的 `private: true` 仅防止误发布到 npm，与 GitHub 可见性无关。

更换仓库名时，实际部署路径会跟随 Pages 设置；同时修改 `build:pages`、`playwright.pwa.config.ts`、PWA 用例及文档中的本地验证路径。Hash 路由无需 404 回退规则。人物与地图请求沿用 `import.meta.env.BASE_URL`，不能改成 `/data/` 绝对根路径。

## 安装与离线

- Chrome / Edge 等支持安装的浏览器可使用顶部安装按钮或浏览器菜单。按钮只在浏览器发出安装事件时出现，已安装状态隐藏。
- iPhone / iPad：Safari → 分享 → 添加到主屏幕。应用内“关于”也保留说明。
- 清单提供中文名称、standalone 显示模式、相对的 id/start_url/scope、192/512px PNG、独立 maskable 图标与 Apple touch 图标。`scripts/generate-pwa-icons.mjs` 从现有 `public/favicon.svg` 生成，不依赖字体或外部图片。
- 仅生产构建注册 Service Worker。`vite-plugin-pwa` / Workbox 将 JS、CSS、HTML、图标、地图 JSON/GeoJSON 及本地数据许可证一起预缓存，出现“已可离线使用”即完成。未访问过地图页也能在离线后打开地图。
- 人物正文不预先全量下载；同源 `data/biographies/*.json` 使用 NetworkFirst，3 秒网络超时后可返回缓存，只保存成功响应，最多 400 份、30 天。未缓存正文显示已有加载失败提示，人物简介仍在应用目录中。
- 新构建按文件内容修订缓存；使用提示更新，用户点击“立即更新”后新 worker 接管并刷新页面。保留 Hash 路由及主题偏好，内存中的地图筛选会重置；长期打开的应用在回到前台时检查更新。
- 未读正文、外部来源和部分系统语音需要网络。离线缓存受浏览器容量与清理策略影响，不承诺永久保存。

## 验证与排查

```sh
npm test
npm run test:e2e
npm run test:pwa
npm run build:pages
npm run preview -- --base=/dynasty/
```

PWA 测试启动独立生产预览，在 `/dynasty/` 验证清单、图标、Service Worker 范围、断网刷新、未访问过的地图、已读／未读正文、手机安装按钮及真实 worker 更新。更新用例短暂修改 `dist/sw.js`，结束后恢复；请勿对正在部署的构建目录运行测试。工作流在用例完成后重新构建正式产物。

默认交互测试端口 5173，PWA 测试端口 4173；若已有服务占用，可设置 `PLAYWRIGHT_PORT` 或 `PWA_PORT`。测试不复用旧服务，避免测到其他工作目录。Windows 示例：`$env:PWA_PORT='4178'; npm run test:pwa`。

Pages 空白或资源 404 时先检查 Actions 构建与 Pages Source，再检查清单、脚本和 `data/` 地址是否包含 `/dynasty/`。PWA 需 HTTPS 或 localhost。浏览器 Application → Service Workers / Cache Storage 可查看安装与缓存状态；排查旧缓存时可清理本站存储，再联网重开。不要为排查部署重新抓取人物或生成地图。
