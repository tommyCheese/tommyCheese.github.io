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

## 10 月 15 日早间补充更新

核验时间：上海时区 2026-10-15 早间。以下五条追加到已有十二条之后的完整历史中；其中两条原文发布于 15 日，两条发布于 14 日，一条发布于 13 日。日期以官方页面正文为准，不采用中文转载日期。五种语言均同步标题和摘要。

### AI：三星预告硅谷未来无线峰会

- ID：`samsung-future-wireless-summit-2026`。
- [三星官方原文](https://news.samsung.com/global/samsung-hosts-silicon-valley-future-wireless-summit-2026)，正文标注 **2026-10-15**，HTTPS GET 返回 200。
- 峰会定于美国当地时间 10 月 15 日在加州山景城举行，Partner Day 为当地时间 14 日。正文列出的主题包括 AI 原生 6G、非地面网络、通感一体化，展示项目包括 AI-RAN。上海早间整理时使用“预告”“将举行”，不写成峰会已结束，也不把 6G 研究展示表述为商用部署。
- [封面](https://img.global.news.samsung.com/global/wp-content/uploads/2026/10/15072626/Samsung-Corporate-Silicon-Valley-Future-Wireless-Summit-2026_Thumb932F.jpg) 来自官方原文 `og:image`，署名 Samsung Electronics。HEAD 返回 200、`image/jpeg`、115515 字节；相关照片包含 14 日 Partner Day，不声称是 15 日峰会结束后的现场照。

### 数码：The Wall 城市与赛事控制室案例

- ID：`samsung-the-wall-control-rooms`。
- [三星官方原文](https://news.samsung.com/global/from-smart-city-to-race-circuit-samsungs-the-wall-in-control-rooms)，正文标注 **2026-10-15**，HTTPS GET 返回 200。
- 介绍马来西亚依斯干达公主城市政指挥中心与 NASCAR 远程赛事控制中心如何使用 The Wall 汇集视频和数据。这是应用案例解读，NASCAR 中心于 2025 年启用，不写成 2026 年 10 月 15 日首次安装或新品发布；摘要不采用厂商最高级用语或可靠性承诺。
- [封面](https://img.global.news.samsung.com/global/wp-content/uploads/2026/10/14151656/Samsung-TVs-and-Displays-Samsung-The-Wall-Control-Rooms_Thumb932.jpg) 来自原文 `og:image`，署名 Samsung Electronics。HEAD 返回 200、`image/jpeg`、149112 字节。

### AI：Grok Voice 3.0 上线 API

- ID：`grok-voice-3-api`。
- [官方发布](https://x.ai/news/grok-voice-3)，页面 `time` 与正文日期为 **2026-10-14**，HTTPS GET 返回 200。[官方开发者更新记录](https://docs.x.ai/developers/release-notes?release=2026-10-9b9dfeba) 同样列在 10 月 14 日。
- Voice Agent API 已提供 Grok Voice 3.0，`grok-voice-latest` 自动指向 `grok-voice-3.0`；官方宣布价格维持每分钟 0.08 美元。未将中文媒体 15 日报道日期用作发布日，不直接复述“全球最智能”等营销结论，未将厂商列出的评测表当作自行复测结果。
- 原文页面品牌为 SpaceXSI，署名采用该名称。[封面](https://media.x.ai/v1/website/og-grok-voice-3-0-b281361b.webp) 来自原文 `og:image`，HEAD 返回 200、`image/webp`、70740 字节。采用 `contain` 完整展示发布配图。

### 半导体：格罗方德纽约新晶圆厂计划

- ID：`globalfoundries-us-japan-new-york-fabs`。
- [官方投资者关系原文](https://investors.gf.com/news-releases/news-release-details/globalfoundries-selected-operate-two-new-semiconductor-fabs-new)，日期 **2026-10-14**；与[公司新闻稿](https://gf.com/news-and-events/news/globalfoundries-selected-to-operate-two-new-semiconductor-fabs-in-new-york-under-landmark-us-japan-initiative/)交叉核对。公司主站直接请求返回 403，因此卡片链接采用可访问的官方投资者关系版本。
- 美日合作计划拟提供最高 210 亿美元资金，GF 为纽约州马耳他两座新厂的技术提供者和运营商，首座 300 毫米晶圆厂预计 2029 年投运。投资额、建设及投运时间均为计划，不能写成资金全部到账或两座工厂已经量产；摘要不推断市场或股价影响。
- 使用已核验的 [GF 官方资料配图](https://assets.gf.com/image/328833518282/image_4ee35772ot5879lie0o53bl61h/-C1350x900%2C225%2C0-S1920x1280-FWEBP)，来源为[10 月 9 日 FDX Fusion 官方稿](https://gf.com/news-and-events/news/gf-unveils-roadmap-to-deliver-worlds-most-advanced-platform-for-physical-ai/)，详见本仓库 `news-sources-2026-10-11.md` 的图片核验。明确设置 `file_photo: true`、署名 GlobalFoundries，不将其描述为新厂、施工现场或本次发布照片。HEAD 复核返回 200、`image/webp`、1577186 字节。

### 汽车：Zero DS 单次充电续航纪录

- ID：`zero-ds-single-charge-record`。
- [Zero Motorcycles 官方原文](https://zeromotorcycles.com/stories/guinness-world-records-title)，正文标注 **2026-10-13**，HTTPS GET 返回 200。
- 公司公布电动摩托单次充电行驶的吉尼斯世界纪录：Jelle Verstaen 驾驶 Zero DS，搭配可购买的选装 Power Tank，总电量为 19.2kWh，行驶 436.5 公里。路线从阿尔卑斯地区前往地中海，包含有利于续航的路线规划和骑行条件；不将此纪录表述为标准工况、日常或高速续航。
- [封面](https://images.prismic.io/zero-cms-disco/HnRNb43hB7wzr1hV_zero-team-guinness-certificate-v5_YouTube.jpg?auto=format,compress&rect=0,39,2062,1083&w=1200&h=630) 来自官方原文 `og:image`，署名 Zero Motorcycles。HEAD 返回 200、`image/jpeg`、112404 字节。

补充后共十七条历史新闻；新增 10 月 15 日分组，首页仍按原文日期展示最近三条。未下载远程媒体，保留官方图片外链与署名。

## 10 月 15 日补充：扩展厂商与领域

核验时间：上海时区 2026-10-15 13:22。按用户要求增加三星以外的选题，四个分类各补充一条，保留既有十七条历史。日期仍采用链接原文的发布日期；14 日的官方发布不改写成 15 日。首页同日条目优先排列吉利、华为，再展示三星，保持三条预览且覆盖不同厂商。

### 汽车：吉利控股前三季度销量

- ID：`geely-holding-q3-2026-sales`。
- [IT之家原文](https://www.ithome.com/1/013/246.htm)，页面时间 **2026/10/15 10:31:10**，HTTPS GET 返回 200。报道引述吉利控股当日上午公布的数据，摘要明确归因 IT之家；集团口径不混同于吉利汽车上市公司口径。
- [正文首张销量配图](https://img.ithome.com/newsuploadfiles/2026/10/78ac68e4-ebcc-404d-a930-a046f9a095b5.png)，署名“吉利控股集团 · IT之家”，使用 `contain`。HEAD 返回 200、`image/png`、1316653 字节。

### 数码：华为自带线移动电源预售

- ID：`huawei-20000mah-100w-power-bank`。
- [IT之家原文](https://www.ithome.com/1/013/186.htm)，页面时间 **2026/10/15 9:25:13**，HTTPS GET 返回 200。报道预售于当日 10:08 开始，摘要使用预售状态与发布价格，不加入促销购买链接。
- [正文首张产品图](https://img.ithome.com/newsuploadfiles/2026/10/3e896851-4038-44ae-94e3-8095107c3c23.jpg)，署名“Huawei · IT之家”，使用 `contain`。HEAD 返回 200、`image/jpeg`、258640 字节。

### AI：Google Deep Review 公开发布

- ID：`google-deep-review-public-release`。
- [Google Research 官方原文](https://research.google/blog/analyzing-technical-documents-with-deep-review/)，日期 **2026-10-14**，HTTPS GET 返回 200。摘要按初期实际输入格式描述，不将后续多文件计划写成已上线，也不把辅助审阅写成准确性保证。
- [正文题图](https://storage.googleapis.com/gweb-research2023-media/original_images/DeepReview2.jpg)，署名 Google Research，使用 `contain`；未采用页面通用 `og:image`。HEAD 返回 200、`image/jpeg`、79482 字节。

### 半导体：NVIDIA cuPotential 与制造工具

- ID：`nvidia-cupotential-ai-defined-fabs`。
- [NVIDIA 官方原文](https://nvidianews.nvidia.com/news/nvidia-and-semiconductor-leaders-advance-ai-across-chip-design-and-manufacturing-for-ai-defined-labs)，日期 **2026-10-14**，HTTPS GET 返回 200。保留 cuPotential 的早期访问状态；省略厂商特定测试的加速倍数与对产能、良率的预测。
- [原文 `og:image`](https://iprsoftwaremedia.com/219/files/202610/91e4671418fd42dd611fce974f821286/6aceab1a3d6332051d5dc521_nvidia-and-semiconductor-leaders/nvidia-and-semiconductor-leaders_5ac54765-981c-4c26-b6c2-cdd8daa42e94-prv.jpg?v=5ac54765-981c-4c26-b6c2-cdd8daa42e94)，署名 NVIDIA。HEAD 返回 200、`image/jpeg`、746316 字节。

补充后共二十一条历史新闻；15 日分组四条，14 日分组六条。五种语言同步标题与摘要，沿用现有构建及预览逻辑。
