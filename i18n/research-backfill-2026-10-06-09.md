# 前沿研究历史补充核验：2026-10-06—09

核验日期：2026-10-17。按 arXiv 原始首版提交日归档，每日五条，共二十条；所有链接固定为 v1，避免后续更新覆盖当日版本。所有条目均来自 arXiv 论文版本，是否录用以原文注释为准，不凭 arXiv 身份推断未经评审，也不声称已独立复现。

## 核验与内容过滤

通过 arXiv 官方 Atom API 按 submittedDate 取得候选，逐条读取原始摘要，再对固定 v1 摘要页执行 HTTPS GET，二十页均返回 200，并检查 Submission history 的首版时间与 Atom published 一致。日期采用来源 UTC 首版日，不拿收录日或修订日替代。

逐条检查研究主题、摘要、来源与跳转：仅收录研究方法与评测，不含广告导购、软文、付费推广、购买号召，以及色情、赌博、毒品性质内容或相关引流。不为凑数将营销内容或错误日期纳入。LeCuration 使用电子游戏研究数据，未涉及赌博；安全评测仅描述防护与评测结论，不提供攻击操作。未添加装饰性广告图片。

所有语言均限制在原始摘要可支持的结论内，标注模拟、模型评审、定性概念验证、观察研究等适用限制；数值仅作为作者报告，不宣传通用能力。

## 2026-10-06：5 条

### SkillFormer：按技能组合音频模型适配器

- ID：`skillformer-audio-skill-adapters`；标签：ai, papers。
- 来源：[SkillFormer: Skill-Decomposed Adaptation for Audio Language Models](https://arxiv.org/abs/2610.07533v1)；原始首版提交时间 **2026-10-06 00:00:21 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：将音高、说话人等技能拆分为低秩适配器，由问题驱动路由组合。作者在三种模型和三个基准上报告平均准确率提升2.5—4.1个百分点；结论限于这些评测。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### 多智能体模拟：基础模型与角色设定的影响

- ID：`heterogeneous-agent-model-persona-effects`；标签：ai, agents, papers。
- 来源：[Disentangling Models from Personas in Heterogeneous LLM Simulations](https://arxiv.org/abs/2610.07535v1)；原始首版提交时间 **2026-10-06 00:01:30 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：研究在混合基础模型的社交网络模拟中，分离角色与模型带来的互动差异。实验中模型身份对参与度的影响超过角色设定；这是模拟观察，不能直接推断真实人类社交行为。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### 为 JEPA 世界模型保留控制所需的不稳定模式

- ID：`jepa-inverse-dynamics-control-representations`；标签：ai, papers。
- 来源：[Preserving Unstable Modes Through Inverse Dynamics in JEPA World Models](https://arxiv.org/abs/2610.07540v1)；原始首版提交时间 **2026-10-06 00:08:43 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：研究指出预测损失较低仍可能丢失控制关键状态，并加入动作重建目标。理论针对线性系统，非线性证据来自CartPole等视觉控制实验，尚非通用机器人稳定性保证。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### GRADE：用梯度准入控制小模型微调

- ID：`grade-gradient-admission-small-models`；标签：ai, papers。
- 来源：[Which and When to Admit: Gradient Admission for Data-Centric Small Language Model Finetuning](https://arxiv.org/abs/2610.07553v1)；原始首版提交时间 **2026-10-06 00:34:38 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：结合动态样本选择和逐步更新门控，减少LoRA低秩空间中的梯度冲突与覆盖。作者在三种骨干、七个指令数据集上报告收益；尚未证明对任意模型与数据分布同样有效。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### CheckerBench：评测 Agent 编写静态分析检查器

- ID：`checkerbench-static-analysis-agent-evaluation`；标签：ai, agents, papers。
- 来源：[CheckerBench: Can Long-Horizon Agents Synthesize Static-Analysis Checkers?](https://arxiv.org/abs/2610.07557v1)；原始首版提交时间 **2026-10-06 00:42:45 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：300项任务要求Agent理解缺陷、修改仓库并利用编译反馈完善检查器。21种模型与执行框架组合的平均Pass@1为32.30%；结果反映这一特定检查器开发基准，不能等同完整安全审计能力。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。


## 2026-10-07：5 条

### 自我改进循环中的评测噪声与赢家诅咒

- ID：`self-improvement-winners-curse`；标签：ai, agents, papers。
- 来源：[The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules](https://arxiv.org/abs/2610.09239v1)；原始首版提交时间 **2026-10-07 00:05:23 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：研究反复复用小评测集筛选提示词所造成的高估。Qwen实验中，选择集得分与留出集表现存在明显差距；论文主张报告独立留出评测及不确定性，未发现测试的接受规则能普遍解决问题。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### 仅用样本评估 Best-of-N 推理策略

- ID：`best-of-n-sample-only-policy-evaluation`；标签：ai, papers。
- 来源：[Efficient Best-of-N policy evaluation for inference-time alignment](https://arxiv.org/abs/2610.09250v1)；原始首版提交时间 **2026-10-07 00:26:39 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：利用得分排名估计策略价值，无需取得模型回答的概率，并据置信区间选择采样预算。验证包含合成实验和GSM8K；理论保证依赖论文假设，不意味着真实部署中不会产生错误回答。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### LeCuration：用小型世界模型辅助数据整理

- ID：`lecuration-small-world-model-data`；标签：ai, papers。
- 来源：[LeCuration: A Tiny World Model as a Data Curation Multi-Tool](https://arxiv.org/abs/2610.09285v1)；原始首版提交时间 **2026-10-07 01:41:23 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：以潜在世界模型加扩散解码器，探索异常检测、内容聚类和动作状态一致性检查。论文仅提供CS:GO游戏数据上的定性概念验证，尚未报告量化整理指标或下游训练收益。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### RT-Safe：将推理延迟纳入具身 Agent 安全评测

- ID：`rt-safe-real-time-embodied-safety`；标签：ai, agents, papers。
- 来源：[RT-Safe: Benchmarking Agent Safety in Real-Time Embodied Environment](https://arxiv.org/abs/2610.09294v1)；原始首版提交时间 **2026-10-07 01:57:17 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：城市模拟环境在模型推理时持续运行，联合评测任务完成与碰撞等安全事件。八种视觉语言模型显示成功率可能掩盖实时风险；结果来自模拟城市，不能作为真实道路事故率预测。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### SearchWorld：以空间记忆与想象辅助无人机搜索

- ID：`searchworld-spatial-world-model-uav`；标签：ai, agents, papers。
- 来源：[SearchWorld: Spatial Value-Grounded Imagination for UAV Object Search via World Models](https://arxiv.org/abs/2610.09335v1)；原始首版提交时间 **2026-10-07 02:51:02 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：世界模型把俯视探索记忆、障碍物和任务价值结合，用想象轨迹改进搜索策略。作者在UAV-ON报告23.8%成功率、未见场景为19.9%；仍有大量失败，实验不证明真实城市自主飞行可靠。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。


## 2026-10-08：5 条

### 无需字幕的原始视频中期训练

- ID：`raw-video-language-model-mid-training`；标签：ai, papers。
- 来源：[Mid-Training Language Models on Raw Video](https://arxiv.org/abs/2610.11019v1)；原始首版提交时间 **2026-10-08 00:03:39 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：研究让Qwen3-1.7B预测连续视觉标记，再进行相同的图文指令微调。作者在所测图像和视频任务上报告提升，文本均值保持；实验集中于这一模型与训练配置，未证实普遍扩展规律。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### Intent Graph：让探索性数据分析路径可检查

- ID：`intent-graph-exploratory-data-analysis`；标签：ai, papers。
- 来源：[Intent Graph: Navigating the Analytical Reasoning Space for Exploratory Data Analysis](https://arxiv.org/abs/2610.11025v1)；原始首版提交时间 **2026-10-08 00:19:01 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：DAG-EDA以意图图拆解分析问题，以知识图把领域概念连接到数据变量，支持分支比较和回溯。论文展示使用场景及用户研究设计，尚未提供已完成用户实验的效果证据。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### NOMOS：将文字策略编译成工具调用门控

- ID：`nomos-verified-agent-tool-gates`；标签：ai, agents, papers。
- 来源：[NOMOS: Compiling Written Policies into Statically Verified Tool-Call Gates for LLM Agents](https://arxiv.org/abs/2610.11030v1)；原始首版提交时间 **2026-10-08 00:23:22 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：四阶段编译器把自然语言策略变为确定性门控，并用工具模式静态检查规则。作者在客服与提示注入基准上报告违规减少；效果受策略表达与绑定完整性限制，不能保证拦截所有有害行为。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### AgentHorizon：检验长流程电脑操作的自动裁判

- ID：`agenthorizon-long-horizon-judges`；标签：ai, agents, papers。
- 来源：[AgentHorizon: Evaluating Agentic Judges for Long-Horizon Computer-Use Tasks](https://arxiv.org/abs/2610.11050v1)；原始首版提交时间 **2026-10-08 01:03:48 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：基准包含1373对指令与轨迹，利用相近指令的配对检查裁判是否发现隐藏约束与副作用。作者评测11种裁判，最优配置在AH子集平衡准确率为80.9%；自动判定仍存在明显误差。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### OpenProblemBench：面向理论科学开放问题的评测

- ID：`openproblembench-theoretical-science-evaluation`；标签：ai, papers。
- 来源：[OpenProblemBench: Benchmarking AI on Open Problems in the Foundational Theoretical Sciences](https://arxiv.org/abs/2610.11118v1)；原始首版提交时间 **2026-10-08 02:43:51 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：以82道数学和理论物理未解问题提供背景、假设与已有进展，由四个模型独立评判提交内容。论文报告的解决率属于无标准答案的模型评审结果，不能据此认定开放问题已获独立证明。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。


## 2026-10-09：5 条

### 误导图表如何影响网页 Agent 的操作

- ID：`misvisagentbench-misleading-charts`；标签：ai, agents, papers。
- 来源：[When Charts Deceive Web Agents: A Paired Benchmark for Misleading Visualization-Grounded Tasks](https://arxiv.org/abs/2610.12823v1)；原始首版提交时间 **2026-10-09 00:03:13 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：MisVisAgentBench以280个任务实例组成干净图表与误导图表配对，隔离视觉证据的影响。13种网页Agent的平均成功率下降超过34个百分点；结果来自特定可执行任务集，不代表所有真实网站。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### TreeHCA：用回溯探索改进多轮 Agent 训练

- ID：`treehca-agent-hindsight-credit`；标签：ai, agents, papers。
- 来源：[TreeHCA: Hindsight-Guided Exploration and Credit Assignment for Multi-Turn LLM Agents](https://arxiv.org/abs/2610.12828v1)；原始首版提交时间 **2026-10-09 00:23:39 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：根据参考答案似然变化回访中间步骤，采样推理和工具调用分支，再将结果传播为轮次级优势。作者在七个问答基准、三种Qwen骨干上报告总体提升；效果不等同开放任务上的普遍可靠性。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### 同时修改应用与部署配置的 Agent PR 研究

- ID：`agent-pr-code-deployment-integration-study`；标签：ai, agents, papers。
- 来源：[Co-Modifying Application Code and Deployment Infrastructure: A Causal Study of AI Agent Pull Requests](https://arxiv.org/abs/2610.12849v1)；原始首版提交时间 **2026-10-09 01:16:04 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：论文分析26999个PR，以分层匹配比较代码与基础设施共同修改的集成过程，发现审查延迟及绕过人工审查两类模式。这是依赖条件可交换性等假设的观察研究，不能把所有差异直接认定为因果效应。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### CToM：预测用户反馈后再修订回答

- ID：`collaborative-theory-of-mind-self-revision`；标签：ai, agents, papers。
- 来源：[Collaborative Theory of Mind: Learning to Self-Revise by Anticipating User Responses](https://arxiv.org/abs/2610.12872v1)；原始首版提交时间 **2026-10-09 02:01:05 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：框架先起草、预测用户回应并内部修订，将回应预测目标与GRPO结合。在数学、编程和写作协作任务上报告表现与交互效率提升；结果限于论文任务与用户回应设置，不能解释为理解人类心理。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。

### T-Mem：为多方长期对话组织时间证据

- ID：`t-mem-temporal-evidence-forests`；标签：ai, agents, papers。
- 来源：[Temporal Evidence Forests for Long-Horizon Multi-Party Conversational Memory](https://arxiv.org/abs/2610.12874v1)；原始首版提交时间 **2026-10-09 02:05:38 UTC**；固定 v1 HTTPS GET 200。
- 研究摘要及限制：以时间局部性补找遗漏消息，再用证据森林表达状态变化与支持关系，压缩低信息跨度供回答生成。作者在两个长期多方记忆基准上报告收益；实际持续对话中的长期稳定性仍需验证。
- 筛选：研究型内容，无广告导购及黄赌毒性质内容。


## 会议状态补充核验

官方 Atom comment 注明：`heterogeneous-agent-model-persona-effects` 曾在 COLM 2026 的第二届 LLM 社会模拟工作坊作 Spotlight 展示；`misvisagentbench-misleading-charts` 已获 EMNLP 2026 录用。五语言摘要以“作者注明”呈现，不将工作坊展示升级为主会录用。其他条目没有明确录用字段时，不由字段缺失推断未经同行评审。
