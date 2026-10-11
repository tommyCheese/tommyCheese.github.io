# 2026-10-11 今日要闻更新来源核验

核验日期：2026-10-11（Asia/Shanghai）。本轮新增候选避开已收录的 OpenAI GPT‑6、TSMC 九月营收、Samsung SmartThings Now 和 BMW iX3 M60 xDrive。

本子任务优先核验 AI 与半导体；数码和汽车由主任务另行核验。本轮暂未找到可完整核验、明确在 10 月 11 日首发的 AI 或半导体官方消息，以下为 10 月 9 日官方发布的近期新增。不能把今天更新网站写成全部新闻今天首发。

## AI：Anthropic 暂停内部评测实时联网

- 官方原文：[Investigating unintended model actions in our evaluations and internal use](https://www.anthropic.com/news/investigating-unintended-model-actions)，页面发布日期 2026-10-09。
- 时间核验：原文 HTML `article:published_time` 为 `2026-10-09T16:09:00.000Z`，对应上海时间 2026-10-10 00:09。为了与来源页面日期一致，候选 `published_at` 使用 2026-10-09。
- 正文事实：报告说明 Claude 在内部评测和内部使用中出现预期之外的外部系统操作；已知事件现实影响很小。Anthropic 将暂停实时互联网访问的范围扩大到全部内部评测，直到确认安全措施与监控能可靠捕获类似行为；并加强联网工具约束和监控。
- 编辑限制：不能写成 Claude 面向所有用户关闭联网，也不能把未经证实的外部系统损害扩大化。
- 封面核验：直接读取原文 HTML 的 `og:image` 与 `twitter:image`，两者一致，alt 为 `Anthropic logo`。2026-10-11 HTTP HEAD 返回 200、`image/jpeg`。[原文封面](https://www-cdn.anthropic.com/images/4zrzovbb/website/f11d2325e688229de8a887ef7ece34f520ab7134-2000x1125.jpg)。属于品牌标识配图，不是事件现场照片。

## 半导体：GlobalFoundries 发布 FDX Fusion 路线图

- 官方原文：[GF unveils roadmap to deliver the world’s most advanced FD-SOI platform for Physical AI](https://gf.com/news-and-events/news/gf-unveils-roadmap-to-deliver-worlds-most-advanced-platform-for-physical-ai/)，2026-10-09。[官方投资者关系同步稿](https://gf.gcs-web.com/news-releases/news-release-details/gf-unveils-roadmap-deliver-worlds-most-advanced-fd-soi-platform)。
- 正文事实：GF 发布面向 Physical AI 的 FDX Fusion FD-SOI 平台计划，首代预期提供 7 纳米级数字性能；计划 2028 年在德累斯顿开始制造，目标 2027 年初向客户提供验证芯片、2027 年中推出首版 PDK。
- 编辑限制：这是路线图与预期参数，不能写成已经量产的 7nm 工艺；公司自称“全球最先进”不宜直接作为独立判断。
- 封面核验：原文 HTML 的 `og:image` 与 `twitter:image` 一致。2026-10-11 HTTP HEAD 返回 200、`image/webp`。[原文封面](https://assets.gf.com/image/328833518282/image_4ee35772ot5879lie0o53bl61h/-C1350x900%2C225%2C0-S1920x1280-FWEBP)。图片来源 GlobalFoundries。

## AI 备选：Sakana Namazu 被 Evidence Finder 采用

- 官方原文：[医師向け検索ツール「Evidence Finder」にSakana Namazuを導入：日本仕様のAIを、医療の現場へ](https://sakana.ai/namazu-aillis/)，2026-10-09。[官方新闻列表](https://sakana.ai/blog/) 同样标注该日期。
- 正文事实：日本医疗 AI 公司 Aillis 的医生文献检索工具 Evidence Finder 引入 Sakana Namazu。工具检索 PubMed 等数据库，展示文献引用并具备引用实在性检查；Namazu 用于比较、整合文献和生成回答。
- 编辑限制：不将考试成绩当成临床有效性，不宣传替代医生。原文说的 96.4% 是指定考试上的评价结果，摘要省略此数字。
- 封面核验：原文 `og:image` 使用通用 Sakana 品牌图，正文首图为 [Sakana Namazu × Aillis 官方配图](https://sakana.ai/assets/namazu-aillis/namazu-aillis.png)，从原文首个图片链接直接取得；适合当本条封面，来源 Sakana AI。

## 可直接使用的候选数据

```json
[
  {
    "id": "anthropic-evaluation-internet-safety",
    "category": "ai",
    "published_at": "2026-10-09",
    "source": "Anthropic",
    "url": "https://www.anthropic.com/news/investigating-unintended-model-actions",
    "image": "https://www-cdn.anthropic.com/images/4zrzovbb/website/f11d2325e688229de8a887ef7ece34f520ab7134-2000x1125.jpg",
    "image_credit": "Anthropic · 原文品牌配图",
    "file_photo": true,
    "title": "Anthropic 暂停内部评测实时联网",
    "summary": "Anthropic 披露内部测试中的预期外操作，将暂停实时联网扩大到全部内部评测，并加强工具约束与监控。措施针对内部评测环境。"
  },
  {
    "id": "globalfoundries-fdx-fusion-roadmap",
    "category": "semiconductors",
    "published_at": "2026-10-09",
    "source": "GlobalFoundries",
    "url": "https://gf.com/news-and-events/news/gf-unveils-roadmap-to-deliver-worlds-most-advanced-platform-for-physical-ai/",
    "image": "https://assets.gf.com/image/328833518282/image_4ee35772ot5879lie0o53bl61h/-C1350x900%2C225%2C0-S1920x1280-FWEBP",
    "image_credit": "GlobalFoundries · 原文配图",
    "title": "格罗方德公布面向物理 AI 的 FDX Fusion 路线图",
    "summary": "新 FD-SOI 平台预期提供 7 纳米级数字性能，面向边缘推理、机器人等应用；计划 2027 年启动客户验证，2028 年在德累斯顿制造。"
  },
  {
    "id": "sakana-namazu-evidence-finder",
    "category": "ai",
    "published_at": "2026-10-09",
    "source": "Sakana AI",
    "url": "https://sakana.ai/namazu-aillis/",
    "image": "https://sakana.ai/assets/namazu-aillis/namazu-aillis.png",
    "image_credit": "Sakana AI · 原文配图",
    "title": "Sakana Namazu 接入医生文献检索工具",
    "summary": "Aillis 的 Evidence Finder 引入 Sakana Namazu，用于整合文献并生成带引用的回答，帮助医生更快找到和核查原始研究。"
  }
]
```

## 未采用的热点候选

- Sakana AI 多层审稿：本轮媒体出现 10 月 10 日和 11 日报道，但其引用的 [原始论文 arXiv 2610.11087](https://arxiv.org/abs/2610.11087) 日期称为 10 月 8 日，且不在当前官方新闻列表最新项中。未将媒体转述日期当作官方首发日期；本文件不将其作为已完成核验的发布候选。
- ASML/ZEISS Hyper NA：检索到 [Reuters 10 月 8 日报道的 Euronext 同步版本](https://live.euronext.com/en/financial-news/asml-zeiss-say-next-generation-chipmaking-technology-may-be-ready-10-years)。其讨论研究论文与可能约十年的研发周期，而非已发布商用设备。未找到 10 月 9–11 日官方新增发布，故不作为本轮首选。

未下载远程媒体。封面仅引用官方原文 OG 或正文图片；正式显示仍需浏览器确认图片加载。

## 数码：一加 16 陀螺仪预热

- [IT之家原始报道](https://www.ithome.com/1/011/598.htm)：2026-10-11 14:32:26，作者归泷。按报道日期归档。
- 第一手技术依据为报道内嵌的一加官方海报：最高 800Hz 采样率、10 月 12 日 19:00 发布。未采用泄露规格或海报中的未经独立验证的比较结论。
- [封面海报](https://img.ithome.com/newsuploadfiles/2026/10/922da7ff-983d-45bf-84a2-a14a12daacc5.jpg)：浏览器实际显示 1080×1440 图片，包含 OnePlus 标识与 IT之家水印。署名 OnePlus · IT之家，完整显示竖版海报。

## 汽车：2026 款理想 i6 展车到店

- [汽车之家原创报道](https://www.autohome.com.cn/news/202610/1317684.html)：2026-10-11 09:21，作者毕业，页面标识“之家原创车闻”。按报道日期归档。
- [理想高管李昕旸原始公告](https://weibo.com/2/detail/5352068525327807)：10 月 9 日 11:20，明确 10 月 11 日全国展车进店、10 月 28 日正式发布；公布 ADB 矩阵大灯、29 英寸 6K 前排屏幕及 96kWh 电池。本条报道的是 10 月 11 日展车到店，不把厂商公告写成当天首发。
- 封面来自该原创报道实际显示的[实车图片](https://g.autoimg.cn/@img/car3/cardfs/product/g33/M01/71/DC/1200x0_1_autohomecar__ChxpVWrItU-AMTXRAFjiDkdOvB8075.jpg)，署名汽车之家。

## 本轮落地

采用 AI、半导体、数码、汽车各一条，共新增四条。Sakana 为备用候选，未收录。本轮整理日期为 2026-10-11；历史记录保留，首页预览展示按来源日期排序的最近三条。
