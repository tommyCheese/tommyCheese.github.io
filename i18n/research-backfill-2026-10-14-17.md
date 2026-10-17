# 前沿研究补录核验：2026-10-14 至 2026-10-17

本段核验于 2026-10-17 完成。已逐篇读取以下 arXiv 原始摘要与 v1 提交记录，以及机构研究原文。论文按原站 UTC 首发日期归档，机构文章按页面明确标注的发布日期归档，不使用转载日、搜索抓取日或本站核验日替代首发日。论文的评审与录用状态以原始注释为准，不因收录 arXiv 推断未经同行评议。

本次提供 13 条新增：10 月 14 日 5 条，15 日 4 条，16 日 4 条。结合原有 15 日 Athanor 与 16 日 NIST 曲线种子研究，14—16 日各有至少 5 条。17 日的其他独立核验由主任务汇总，本文件不以重新核验会议日历充数。

日期交叉检查使用 arXiv 官方 Atom API：`submittedDate:[202610140000 TO 202610162359] AND (cat:cs.AI OR cat:cs.CL OR cat:cs.LG OR cat:cs.MA)`。响应含 14 日 543 条、15 日 422 条、16 日 0 条；此计数仅为该筛选条件下的可查询记录，不代表所有领域或机构当天无研究。

## 2026-10-14：新增 5 条

| 条目与原始来源 | 日期证据（UTC v1） | 核心信息与边界 |
| --- | --- | --- |
| [The Wealth of Agents](https://arxiv.org/abs/2610.20518v1) | 2026-10-14 17:19:11 | 多开发者专长 Agent 组合；GAIA 准确率 70%。仅报告论文指定开发预算和评测条件，不推广到所有真实部署。 |
| [CIPR：One Task, Many Interfaces](https://arxiv.org/abs/2610.20576v1) | 2026-10-14 17:56:06 | 对等价接口施加策略一致性约束，减少接口变化造成的性能下降；证据限于所测试扰动和后训练设置。 |
| [Scaling Discovery Requires Forgetting](https://arxiv.org/abs/2610.20563v1) | 2026-10-14 17:49:37 | 保留最佳候选并定期重置 Agent 会话和搜索历史；四项任务的改善不能外推为全部科学发现任务的结论。 |
| [PhySGA](https://arxiv.org/abs/2610.20560v1) | 2026-10-14 17:47:24 | 装配、评审 Agent 和技能库根据物理仿真反馈组合三维物体；Isaac Sim 结果不等于真实机器人验证。 |
| [JetStream](https://arxiv.org/abs/2610.20527v1) | 2026-10-14 17:25:51 | Agent 为原有数据库生成查询加速器；区分差分测试与机器证明，速度结论限于指定 TPC-H 负载。 |

## 2026-10-15：新增 4 条

| 条目与原始来源 | 日期证据 | 核心信息与边界 |
| --- | --- | --- |
| [Approve What, Exactly?](https://arxiv.org/abs/2610.21063v1) | v1：2026-10-15 01:11:23 UTC | 审计十种 Agent 环境，提出将用户批准绑定规范化操作与存储调用的 ASU；批准轰炸和策略已允许的效果仍是限制。 |
| [Poisoning the Neighborhood](https://arxiv.org/abs/2610.21464v1) | v1：2026-10-15 08:06:48 UTC | 两百万篇维基文档上的 HNSW 检索图结构污染研究；只做风险和评估摘要，不提供攻击操作步骤。 |
| [Language Is a Security Surface for Agent Guards](https://arxiv.org/abs/2610.22244v1) | v1：2026-10-15 17:19:40 UTC | 固定 1,220 个工具步骤，只翻译指令，对十九种守卫评估；衡量语言导致的判定变化，不等于实际攻击成功率。 |
| [My Credentials, Please / MCP-FSD](https://arxiv.org/abs/2610.22301v1) | v1：2026-10-15 17:48:10 UTC | 21,097 个 MCP 服务的契约和动态分析；所测沙箱下确认 150 个脆弱实例，不据筛查比例推断全部部署失陷率。 |

## 2026-10-16：新增 4 条

| 条目与机构原文 | 日期证据 | 核心信息与边界 |
| --- | --- | --- |
| [Designing more efficient quantum circuits with Claude](https://www.anthropic.com/research/designing-efficient-quantum-circuits) | 原文标注 Oct 16, 2026 | 自然语言规格、正确性评估器与资源评分构成闭环，研究八项量子电路任务。归档此机构研究原文日期，不混用关联论文的提交日。算法资源估计不等于实用量子硬件演示。 |
| [The AI expectations gap](https://www.anthropic.com/research/ai-expectations-gap) | 原文标注 Oct 16, 2026 | 对约 1.1 万名美国成年人和 Anthropic 员工的调查比较；记录的是受访者预期与相关性，不能当作能力或经济预测已经证实。 |
| [How employment is changing at Anthropic](https://www.anthropic.com/research/employment-at-anthropic) | 原文标注 Oct 16, 2026 | 内部就业、工具使用、产出数据及十七次访谈。摘要保留非随机采用、代码量不等于质量和单公司样本三项限制。与预期调查是不同数据与不同问题的独立报告，不收录汇总介绍页。 |
| [Grounding AI agents in biological reality](https://research.google/blog/grounding-ai-agents-in-biological-reality-building-blocks-for-autonomous-wet-labs/) | 原文标注 October 16, 2026；Google 10 月研究目录同日列出 | VERID 数字孪生追踪状态、模拟验证与闭环实验反馈；仅概括方法和人工监督，不写实验操作配方。原型案例不意味着完全自主实验室或临床疗效。 |

## 内容审核与来源取舍

- 13 条均有可读的原始摘要或实证研究原文，并包含方法、评测或数据，排除了导购、优惠返利、产品预热、品牌活动和泛化企业案例推广。机构页面中的通用产品入口不作为选题依据，本站摘要无购买号召、价格或营销结论。
- 逐条检查标题、摘要与可见研究正文，未收录色情、赌博、非法毒品或相关推广内容。Google 条目为受控、非感染性实验系统与实验室自动化，不涉及毒品内容；摘要保留人工授权、监督与证据边界。
- 三篇安全研究（批准绑定、RAG、MCP）仅以防御研究与评估风险概述呈现，不复制攻击代码或执行步骤。
- 摘要中的比较结果均归属于作者实验或机构观察；本次没有独立复现实验，不把作者报告升级为已证实的普遍结论。
- 不收录同一成果的新闻转载与汇总页；已有 Athanor、NIST 曲线研究不重复。
- 五语言文案与元数据暂存交付为 `/tmp/research_oct14_17.json`，由主任务统一合并和运行生成检查。

## 会议状态补充核验

`linguaguardbench-agent-guard-language` 的官方 Atom comment 为作者注明已获 NeurIPS 2026 AIWILD 工作坊录用。五语言摘要明确是工作坊，未写成 NeurIPS 主会录用；其他没有明确录用字段的论文不据此断言未经评审。
