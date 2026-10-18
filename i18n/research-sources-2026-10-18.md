# 2026-10-18 前沿研究来源与筛选记录

本批按上海日期 `2026-10-18` 收录 **5 篇不重复的真实论文**：4 篇按论文／预印本管理，1 篇会议论文；没有会议日程、时间线、DDL、征稿或报名条目。新增后研究总量为 67 条。`coverage_start` 保持 `2026-10-06`，`minimum_per_day` 保持 5，`updated_at` 更新为 `2026-10-18`。

研究员实际阅读了下列五篇的 arXiv 固定 v1 原始摘要、作者、Comments 和 Submission history，并用 arXiv Atom 原始元数据交叉核对。原始摘要是本批方法与发现的依据，未把尚未复现实验写成本站验证结果。`published_at: 2026-10-15` 保留 arXiv 原文以 UTC 标注的首发日期；`collected_at: 2026-10-18` 是实际上海收录日期，二者不混用。

## 新增条目与原始证据

| 新增 ID | 固定原文与首发时间（UTC） | 类型与录用证据 |
| --- | --- | --- |
| `mpt-decentralized-agent-self-orchestration` | [Xu et al., Learning Self-Orchestration in Decentralized Agent Swarms](https://arxiv.org/abs/2610.22322v1)，2026-10-15 17:51:57 | `preprint`；v1 未提供会议录用注释，不臆断评审状态。 |
| `knowgpo-knowledge-grouped-search` | [Chen et al., KnowGPO: Knowledge-Grouped Policy Optimization for Search Agents](https://arxiv.org/abs/2610.22331v1)，2026-10-15 17:52:33 | `preprint`；Comments 仅给出代码地址，无会议录用声明。 |
| `diverse-scientific-ideas-set-rl` | [Wadhwa et al., Training Reasoning Models to Generate Diverse Scientific Ideas](https://arxiv.org/abs/2610.22324v1)，2026-10-15 17:52:12 | `preprint`；作者 Comments 明确写“Under Review”，不能写成已录用。 |
| `omniverifier-graded-world-verification` | [Liu et al., OmniVerifier-C1: Decomposed Graded Verifier for Rule-Governed Generative World Modeling](https://arxiv.org/abs/2610.22355v1)，2026-10-15 17:58:04 | `conference-paper`；作者 Comments 标注“NeurIPS 2026”，`venue: NeurIPS 2026`；公开摘要明确归因于作者标注，没有声称独立核查会议名单或具体轨道。 |
| `leash-uncertainty-agent-escalation` | [Wang et al., LEASH: Uncertainty-Aware Weak-to-Strong Escalation and Oversight for Computer-Use Agents](https://arxiv.org/abs/2610.22280v1)，2026-10-15 17:40:12 | `preprint`；v1 未提供会议录用注释，不臆断评审状态。 |

所有条目使用 `ai`、`papers`、`results` 标签；MPT、KnowGPO、LEASH 另加 `agents`，OmniVerifier-C1 另加 `conferences`。会议标签关联的是具体研究论文，不是会议日历。

## 方法、发现与限制

### MPT：去中心化 Agent 群体自编排

原始摘要提出 market-based post-training：Agent 以竞价表达参与意愿，联合训练行动策略与竞价行为，将集体结果转化为局部训练信用，不依赖中央协调 Agent。作者在具身制作、机器人导航和深度研究三类任务中报告优于单体后训练；固定行动策略后的对照和消融支持学习编排、竞价反馈各自的作用。迁移到相关任务、推理时增加群体成员、成员掉线的实验显示收益。局限：这些结论来自所测任务和设置，不能推广成所有多 Agent 系统均更强或更省成本。来源：[固定 v1 摘要与元数据](https://arxiv.org/abs/2610.22322v1)。

### KnowGPO：以知识状态分组进行搜索奖励分配

论文把回答所需的信息拆成原子知识条件，用已满足条件集合表示轨迹状态；同知识状态的轨迹分组比较，并以相邻步骤的知识增量提供过程奖励，缓解仅有最终奖励时难以分配搜索信用的问题。作者在 Xbench、BrowseComp-ZH、GAIA 上报告超过 GRPO、GiGPO、IGPO 等对照，摘要给出的提升为 3.8—4.2 点；8B 模型的比较限于文中所用系统。局限：效果与知识条件构造、训练和所测搜索基准有关，不代表任意开放网页搜索的可靠性。来源：[固定 v1 摘要与代码注释](https://arxiv.org/abs/2610.22331v1)。

### 集合级强化学习：兼顾科研构思质量与多样性

模型基于输入论文，一次生成 K 张结构化构思卡片；集合奖励把每条构思的质量与它对先前构思的差异结合，避免只优化单条构思质量。作者报告 8B 模型在其无污染基准上的创意效用超过所比较的更大模型，并做了四位专家的试验性人工评估；代码 Agent 的概念验证实验中，success@k 与所用对照相近。局限：人工研究规模小，创意效用与概念验证不等于想法成为已证实的科学发现；作者注明仍在评审。来源：[固定 v1 摘要与 Under Review 注释](https://arxiv.org/abs/2610.22324v1)。

### OmniVerifier-C1：分解式连续视觉验证

论文把复杂提示或环境规则拆成细粒度检查项，以解耦强化学习同时优化局部二元判断与全局对齐评分；连续、结构化的批评信号用于文本生图和显式规则下的生成式世界建模。作者报告域外多模态评估、Maze 与 Sudoku 等任务的改善，并分析在有真实参考图像时，成对验证比单点验证更准确。局限：成对比较的结论有参考图像前提；结构化任务表现不能直接证明真实世界的通用规划可靠性。会议依据仅是作者在原始 Comments 中标注 NeurIPS 2026，页面摘要保留此归因。来源：[固定 v1 摘要与会议注释](https://arxiv.org/abs/2610.22355v1)。

### LEASH：基于不确定性的弱到强升级与交接后监督

方法比较弱模型当前隐藏状态与历史成功、失败轨迹，用同一不确定性信号完成初始任务路由、逐步升级以及强模型接管后的影子监督。弱模型执行时复用生成动作已有的激活，无需额外前向或专门训练监控器。作者在 OSWorld、四种模型骨干上报告比弱模型独立执行更好，并在相同升级率下超过随机升级 6.55—11.94 点；具体成功率和成本比较是该实验设置的结果。局限：依赖弱模型内部状态与历史轨迹，成本受模型、任务和计价条件影响，不代表任意桌面任务可靠或恒定节约。来源：[固定 v1 原始摘要](https://arxiv.org/abs/2610.22280v1)。

## 去重、内容与链接筛选

- 将五个 arXiv 基础编号（忽略 `v1` 等版本后缀）与更新前 62 条历史来源逐一比较，均为未收录论文；新增编号彼此不同，没有换版本或改 ID 重复计数。
- 五条卡片外链均使用上述 `https://arxiv.org/abs/...v1` 固定原文地址，实际可访问并具有研究摘要、作者和提交历史；没有商品购买、推广返利、付费报名或营销落地页。作者代码／项目链接只作为原论文可复现性信息，不作为卡片的推广目标。
- 逐篇复核原始标题、摘要和拟发布中文标题摘要，内容为多 Agent 协作、搜索训练、科研构思、视觉验证和电脑操作监督，有明确研究方法与实验增量；没有广告、软文、品牌卖点或促销号召。摘要中的模型品牌仅用于交代论文实验对照，不作为购买推荐。
- 未发现色情、赌博、毒品性质或相关推广、交易引流及擦边内容。MPT 的竞价是任务参与和训练信用分配机制，不是博彩或下注内容。
- 本批不配置封面或其他外部配图，因此没有采用未经核查的图像。没有把会议日程、时间线、DDL、征稿、报名或日历计入研究。
- 五语言摘要均保留“作者报告”或实验范围与限制；会议状态按证据标注，arXiv 身份本身不用于判断是否经过同行评审。

## 批次计数

2026-10-18 收录 5 条：论文／预印本 4 条、作者元数据注明会议的论文 1 条。前一日历史保留；新增后总量为 67 条。原始发布日期均为 2026-10-15，收录日期均为 2026-10-18。

发布主流程已完成并确认通过：五语言站点构建、`tests/check_research.py`（18 日计数 5、总数 67、完整覆盖区间无缺额）、新闻、多语言、阅读、标签、Linux 实验室集成检查，以及 28 项 JavaScript 日期筛选、搜索与语言测试。来源记录完成后由主流程最终审阅并提交、推送。
