# 个人网站与面试复习

接续任务前先查看 Git 状态、最近的提交和 [进度](handoff/progress.md)，并阅读 [已定方案](handoff/decisions.md)。未提交的文件可能来自其他聊天，保留其现有内容。

GitHub Pages 从 `main` 的 `docs/` 目录发布。新版首页源码在 `homepage/`，用 `npm run build` 生成 `docs/index.html` 和 `docs/showcase/react/`，旧版主页在 `docs/classic/index.html`。新版的资源保留在 `docs/showcase/`。学习区在 `docs/study/`，由静态 HTML、CSS 和 JavaScript 实现。知识点内容放在 `topics.js`，请保留既有知识点 ID，浏览器进度和直达链接会用到它们。

根据原项目的源码或公开记录更新学习材料，并注明适用版本。区分项目现状、通用原理、改进设想和用户本人确认的贡献。公开仓库里只提交适合公开的内容。

每个可检查的阶段更新进度并提交。测试可通过站点目录的本地 HTTP 服务进行，例如在仓库根目录运行 `python3 -m http.server 8000 --directory docs`。
