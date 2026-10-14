# 新闻来源核验：2026-10-15

本轮整理日期为上海时区 2026-10-15；以下发布日期采用来源正文标注，未将抓取日期或图片上传日期作为新闻发布日期。已与 `i18n/news.json` 的现有条目去重。

## AI：Gemini 4 Argon 上线 Google Cloud

- 建议 ID：`google-gemini4-argon-cloud`；分类：`ai`。
- 官方来源：[Google Cloud：Gemini 4 Argon available on Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud)。正文发布日期为 **2026-10-13**，署名 Michael Gerstenhaber。
- 建议标题：**Gemini 4 Argon 上线 Google Cloud**。
- 建议摘要：**Google 将 Gemini 4 Argon 引入 Google Cloud，面向复杂编程、长文档分析和多步骤企业任务，开发者可通过 API 调用。**
- 正文确认发布及 API 可用性，模型 ID 为 `gemini-4-argon`。能力描述是厂商定位；不把官方评测或客户案例表述为独立验证结果，也不推断所有地区、账户或套餐均可使用。[来源](https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud)
- 配图取自该页 `og:image`，也在正文题图中出现：[官方题图](https://storage.googleapis.com/gweb-cloudblog-publish/images/Gemini_4_argon.max-2500x2500.jpg)。署名 **Google Cloud**；是该篇新闻配图，不标记资料图。
- HTTP 核验：正文通过 HTTPS 正常返回；图片 HEAD 返回 **200**，`Content-Type: image/jpeg`，`Content-Length: 51088`。

## 半导体：SK 海力士介绍 3D FeNAND 存算一体研究

- 建议 ID：`sk-hynix-3d-fenand-compute-research`；分类：`semiconductors`。
- 官方来源：[SK hynix：In the AI era, NAND moves beyond storage to computing](https://news.skhynix.com/en/research-inside-ep2/)。正文发布日期为 **2026-10-14**。
- 建议标题：**SK 海力士详解 3D FeNAND 存算一体研究**。
- 采用摘要：**SK 海力士解读 IEDM 2025 论文，介绍 3D FeNAND 存储单元、互连与页面方案的协同优化，探索降低 AI 计算的数据搬运开销。**
- 正文明确论文题为 *Co-Optimizing Cell, Non-Cell, and Page Schemes for Energy Efficient Analog Computing in 3D FeNAND*，发表在 **2025 IEEE International Electron Devices Meeting（IEDM）**。2026-10-14 是新闻解读日期，不是论文首次发表或产品上市日期。[来源](https://news.skhynix.com/en/research-inside-ep2/)
- 正文讨论模拟存内计算以及单元、非单元互连和页面方案的联合优化。卡片省略厂商给出的性能倍数，以免把特定条件下的研究比较扩展为量产芯片、通用 AI 系统或整机的实测收益。[来源](https://news.skhynix.com/en/research-inside-ep2/)
- 配图取自该页 `og:image`：[官方题图](https://d18r0a86za96sg.cloudfront.net/wp-content/uploads/2026/10/08132621/research-inside-ep2-Thumb.jpg)。署名 **SK hynix**；属于该篇研究解读的配图，不标记资料图。
- HTTP 核验：正文通过 HTTPS 正常返回；图片 HEAD 返回 **200**，`Content-Type: image/jpeg`，`Content-Length: 960034`。图片上传于 10 月 8 日，不据此改写新闻发布日期。

## 数码：Samsung Health 更新睡眠指导

- 官方原文：[Samsung Health makes Sleep Coaching easier to start and tailors weekly guidance](https://news.samsung.com/global/samsung-health-makes-sleep-coaching-easier-to-start-and-tailors-weekly-guidance)，页面日期 **2026-10-14**。
- 睡眠指导调整为收集最近两周中三天的睡眠记录即可启动，并按周调整建议；跑步训练由 10 级扩展至 12 级。更新自 10 月起逐步推出，地区及设备支持可能不同。
- 摘要未纳入不面向中国提供的 Strava 功能，不将这些健康辅助功能表述为医疗诊断或治疗效果。
- [睡眠指导配图](https://img.global.news.samsung.com/global/wp-content/uploads/2026/10/13095013/Samsung-Mobile-Samsung-Health-Sleep-Coaching_Main1.jpg) 来自原文正文图片链接，署名 Samsung Electronics，使用 `contain` 完整展示。HEAD 返回 **200**、`image/jpeg`。

## 汽车：上汽亮相 2026 工博会

- 官方原文：[上汽集团新能源“全明星阵容”亮相2026工博会](https://www.saicmotor.com/chinese/xwzx/xwk/2026/65558.shtml)，页面日期 **2026-10-13**；展会日期为 **10 月 12–16 日**。
- 正文列出荣威家越 07、MG 07、智己 LS8 NEO 纯电等车型和智己全线控 AI 概念舱，并称智己 LS8 NEO 纯电首次公开亮相。摘要只记录展出内容，省略厂商最高级营销表述与性能比较。
- [上汽展台配图](https://www.saicmotor.com/chinese/images/xwzx/xwk/2026/2026/10/13/A2D552EC9E8B4C32A79CA6F3230822F8.jpg) 来自原文“工博会上汽展台”图片链接，署名上汽集团。HEAD 返回 **200**、`image/jpeg`。

## 本轮更新

四个分类各追加一条，保留此前八条新闻。五种语言同步标题和摘要；首页仍展示按来源日期排序的最近三条，完整时间流保留全部十二条。整理日期为 2026-10-15，新增新闻按 10 月 13 日、14 日原文日期归档。
