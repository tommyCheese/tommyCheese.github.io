# 2026-10-17 前沿研究补充与会议选题纠正

## 日期与选题口径

本轮收录日期为 **2026-10-17**，补充的是可阅读原文的 AI / AI Agent 论文，而非当天新发表论文的数量承诺。六篇论文的 `published_at` 保留 arXiv v1 首次提交日期，`collected_at` 标记本次真实收录日期；不把核验日期改写为发表日期，也不把版本更新当作另一篇论文。

“会议”选题指具体会议论文或工作坊论文，须说明研究方法、发现及限制；会议时间线、DDL、报名及一般会务页面不计为研究内容。以下会议状态仅依据作者在 arXiv 原始 Comments 栏的声明，摘要明确写明“作者注明”；工作坊论文不冒充主会论文。

## 逐条原文核验

| 条目与固定版本原文 | v1 首次提交（UTC） | 本次收录 | 原文方法、发现与限制 | 会议状态证据 |
| --- | --- | --- | --- | --- |
| [MemCode](https://arxiv.org/abs/2610.19472v1) | 2026-10-14 02:51:29 | 2026-10-17 | 将对话改写为原子记忆单元，用语义量化码本的共现关系补充向量检索。摘要报告 LongMemEval-S / LoCoMo 上的准确率与记忆构建效率改善；只代表论文所测模型和设置。 | 作者 Comments：`27 Pages, Accepted by NeurIPS 2026`。归类会议论文，界面保留“作者注明”限定。 |
| [ProD](https://arxiv.org/abs/2610.19439v1) | 2026-10-14 02:31:56 | 2026-10-17 | 根据师生轨迹的进度差自适应惩罚停滞，报告八个小模型上的任务成功率和效率改善；未声称覆盖全部任务。 | 作者 Comments：`Accepted to NeurIPS 2026`。归类会议论文，注明证据来自作者。 |
| [Agent 安全评测捷径敏感性](https://arxiv.org/abs/2610.22243v1) | 2026-10-15 17:18:05 | 2026-10-17 | 分离标签可预测性、观测关联和成对干预；格式线索影响部分模型的误报，跨模型效果不一致。仅概括防御评测方法与局限，不提供攻击操作。 | 作者 Comments 明确写明被 NeurIPS 2026 的 TAE（Can We Trust AI Evaluation?）和 AIWILD（Agents in the Wild: Safety, Security, and Beyond）工作坊录用。归类工作坊会议论文，不表述为主会录用。 |
| [MLExpert](https://arxiv.org/abs/2610.22344v1) | 2026-10-15 17:56:32 | 2026-10-17 | 分层监督微调及窗口化交互强化学习，将实验结果反馈分配给多步决策。作者报告 MLE-Bench Lite 奖牌率改善并做迁移测试；归因于作者预印本的基准结果，不照搬宣传性排名。 | 原始 Comments 只列代码和模型链接，无录用声明，保持预印本。 |
| [Librarian Agents](https://arxiv.org/abs/2610.22273v1) | 2026-10-15 17:35:17 | 2026-10-17 | 构建 Agent 预先把文档整理成分层文件与引用链接，以后续回答准确率训练。报告 BrowseComp-Plus / BRIGHT 改善；前期构建成本需多次查询摊销。 | 原始 Comments 为空，无录用声明，保持预印本。 |
| [OS-Helix](https://arxiv.org/abs/2610.22234v1) | 2026-10-15 17:14:02 | 2026-10-17 | 以可验证桌面任务和按动作步平衡的强化学习统一 GUI 与代码执行。报告 OSWorld-Verified 改善并测试 Windows 迁移；不推断为任意桌面任务均可靠。 | 原始 Comments 只列项目页，无录用声明，保持预印本。 |

本轮所有条目均标记 AI、AI Agent、论文、研究成果；三篇具有作者明确录用声明的条目额外标记会议论文。固定链接均指向 v1，避免后续版本修改摘要或会议信息后无法复核。

## 内容过滤与证据

逐篇读取原始摘要、提交历史和作者 Comments，按 arXiv 标识去重，确认均未在此前研究数据中收录。上述条目均为具体技术论文，不含广告导购、产品营销、色情、赌博、毒品性质内容；安全评测论文仅保留防御性研究结论，不展示有害操作步骤。项目页和代码仓库只作辅助线索，不以宣传描述替代论文证据。

核验时在 `/tmp/research_oct17_selected_evidence.json` 保存原始 Atom 字段，在 `/tmp/research-oct17-<arXiv标识>v1.html` 保存六篇 v1 摘要页，包含首次提交时间及 Comments。缓存是本次本地核验材料，不是网站发布内容。网站数据与五语言文案采用 `/tmp/research_oct17_real_papers.json` 中的六条结构化记录。

## 撤下、分类与数量

撤下 `neurips-2026-schedule`、`iclr-2027-review-calendar`、`aistats-2027-review-calendar`、`aamas-2027-agent-research-calendar`、`cvpr-2027-submission-calendar` 五份会议日历，同时删除对应五语言标题和摘要。它们不再参与首页预览、标签目录或每日数量。

原有四篇具有作者录用或报告注释的真实论文补齐会议论文分类与具体场合：`heterogeneous-agent-model-persona-effects` 为 COLM 2026 Social Simulation with LLMs 工作坊，`misvisagentbench-misleading-charts` 为 EMNLP 2026，`portable-skills-agentic-rag` 为 EMNLP 2026 Industry Track，`linguaguardbench-agent-guard-language` 为 NeurIPS 2026 AIWILD 工作坊。保留原摘要对证据来源与场合的限定，不新增重复条目。

修正后共 **62 条**；10 月 17 日为上述六篇真实论文（3 篇作者注明录用的会议／工作坊论文、3 篇预印本）。10 月 6—12 日及 14—16 日每天 5 条，13 日 6 条。17 日使用真实收录日期分组，六篇原始发表日期仍为 14—15 日。

每日自动任务已同步此口径：至少五条真实论文或研究成果，不以会期、时间线、DDL 或一般会务补数；保留真实发表与收录日期，持续过滤广告及黄赌毒性质内容。静态页面同步五语言。

构建与检查覆盖每日最低数量、来源去重、会议论文标签与场合、发表／收录日期、五语言页面、新闻与研究日期／标签筛选、搜索和语言切换；全部通过。检查拒绝会议日历类型、日程字段，以及收录日期早于发表日期的记录。
