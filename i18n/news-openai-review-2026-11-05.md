# OpenAI 新闻复核：2026-11-05

本记录覆盖 11 月 4 日两项新公告及其支持资料。核验时间为上海时间 2026-11-05，截至 11:23；11:16 与 11:18 已实际检查公告与补充资料。此前已先检查 [OpenAI 官方新闻页](https://openai.com/news/) 和 [Anthropic 官方新闻页](https://www.anthropic.com/news)，本记录不代替主批次的完整目录巡检记录。

本批拟新增 2 条，原始发布日期均为 2026-11-04，收录和正文撰写日期均为 2026-11-05；撤下 0 条。主题为图像模型/API 能力与开发者基础设施并购。两个条目都涉及 OpenAI；Pierre 是第二条交易对方，整批公司分布由主批次汇总，不能以本分组代表新闻全貌。既有新闻未包含两项新事件；已有 Codex、模型与 Git 相关内容不构成此次新模型能力和收购协议的重复报道。

## Images 2.6：收录

新增 ID：`openai-images26-gif-svg-controls`。

- [OpenAI 发布公告](https://openai.com/index/introducing-images-2-6/)：页首标注 November 4, 2026。实际阅读完整正文；定位 “Faster iteration and more professional visuals”“More ways to create and edit in the API”“Pricing and availability”。公告称当日在全球 ChatGPT、Codex 各订阅层级及 API 开放，Flare 与 Sunburst 是两种 API 模型。50% 加速和低画质最快六秒属于厂商自报，未提供可推广至所有任务与负载的对照条件；不当作平均实测、时限承诺或比较排名。
- [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation)：实际阅读 GPT Image 2.6、complexity、markup、SVG、GIF、limitations 与相关计费说明。规划投入和渲染细节不同；高规划投入可能增加延迟和意外修改，未给出对所有任务的保证。标注层只作用于第一张输入图；GIF、SVG 是生成操作的输出，编辑操作不输出这两种格式。GIF 2—64 帧仍受总画素约束；SVG 根据参考图形成静态矢量，不含脚本、外部资源、嵌入位图。正文只解释机制与边界，不复制调用示例、指令或定价导购。
- [图像提示指南](https://developers.openai.com/api/docs/guides/image-prompting)：实际阅读模型定位、参数分工、连续编辑和核对建议。保留文字、布局、主体一致性与编辑偏移仍需检查的边界，不把局部标注写成逐像素不变保证。未复制商业素材示例或原始提示。
- [Sunburst 模型页](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst) 与 [Flare 模型页](https://developers.openai.com/api/docs/models/gpt-image-2.6-flare)：实际阅读模型说明、输入输出与限制部分，分别定位细致视觉工作及快速迭代；支持文本和图像输入、图像输出，不能将 GIF 宣传为任意长视频服务。文档的 Markdown 版本未被阅读工具解析，随后已通过可读的 HTML 模型页完成核验，不把失败入口当作无资料。
- [系统卡](https://deploymentsafety.openai.com/chatgpt-images-2-6)：标注 November 4, 2026；实际阅读正文与表格。3.2.1 的分母为同一组 3,077 个挑战请求，Flare 在被评估检查后仍未拦截的比例由 1.49% 变成 2.14%，总体差异未达到统计显著。只写汇总结果和离线边界，未复述违规类别或样例。3.2.2 承认跨帧判断仍有困难；第 4 节说明 C2PA 与 SynthID 来源标记。来源标记不是内容事实准确的证明，离线比例不是实际用户问题发生率。
- [The Next Web 报道](https://thenextweb.com/news/chatgpt-animated-gifs-images-2-6-openai)：11 月 4 日 19:24 UTC；实际阅读报道正文。用来判断 GIF 公开可用构成新闻增量，不把媒体转述当作独立性能测试。报道中的其他旧事件不扩写入正文。

新闻价值：输出形式与可控制能力发生实质变化，文档已经给出可用接口和边界，满足收录条件。删除品牌客户引语、宣传场景和购买号召；不据厂商样例推导全局能力提升。

正文包含背景、模型分工、输出机制、接口边界、厂商自报与系统卡限制。五种语言保留相同关键数字与归因，且均为独立组织的完整解读，不复制原文段落或将卡片摘要扩写数句充数。

配图：`images/news/openai-images26-gif-svg-controls.svg`，本站原创解释图，根据公开资料绘制规划、渲染和输出的分工。不是模型生成样例、正式界面或性能图，未采用第三方照片或品牌图。已实际渲染检查，文字完整、无溢出；本站路径可由本次发布提供，发布前不声称新公开链接已上线。

## Pierre 收购协议：收录

新增 ID：`openai-pierre-acquisition-agreement`。

- [OpenAI 收购公告](https://openai.com/index/openai-to-acquire-pierre/)：页首 November 4, 2026；实际阅读全文。首段和 “Craftsmanship meets scale for the agentic era” 区分已使用的 Trees、Diffs 与 Pierre 其他工具；“Bringing the work together in Codex” 明确未来整合计划、开源延续和客户可继续使用服务。末段说明尚待通常交割条件，包括监管批准；交割前两公司继续独立，不写成已收购完成。
- [Goodwin 卖方律师公告](https://www.goodwinlaw.com/en/news-and-events/news/2026/11/announcements-technology-goodwin-advises-pierre-computer-company-agreement-acquired-openai)：November 4, 2026，实际阅读全文，明确其团队就 acquisition agreement 提供服务。它支持协议状态，是交易相关方的直接资料，不当成独立评测或监管批准。初次正文访问失败，随后从已索引的同一官方页面重新打开并完成核验。
- [Pierre 公司入口](https://pierre.computer/) 与 [Code Storage 官网](https://code.storage/)：实际阅读，用于确认主体、产品与文档入口。公司入口未找到独立收购说明，不能将其没有列公告写成否认或确认；交易对方侧证据采用 Goodwin。
- [Code Storage 文档](https://code.storage/docs/getting-started/introduction)：实际阅读 Introduction / What you can do / Use cases，核对 Git 存储、版本操作、导入与同步、Agent 状态和并行尝试等用途。未采纳官网“最大规模”“无限制”等营销性性能主张，不抄录客户案例、代码示例、联系信息、价格或购买入口。
- [Diffs 文档](https://diffs.com/docs)：实际阅读 Overview、Rendering Diffs、Merge conflict resolution UI 与编辑说明，确认对比版本、呈现已有补丁和审阅中的修改用途；不是程序正确性评测器。
- [Trees 文档](https://trees.software/docs)：实际阅读 Overview 与相关导航说明；当前标注 beta，可能有接口调整。正文仅解释工具用途，不转载软件示例或任何私有代码。
- [Axios 独立交易报道](https://www.axios.com/2026/11/04/openai-pierre-computer-github)：实际阅读全文，仅用来确认独立媒体报道了交易；不采用其竞争格局推断、其他公司的传闻或未单独核验的市场数字。并购条件和产品机制以原始公告与资料为准。

新闻价值：收购协议和后续产品整合计划是新的可核验产业事件，区别于普通品牌合作稿。未披露交易金额、确定交割日或完整整合时间表；继续使用服务与维持开源是承诺，不能推断商业条款永久不变。Pando 与 Code Storage 不混写成一个新公开平台。没有证据证明收购已让审阅更快、错误更少，因此不作此结论。

正文区分当前组件、版本与状态保存、计划整合和未完成交割；本站关于减少界面切换、可追溯版本和工具层竞争的分析均明确归因，不写成实测结果。五种语言保持同样时间、状态和限制。

配图：`images/news/openai-pierre-acquisition-agreement.svg`，本站原创解释图。实线表示能力关系，虚线明确表示交割后拟推进的整合；不是正式产品架构。未采用第三方商标或照片，实际渲染已核对布局与文字。公开图片地址由本次发布提供。

## 筛选与公开字段复核

新增新闻 2 条，完整正文新增 2 篇，每篇五种语言、导语、三节六段及解释图步骤。没有历史正文补写计入本分组新增数量。

已复核两篇标题、短摘要、五语言正文、图注、参考链接和原创图：没有广告、返利、优惠、购买邀请或品牌客户引语；没有色情、赌博、毒品内容及相关推广。安全系统只述评估方法的汇总边界，不带入违规案例。公开文字不含本机身份、私有信息、绝对路径、内部地址、凭据、终端指令或运行记录。来源记录只使用必要的仓库相对文件名。

尚存边界：本次没有独立重跑模型性能、安全评估或 Codex 审阅测试；不把已阅读的厂商资料和媒体报道写成本站实测。不知道交易何时最终完成，不以预测补齐。
