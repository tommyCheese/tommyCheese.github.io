# 新闻来源与正文复核 · 2026-10-27

本批按上海日期 2026-10-27 整理。新增 3 条，均保留原始公布日期 2026-10-26，`collected_at=2026-10-27`；另补写 5 条历史新闻的五语言完整正文，`written_at=2026-10-27`，不改变历史 ID、发布时间或收录日期，不把补写计入新增。未发现本批复核的历史条目需要撤下。新增新闻涉及 OpenAI、Anthropic、腾讯混元三个不同团队，内容分别是科学论证的外部审查、公开上市申报与流式翻译模型及工具发布。

所有文章均核对标题、摘要、正文、图示和参考链接。排除促销、购买号召、充值、邀请码、品牌口号以及色情、赌博、毒品性质内容和相关引流。企业来源只用于可核验事实；公司自报结果保留归因，不作为独立实测。参考页中的导航、营销区域不进入正文。中文、英文、日文、俄文和繁体中文保留同一组事实、数字及限制。

## 新增 1：OpenAI 的科学研究与外部检查安排

- ID：`openai-scientific-results-community-review`
- 原文：[OpenAI · Building scientific understanding with academic communities](https://openai.com/index/building-scientific-understanding-with-academic-communities/)，页面公布日期 October 26, 2026。
- 交叉核对：[OpenAI math 仓库](https://github.com/openai/math)的公开说明与验证状态；[The Next Web 独立报道](https://thenextweb.com/news/openai-exponential-time-hypothesis-false-kakeya-yang-mills)及其转述的专家回应。
- 实读定位：公告对数学、计算机科学、物理三个方向分别介绍的段落；参与者自愿、无偿、无 NDA 和初始接触不平等的讨论；仓库 README 的材料及验证状态；TNW 对 ETH 团队参与不等于认可结果的说明。没有宣称独立检查数学证明。
- 事实：数学自然语言及 Lean 材料已公开；ETH 材料已公开并安排外部检查；物理 AI 产物暂缓公开，外部团队先写说明。不能把三者写成所有资料均已开放。ETH 不等于 P vs NP；理论反驳即便成立，也不能直接推成实用快速算法。论文/证明的最终学术接受不能由公司新闻代替。
- 证据边界：专家 Google Doc 自动读取只得到脚本壳，没有作为已阅读全文的参考来源；具体表述以可读 TNW 转述为证据。文章没有把仓库中某项的形式化状态推广到全部结果。
- 筛选：外部审查安排和不同材料的公开状态有具体信息增量，保留；不采纳模型能力宣传和未经审查的“已解决”断言。
- 配图：本站原创解释图 `images/news/scientific-results-review.svg`，主任务已制作，并在 Chrome 实际渲染、目视验收无裁切；不使用伪造证明、实验数据或第三方版权图片。

## 新增 2：Anthropic 公开 S-1 申报

- ID：`anthropic-public-s1-filing`
- 原文：[Anthropic 公告](https://www.anthropic.com/news/s1-sec)，October 26, 2026。
- 日期独立证据：[SEC 文件目录](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/0001628280-26-067168-index.html)：S-1，提交 2026-10-26，接受时间 09:00:11，accession 0001628280-26-067168。采用可读取的 `.html` 目录地址。
- 财务和风险的交叉报道：[Reuters / iTnews](https://www.itnews.com.au/news/anthropics-soaring-sales-steep-losses-put-ai-frenzy-to-ipo-test-629917)。iTnews 显示 Oct 27 6:10AM，是转载站的显示时间，不能改写原公告日期。
- 实读定位：公司关于 Class A、拟 Nasdaq Global Select / ANT、数量和价格尚未确定、尚未生效的说明；SEC 文件目录；Reuters 关于半年财务、可转换债务估值、调整后经营结果、计算支出及供应商依赖的报道。
- 事实：公开申报不是上市完成。Reuters 报道的 H1 2026 净亏损 807 亿美元主要含非经营性可转债会计项目，经营亏损 6.93 亿美元，调整后经营利润 16.2 亿美元；三者口径不同，不能写成同额现金消耗或 GAAP 盈利。正文所有财务数字明确归因 Reuters，不捏造独立审计。
- 证据边界：SEC 完整申报文件过大，直接下载受 403 限制；不声称本轮读完全部 S-1，也未补写未经核对的股权、客户或估值数字。此工具限制仅留在来源日志，不进入面向读者的正文。最终发行规模、定价、交易日期仍待后续文件。
- 筛选：公开证券申报及不同会计口径有实质新闻价值；不含投资推荐、购买引导或估值炒作。
- 配图：本站原创解释图 `images/news/anthropic-public-filing.svg`，主任务已制作，并在 Chrome 实际渲染、目视验收无裁切，表示申报到发行的不同阶段，不暗示已完成 IPO。

## 新增 3：腾讯 Hy-SimulMT 流式同传模型和工具

- ID：`tencent-hy-simulmt-streaming-translation-release`
- 原文：[Hy-SimulMT GitHub README](https://github.com/Tencent-Hunyuan/Hy-SimulMT)，News 明示 **2026.10.26** 发布。
- 权重：[腾讯官方 Hugging Face 模型卡](https://huggingface.co/tencent/Hy-SimulMT-30B-A3B)、[模型文件 API](https://huggingface.co/api/models/tencent/Hy-SimulMT-30B-A3B)。实查 revision `56c233df75bf09e386aa6282b01730b461afc83f`、`gated=false`，文件列表含 17 个 safetensors 分片和 `model-audio-tower.safetensors`；不把权重预告写成已交付，确有文件证据。
- 许可：[仓库 LICENSE-Hy-SimulMT.txt](https://github.com/Tencent-Hunyuan/Hy-SimulMT/blob/main/LICENSE-Hy-SimulMT.txt)，实际读取仓库及模型 LICENSE：Apache License 2.0，第三方组件遵循各自条款。不是仅凭仓库徽章判断许可。
- 独立报道：[IT之家](https://www.ithome.com/1/018/168.htm)，页面时间 2026-10-26 22:09:04。
- 实读定位：README News、模型列表、SimulInfer/SimulTrain、TTS 配置、评测表、RealSI 同传对照与视频说明；模型卡及文件清单；许可正文；IT之家对发布情况的报道。
- 事实：中英双向流式翻译，translation-only / interleave 两种输出路径；发布推理、训练工具及 FP8/GGUF 选择。语音合成和声音克隆需要另配 TTS 服务，不能把翻译权重直接说成完整语音到语音系统。模型卡的多语言标签不是已证实所有语言均支持实时翻译的证据。
- 数字和限制：RealSI 的 StreamLAAL 约 3 秒衡量流式滞后，不是首包声音响应时间。GEMBA 是相关质量指标；短语音基准 FLEURS、CoVoST2、ACL6060、RealSI-Sentence 的任务与表现不相同。人类对照仅 18 段约 6 分钟材料，6 名译员（CATTI 一、二级各 3 名，并取组内较优表现），不能泛化成超越所有人类或覆盖声音质量。演示视频是离线生成，不可当延迟测量。
- 筛选：实际权重、工具和许可交付构成增量。没有照抄独立报道标题的“3 秒响应”“超人类”宣传，也不纳入 App 下载二维码或免费体验引流。
- 配图：本站原创解释图 `images/news/hy-simulmt-streaming.svg`，主任务已制作，并在 Chrome 实际渲染、目视验收无裁切，区分翻译链和独立 TTS，不把示意流程当实测系统结构。

## 历史正文补齐：5 篇

以下逐条重新读取原始来源，不用历史日志替代原文。仅新增 editorial 正文，原新闻 metadata 不变。

### `anthropic-rocq-oss-formal-verification`

- 原文：[Anthropic formal verification](https://www.anthropic.com/research/formal-verification)，10 月 22 日。
- 实读：文章的验证对象、运行假设、证明生成/检查流程和限制部分。239 个 OSS-Fuzz 入口、123 个库、约 1.8 亿行 Rocq 证明均保留为团队报告。
- 边界：单线程、固定内存、静态 RISC-V Linux、输入小于 64MB、建模的系统调用响应及 musl 环境，不等于整个库每个入口、所有体系结构或完整业务语义安全。检查器保证的是给定形式命题；命题、语义模型和检查器仍是信任边界。部分未修复漏洞相关证明暂缓公开，不写成全量公开。没有声称本站独立运行所有证明。
- 配图：原 Anthropic 图实做 GET 成功并目视检查，JPEG 1200×630，为抽象几何解释图，无广告或不当内容；保留原 URL/署名，不新增第三方图的复制或授权声明。

### `modular-max-source-available-license`

- 原文：[Modular MAX license 公告](https://www.modular.com/blog/max-license)，10 月 22 日；[MAX License 全文](https://www.modular.com/legal/max-license)，修订日期 10 月 21 日。许可修订日期不替代新闻公布日期。
- 实读：公告关于 graph compiler、runtime、hardware backends 与贡献计划的部分，许可授予、再分发、AI 使用、品牌条款等原文。
- 边界：新源码可见不等于整套变成无条件开源；已有 Apache-2.0 组件保持独立许可。可按条件使用、修改及分发目标代码；修改后源码公开受贡献分支路径等条件限制。许可禁止利用 AI 复制替代 MAX，但允许读取、分析、解释、改进或互操作。特定商业托管 AI 服务的品牌要求不能泛化为所有个人使用。无自测性能/价格结论。
- 配图：原 Modular 图 GET 成功、目视通过，JPEG 1920×1080；文字是发布/源码可见标题，不含购买或价格信息；因稿件核心是技术和许可变更而非品牌推广予以保留，保留原链接/署名。

### `litellm-11070-release-artifact-compromise`

- 原文：[修正后的安全事件复盘](https://docs.litellm.ai/blog/security-incident-oct-21-2026)与[完整攻击链说明](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain)。事件/首报 10 月 21 日；10 月 23 日修正结论优先于早期推测。
- 实读：受影响版本/镜像标签、根因修正、凭据撤销、构建与发布链、应对及信任边界。受影响 1.107.0 PyPI wheel 和所列镜像标签，不能用干净源码标签推定已发布制品安全。
- 边界：曾公开且从历史删除但未撤销的 master key，通往内部 agent 平台和高权限 GitHub 凭据，随后其他维护者凭据与构建输入/发布路径受影响。是维护方复盘结论，不是本站独立取证，也不是“绕过/破解 2FA”的简化故事。删除文本不撤销密钥；卸载/升级不自动恢复已泄漏凭据。正文只有防御性解释，不刊载可直接复用的攻击指令、恶意载荷或地址。
- 配图：既有 BleepingComputer LiteLLM 图片 GET 成功、目视通过，JPEG 1600×900；图为标志性插图，保留来源署名，不冒充事件现场。

### `linux-74-uaccess-legacy-removal`

- 原文：[Linux 合并提交 22a78a25438d246e4e951960523bee6a5155897d](https://github.com/torvalds/linux/commit/22a78a25438d246e4e951960523bee6a5155897d)，[GitHub API 全文](https://api.github.com/repos/torvalds/linux/commits/22a78a25438d246e4e951960523bee6a5155897d)核验 committer 时间 2026-10-21T17:19:30Z，48 个提交。
- 实读：Torvalds 合并说明全文，范围检查成本与 STAC/CLAC 切换成本、scoped access、get_kernel_nofault、pagefault_disable、架构迁移范围和 Claude 的作用。
- 边界：通用代码旧调用清理，不等于所有架构旧接口均删除；完整接口删除在 x86，arm64 对应检查版，其他架构保留底层同名辅助或未改复杂用途。处于 Linux 7.4 开发，不写成稳定版已发布。AI 用于部分重复模式应用，不是独自完成全部内核设计。无跨负载加速保证。
- 配图：既有 Phoronix 代码对比图 GET 成功、目视通过，WebP 498×256，未发现广告或不当内容；原链接和署名保留。

### `microsoft-kls-human-directed-ai-proof`

- 原文：[Microsoft Research 10 月 21 日报道](https://www.microsoft.com/en-us/research/blog/solving-a-31-year-old-grand-challenge-in-mathematics-the-kls-conjecture/)。
- 论文：[An O(1) Bound for the KLS Constant v2 摘要与历史](https://arxiv.org/abs/2610.01447v2)和[PDF](https://arxiv.org/pdf/2610.01447v2)。arXiv 首次提交 10 月 1 日，v2 10 月 4 日；新闻公布 10 月 21 日，三个日期不混用。
- 实读：Microsoft 全文；arXiv 元数据与摘要；PDF 引言和 Theorem 1.1、精密化/推广思路。没有声称逐行验证约 140 页证明。
- 事实：O(1) Poincaré/Cheeger 界针对各向同性对数凹分布；常数不随维数、分布、测试函数增长，不能把缓慢增长界等同常数。先处理光滑一致对数凹且协方差受控的情形，反复细化、控制误差并通过近似推广。数学迭代不是模型训练轮次。
- 人机作用和限制：超过 100 种候选、人类方向选择和剪枝、相近 token 预算无指导尝试未达目标均为 Microsoft 对具体工作过程的报告，非关于全部自主科研的通用受控结论。平行论证与 Lean 4 状态按团队报告表述，较短证明和 Lean 材料拟最终检查后发布，不误写为已公开。理论意义不转写成现成应用提速测量。
- 配图：Microsoft 既有 KLS 切割解释图 GET 成功、目视通过，PNG 2560×1520；保留原链接和署名，正文明确为直观解释，不作完整定理/证明替代。

## 固定厂商巡检

巡检是搜索覆盖，不是必须发布的配额。以下结论限定于本次可读取入口，不能解释为该公司在其他渠道绝无新消息。

| 厂商 | 本次读取入口 | 处理与原因 |
|---|---|---|
| OpenAI | [科学研究原始公告](https://openai.com/index/building-scientific-understanding-with-academic-communities/)及 math 仓库 | 入选：10 月 26 日有明确公开材料与审查安排增量。 |
| Anthropic | [S-1 原始公告](https://www.anthropic.com/news/s1-sec)、SEC 目录、Reuters | 入选：公开申报事件；未把申请写成上市。 |
| 月之暗面 Kimi | [Kimi K3.1 Pro 原文](https://www.kimi.ai/blog/kimi-k3-1-pro) | 暂缓重复：已覆盖 24 日事件；原文完整权重计划 11 月 4 日，不提前写已开放。 |
| DeepSeek | [API updates](https://api-docs.deepseek.com/updates/) | 可见最近条目 10 月 17 日，没有从该入口确认本窗口新增，不以抓取日期刷新旧闻。 |
| 通义千问 Qwen | [Qwen Code updates](https://qwenlm.github.io/qwen-code-docs/en/blog/updates/) | 可见最近周报 10 月 15 日，0.25.1/0.25.2 与 371 PR 为旧周期内容，不为公司配额重发。 |
| 智谱 GLM | [Z.ai blog](https://www.z.ai/blog) | 本次入口读取报错，最新情况未核验；不凭推测发稿，保留后续巡检。 |
| MiniMax | [官方 news](https://www.minimax.io/news) | 可读内容主要为导航和 M3.1 Flash 等介绍，缺少可核验的新事件日期；已有 23 日 vLLM 内容不重复。 |
| 字节豆包 / Seed | [Seed models](https://seed.bytedance.com/en/models) | 读取当前模型目录，Seed 2.1 等页面展示不构成已核验的本窗口新发布日期，暂缓。 |
| Google DeepMind | [官方 blog](https://deepmind.google/blog/) | 可读 2026 年 10 月列表，已有 Gemini 4 Argon 不重复；未从该入口核实足以新增的 26 日事件。 |
| 腾讯混元 | [Hy-SimulMT 仓库](https://github.com/Tencent-Hunyuan/Hy-SimulMT)、官方模型仓库和许可 | 入选：发布日期、权重文件、工具和许可均有原始证据，补充国产团队覆盖。 |

## 正文和图示检查

- 完成新条目完整正文 3 篇、历史完整正文 5 篇，共 8 篇 × 5 语言。每种语言包含 lead、4 个有信息增量的章节及解释性 visual，正文与卡片摘要分开。
- 五篇历史封面均重新 GET 并用图像查看工具目视；网络获取成功和格式/像素记录保存在本轮临时检查结果中。保留既有原始链接及署名，没有新增第三方图片的本地再版；不声称 GET 成功等于获得再利用许可。
- 新增三张封面已由主任务制作并落入仓库，经过 Chrome 实际渲染与目视检查，无裁切；网站远端 URL 待推送后核验。使用本站原创流程示意，避免新增第三方图片许可风险。正文的 localized visual 明确是本站解释性重绘，不是实验结果。
- 仅做了内容和输出结构自检；仓库合并后的构建、Python/JavaScript、预览浏览器检查与 Git 推送结果，由主任务在完成后补记。此日志不把尚未执行的集成测试写成通过。

## 合并后验收

本轮统一构建与所有要求的Python、29项JavaScript和15页面Chrome检查已通过；新增3条均有五语言完整正文，额外补5篇历史正文，新闻共59条、16篇完整正文、43篇历史待补。历史metadata与旧翻译全部保留。详细数量、非新闻变更边界和检查见[统一验收记录](content-update-2026-10-27.md)。推送与远端图片状态由主任务最后核验。

## 补录：GPT-6.1 Terra 发布（用户指出漏收后）

本节追加于上海时间2026-10-27晚间，原有批次记录保留。新增1条、撤下0条：`openai-gpt61-terra-release`。`published_at=2026-10-26`，`collected_at=2026-10-27`，`editorial.written_at=2026-10-27`。新闻总数59→60，完整正文16→17，历史待补仍43篇；本日合计新增4条（OpenAI 2、Anthropic 1、腾讯1）。这次是已完成日更的漏项补录，不另算新的每日批次；本日已补写的5篇历史新闻正文保持不变。

### 官方入口检查与漏项原因

- 实际检查时间：上海2026-10-27晚间（原文下载记录20:38:15，UTC+8）；范围为26—27日，列表亦显示22—23日条目用于衔接。先前聊天已打开两站入口，此次重新读取确认。
- [OpenAI News](https://openai.com/news/)：26日的 Introducing GPT-6.1 Terra 和系统卡此前未记入巡检，本次补录为同一事件，不拆成两条。26日科学研究公告已收录；CodeRabbit品牌案例与劳动使用研究暂不收录，本次仅修复确认的模型发布遗漏，不声称它们都已完成全文复核。23日训练环境安全条目已收录；23日存储工程和22日其他公告超出这次定向补录范围。此前仅检索到一篇OpenAI公告不能代表完成发布列表巡检。
- [Anthropic News](https://www.anthropic.com/news)：26日S-1已收录；列表下一条为22日Agent Skills捐赠，26—27日可读取列表没有另一个候选。以上结论限于该列表和日期范围。
- 两站都直接读取列表，不以搜索摘要代替；新定时约束已在应用中保存，本次不修改研究任务。

### 原文与事实定位

1. [官方发布公告](https://openai.com/index/introducing-gpt-6-1-terra/)：完整阅读正文，从“Delivering fast and capable computer use at scale”到“Pricing and availability”。确认产品已在Work、Codex和API提供，API标识gpt-6.1-terra；属于正式服务发布，不是预告，不宣称开放权重。新闻列表和系统卡均给出26日，未将27日整理日期或日本报道日期当作首发日。
2. [模型文档](https://developers.openai.com/api/docs/models/gpt-6.1-terra)：模型概述、工具调用、context/output、Pricing、Modalities。上下文1,050,000、最大输出128,000；工具调用需要Responses API；文本/图像输入、文本输出，原生音频/视频输入不支持。标准每百万输入/缓存输入/输出token为$1/$0.05/$5；缓存写入单列；输入超过272K时整请求输入/缓存2倍、输出1.5倍。正文保留条件，不将基础API费率当成订阅费或整项任务成本。
3. [系统卡](https://deploymentsafety.openai.com/gpt-6-1-terra)：开篇、评测脚注及Model Data and Training段落。明确研究/API环境的提示、工具和推理档位可能与产品不同，对照模型可能是较新版本。正文不把厂商结果写成本站独立测评。
4. [窓の杜独立报道](https://forest.watch.impress.co.jp/docs/news/2151338.html)：樽井秀人，2026-10-27 07:51，开篇明确美国当地26日发布；完整阅读新闻段落，报告50.3% vs 21.5% Terminal-Bench 4.0、53.6%→16.7%内部错误测试并归因OpenAI。该报道提供独立编辑的新闻报道，不是独立性能复测。web打开失败后用curl实际取得HTML并提取阅读。页面附属购物推荐/推广组件不进入本站正文或图片，也不作为新闻事实。
5. 另实际读取[Decrypt报道](https://decrypt.co/381883/openai-launches-gpt-6-1-terra-half-good-half-price)：结果同样归因厂商；正文夹带Myriad预测引流，因此不采用该页作为发布的参考外链、配图或正文来源。没有把导流内容带入本站。

主要数字逐项复核：Terminal-Bench 4.0在最高推理档位完成50.3%的测试任务，对照前代公表21.5%，不臆断前代运行设置；内部诱发错误集的低推理错误率53.6%→16.7%，不是所有实际回答的错误概率。未采用未经本站独立验证的“全面领先”“可靠替代人”等结论。电脑操作流程以及按质量/错误/耗时/费用做工程验证是本站解释，明确区分于原文实测。

### 正文、图片与筛选

- 新增五语言完整正文各4节7段，另有导语、流程图说明与4条参考来源；五语言保留相同数字、限定与厂商归因。卡片仅短摘要。
- 图片为本站原创 `images/news/gpt61-terra-computer-use.svg`（1200×630），展示观察屏幕→判断步骤→工具执行→检查结果的循环。没有第三方照片、商标、实验曲线或未经授权论文图片；不将解释图称为模型内部结构。发布后核对其生产URL。
- 收录理由：有可核验的新模型服务上线、调用规格、计费和评测信息，不是充值优惠、导购或纯品牌案例。删除购买号召和宣传形容词。标题、正文、解释图和采用的外链均经过广告、软文、促销、返利及色情、赌博、毒品推广/交易引流/擦边内容筛查。
- 只新增该ID及对应正文、五语言消息和生成页面。原有59条新闻、研究元数据与正文门槛保持不变；保留工作区私人未跟踪目录。

补录验收：仓库`.venv`构建完成；`check_editorials.py`、`check_content_preview.py`、`check_news.py`、`check_research.py`、`check_i18n.py`（45,615项）、`check_reading.py --check-unchanged`、`check_tags.py`、`check_linux_lab.py`全部通过。日期筛选、搜索和语言JavaScript共29项通过；实际Chrome的15个语言页面弹窗、完整正文、参考链接、焦点、原文入口、移动端与图片失败降级通过。新SVG已实际渲染并目视检查，无文字裁切。对照HEAD确认原有59条新闻、42篇正文及所有旧翻译值不变，仅新增1条新闻、1篇五语言正文、每语言2个消息键；研究数据未变。`git diff --check`通过。推送和上线结果以本次实际Git/部署检查为准。
