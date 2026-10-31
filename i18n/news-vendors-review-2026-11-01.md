# 2026-11-01 扩展厂商巡检与 Mistral 权重交付复核

本次上海时间约 03:12—03:16，先核对既有新闻及 10 月 31 日来源记录，在当日 Anthropic、OpenAI 官方入口优先巡检完成后，再开展本记录中的扩展检查。目标窗口为 10 月 30 日至 11 月 1 日，并回看前一日以补漏。时间是本次实际检查时间，不替代公告原始日期。

## 固定厂商检查

| 厂商 | 实际读取入口及候选 | 处理与覆盖边界 |
| --- | --- | --- |
| Kimi | [官方研究列表](https://www.kimi.ai/blog/) 顶部仍为 2026-10-24 Kimi K3.1 Pro，之后为 7 月 K3、PerceptionBench；[官方模型组织](https://huggingface.co/moonshotai) 最近可读活动与权重为既有 K3。 | K3.1 Pro 已收录，不重复。未在这些可读入口发现目标窗口的新发布；不把托管 K3.1 Pro 与旧 K3 权重视为同一交付。 |
| DeepSeek | [API 更新日志](https://api-docs.deepseek.com/updates/) 最新日期仍为 10-17，涉及搜索 API 与 Flash 1017；[官方模型组织](https://huggingface.co/deepseek-ai) 与此一致；[Harness 发布列表](https://github.com/deepseek-ai/deepseek-harness/releases) 顶部为 10-30 的 0.2.1-rc.5。 | 已阅读 rc.5 的发布说明，增量是对话中思考内容的显示改进，且明确预发布。暂不把日常界面维护独立发稿，也不把工具版本当新模型。 |
| Qwen | [博客入口](https://qwen.ai/blog) 仍无可读正文；替代阅读[官方模型组织](https://huggingface.co/Qwen)、[Qwen Code 发布列表](https://github.com/QwenLM/qwen-code/releases)。工具顶部为 10-30 CUA Driver 0.27.0 预发布；模型目录仍以既有 Qwen3.8 等为主。 | 博客动态正文覆盖缺口保留，不能声称该站无更新。已读驱动说明，其为工具制品及多项维护，未核验为新的通用模型交付，不为配额新增。 |
| Qwen 研究活动 | [Co-Design Bench](https://huggingface.co/papers/2610.35138) 页标明原始发表 10-26、HF 提交 10-30。摘要为多模态编程协作评测，区分完成部分标准与完整任务。 | 属研究候选，可交研究栏目后续全文核验；不把 HF 活动时间当论文首发，更不写成 30 日模型发布。此批不新增新闻。 |
| GLM / Z.ai | [模型发布记录](https://docs.z.ai/release-notes/new-released) 最新可读为 8-26 GLM-5.3-Flash；[官方模型组织](https://huggingface.co/zai-org) 顶部最近活动为更早论文与模板更新。补充尝试的博客入口未成功。 | 文档与模型组织未核验到本窗口新交付；博客访问失败不是“没有新消息”的证据，保持覆盖边界。 |
| MiniMax | [发布目录](https://ir.minimax.io/news-events/new-releases) 最新可读为 10-22 Mini App、10-19 M3.1 Flash；[官方模型组织](https://huggingface.co/MiniMaxAI) 有近期 M3.1 Flash 评测结果活动。 | 继续跟进并实际阅读[结果补充讨论](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/discussions/13)。页面显示约一天前补入 Terminal-Bench-Science 外部评测元数据，未给精确日历时间；这是榜单元数据更新，不是新模型或新权重交付。本批暂不另发。 |
| 字节 Seed | [主页](https://seed.bytedance.com/en/) 最新栏仍为 10-14 招聘及更早模型；进一步阅读[研究与博客列表](https://seed.bytedance.com/en/research?view_from=homepage_tab)，最新论文为 10-25 Recycler。 | 招聘排除；论文及既有模型不是本窗口新发布，未发现值得新增的目标窗口内容。静态列表不代表所有渠道完整覆盖。 |
| Google DeepMind | [官方新闻列表](https://deepmind.google/blog/) 顶部仍是 Genie 4、Gemini 4 Carbon，后续森林类型、抗菌肽、新加坡合作等与前次目录一致。 | 已收录 Genie 4（10-27）与 Carbon（10-28），不重复；列表显示月份而非每条日历日，既有精确日期继续来自原公告。可读目录无本窗口新增，不外推为 Google 所有产品频道无变化。 |

上述入口均与前次记录衔接；没有因缺少每日厂商名额而收录推广、优惠、产品演示或零碎版本更新。

## 扩展团队：Mistral

[官方新闻目录](https://mistral.ai/news/) 最新为 10 月 29 日 **Le Chonk: Built for Coders, Trusted by Defenders**；之后是 21 日合作稿、20 日 Voxtral 3、15 日 Timestral、6 日 Large 4 预览。回看发现 29 日的权重正式交付尚未收录，虽略超优先的 48 小时窗口，但与早前托管预览有可核验实质变化，作为近期漏项补收，保留原日而非改写为今日发布。

新增 ID：`mistral-large4-open-weights-release`。原始发表日期 2026-10-29，真实收录和完整正文日期 2026-11-01。本专项新增 1 条、完整五语言正文 1 篇，历史补写 0 篇、撤下 0 条；主批统一统计其他新闻及历史补写。

### 原文阅读与事实定位

1. [Mistral 权重发布公告](https://mistral.ai/news/mistral-large-4-oss/)：实际阅读全篇相关发布、能力、网络安全、部署与许可段落。日期由官方目录 10-29 及同日 Hugging Face 文章交叉确认。
   - 开头说明此前月内公开预览，此次交付改进权重；“Built for the Builders”说明继续约三周强化学习。
   - “Pushing the pareto frontier”中 Terminal-Bench 4.0 为 41%、比预览提高 13 个百分点、输出 token 减少 30%。正文明确是厂商报告的指定测试结果，不称本站测得、不延伸为任意项目成功率或固定实际成本下降。
   - 推理模式为低、中、高，高档默认；不附加未经核验的所有框架兼容性保证。
   - 网络安全部分承认预览流量存在帮助现实攻击的可能，防护仍在调整；专用变体仅向经过审核的企业伙伴提供受控预览，不能与普通公开权重混为一谈。
   - 末尾写明完整技术报告仍将随后公布。排除大量客户背书、购买号召与品牌宣传，不照搬“无需额外调整即可安全”等泛化保证。
2. [官方模型卡](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B)及[权重目录](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/tree/main)：实际阅读模型说明、关键特征、基准、推理说明和文件列表。FP8 权重制品确实存在，官方卡链接 NVFP4 版本；不是只有预告或不可用占位页。约 1T 总参数，49B 活跃参数与计入嵌入、输出层后的 52B 是口径差异；输入文字和图片，输出文字，1M token 上下文。不将目录体积当作最低显存或购买建议。
3. [完整许可原文](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/main/LICENSE)，并读取其纯文本版本：Mistral Ecosystem Open-Weight License 是修改版 MIT。第二条覆盖使用主体或关联方经营 Model-as-a-Service 的情形，定义涉及第三方对输入、参数、训练数据的实质控制；明确不包括仅将能力嵌入特定功能的终端产品及单纯转发其他托管服务。第三条对内部使用和通过 Mistral 官方产品使用设例外。正文概述而不提供针对个别业务的法律建议，不写成标准 MIT 或无条件开源。
4. [Hugging Face 发布及架构说明](https://huggingface.co/blog/mistral-large4)：实际阅读开头、架构、基准和推理相关段落，日期 10-29，列出 FP8、NVFP4。结构说明区分专家选择与注意力位置选择。其部分基准值与 Mistral 当前发布公告不同，例如 Terminal-Bench 4 记为 28.3%，因此不混合两篇数字形成新排名；正文直接说明口径不同并只对公告采用的数字归因。
5. [Artificial Analysis 高推理模式模型页](https://artificialanalysis.ai/models/mistral-large-4)：实际阅读摘要、比较和规格，当前综合 Intelligence Index 为 26 分。正文只采用该独立评估的综合分，明确与编程任务测试不同，不将它解释为全面领先或稳定不变的排名。
6. [TechCrunch 10 月 29 日独立报道](https://techcrunch.com/2026/10/29/mistral-releases-weights-for-its-trillion-parameter-ai-model-targeting-cybersecurity/)已实际打开，用于确认权重交付的外部新闻关注；不据其替代许可证或技术事实。

Neural Brew、Yahoo 转载页直访失败，虽然搜索结果可见相关报道，但未当作已成功阅读全文的证据。其他媒体排名与训练设备数量并非理解本次交付所必需，没有加入正文。

### 图片、五语言与筛选

封面 `images/news/mistral-large4-weight-delivery.svg` 为本站原创解释图，展示 6 日预览、29 日权重交付及后续部署评估，图注明确非性能或安全实测。没有使用原站摄影、品牌插画或未经核实授权的第三方图表。图文件已渲染并目视检查，字句清楚，无裁切或重叠；生产链接随主批发布生效。五语言正文各有对应语言的解释图步骤，不依赖封面英文理解文章。

五种语言均有完整导语、四节八段与图示，保留同样的日期、参数口径、测试归因、许可例外与安全边界；繁体中文术语另行复核。新闻价值是实际模型交付和部署条件变化，非购买推介。正文不包含攻击操作，不涉及色情、赌博、毒品或相关引流。所有公开字段、参考链接、封面和本记录已人工复核，并通过额外隐私与结构扫描；无本机身份、绝对路径、内网地址、凭据、内部代码、命令或运行记录。全站构建检查与发布由主批统一执行。
