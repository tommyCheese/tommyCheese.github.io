# 前沿研究补录核验：2026-10-10 至 2026-10-13

核验日期：2026-10-17（上海时间）。共新增 20 条，四天各 5 条；10 月 13 日另有原已收录的 Into the Unknown，不计入此次新增数量。

## 核验方法

从 arXiv 原始 Atom API 按 `cat:cs.AI` 与 `submittedDate` 的单日区间检索，读取每篇的 `published`、作者、题目和完整摘要，再逐一打开固定 `v1` 摘要页检查 `Submitted on` 日期与摘要存在性。日期使用原稿 v1 提交时间，不使用最近修订日期、检索时间或工作日公告时间。所选稿件均在 UTC 当日凌晨提交，换算上海时间也仍属同一日期；10 月 10、11 日确有周末原始提交记录，无倒填。

所有内容均为预印本，不宣称已完成同行评审。摘要采用方法、作者报告结果及适用范围的结构，未把实验结果解释为部署保证。五语言逐项提供标题和摘要。

## 内容过滤

逐条检查原始题目、摘要与主来源链接：选中条目均为研究方法、评估或实验成果，无广告导购、返利购买引导及色情、赌博、毒品性质内容。隐私、安全评估条目仅概述防护及评测结论，不提供攻击操作步骤。检索中出现的横幅广告拍卖、用药推荐等不适合本次选题方向的稿件未收录。

## 逐条记录

### 2026-10-10

- **用可移植技能简化 Agent 检索增强流程**（`portable-skills-agentic-rag`）
  - 原始来源：[Frustratingly Easy Agentic RAG via Portable Skills: A Case Study in Customer Support](https://arxiv.org/abs/2610.14428v1)；Istok Bako 等。
  - v1 提交时间：`2026-10-10T00:49:01Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：论文用自然语言技能、轻量工具和文档导航层生成客服处理流程。在需人工审核的整理文档库中，作者报告较高流程一致性，但每例约需 90 秒，慢于原有助手，结论仅适用于该场景。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **SceneForesee：评测视频中实体的未来变化**（`sceneforesee-scene-evolution`）
  - 原始来源：[SceneForesee: Learning Scene Evolution for Spatiotemporal Reasoning](https://arxiv.org/abs/2610.14439v1)；Chaoyue Li 等。
  - v1 提交时间：`2026-10-10T01:12:24Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：研究构建共享实体标识的观测与未来场景配对数据，并提出 EvoSee 联合预测轨迹和事件。作者在 SceneForesee 与 Dyn-Bench 上报告改进，结果支持所测场景推理任务，不能视为开放世界预测可靠性的证明。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **TETPO：按有效样本量调节异步强化学习**（`tetpo-effective-sample-size`）
  - 原始来源：[Target-ESS Tempered Policy Optimization (TETPO): Smooth Variance Control via Bridge Importance Sampling](https://arxiv.org/abs/2610.14440v1)；Shayan Mohajer Hamidi 等。
  - v1 提交时间：`2026-10-10T01:15:04Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：TETPO 根据每组提示的有效样本量调整重要性权重指数，降低旧策略轨迹集中主导更新的风险。论文给出权重离散度界，并在高延迟数学推理训练中比较基线；理论保证受桥接分布及相关假设约束。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **KV4-RL：为异步强化学习量化 KV 缓存**（`kv4-rl-rollout-quantization`）
  - 原始来源：[KV4-RL: Unlocking Faster Asynchronous Rollouts for RLVR with INT4 KV Cache Quantization](https://arxiv.org/abs/2610.14448v1)；Sihwan Park 等。
  - v1 提交时间：`2026-10-10T01:24:03Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：KV4-RL 将 INT4 KV 量化与注意力锚点及近期上下文的 INT8 保护结合。作者在 Qwen3 训练中报告整体迭代加速，并在共同 BF16 评估下保持接近基线的准确率；结论限于所测模型与训练配置。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **可执行任务契约：先确认 Agent 测试仍是同一任务**（`executable-task-contracts`）
  - 原始来源：[What Counts as the Same Task? Executable Contracts for Robustness Evaluation of Tool-Using Agents](https://arxiv.org/abs/2610.14477v1)；Shaikh Akib Shahriyar 等。
  - v1 提交时间：`2026-10-10T02:18:56Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：论文为工具型 Agent 定义事实、允许改动和完成条件，在运行前检查变更是否保留原任务。对 14,336 次已存运行的重评分发现，嵌入相似度会放行改变任务的修改；研究强调测试有效性，不等于提供通用安全保证。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

### 2026-10-11

- **MoMaTune：面向数值记录的两阶段后训练**（`momatune-numerical-records`）
  - 原始来源：[MoMaTune: Model, Match, Then Tune Language Models for Numerical Records](https://arxiv.org/abs/2610.15235v1)；Weimin Lyu 等。
  - v1 提交时间：`2026-10-11T00:10:31Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：MoMaTune 先在无标签序列化记录上建模，并可加入同一记录不同视图的一致性学习，再训练下游预测。作者在八个公开数据集上报告收益，说明数位敏感性和字段关系值得监督；结果不代表普遍数值推理能力。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **Sequent-Prover：借助求解器训练可检查推理**（`sequent-prover-verifiable-reasoning`）
  - 原始来源：[Sequent-Prover: Training Agents for Formal, Checkable SMT-based Reasoning](https://arxiv.org/abs/2610.15258v1)；Debargha Ganguly 等。
  - v1 提交时间：`2026-10-11T01:10:19Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：Sequent-Prover 让模型编写 SMT-LIB、调用 Z3 并修复形式化过程，以筛选轨迹进行蒸馏和偏好训练。作者在 37 个基准上报告准确率提升及调用减少，同时强调求解成功不必然意味着形式化忠实于原问题。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **RECAP：用历史上下文校准低比特推理模型**（`recap-history-aware-quantization`）
  - 原始来源：[RECAP: Calibrating Low-Bit Reasoning Models on the History They Read](https://arxiv.org/abs/2610.15259v1)；Chi Ruan 等。
  - v1 提交时间：`2026-10-11T01:10:33Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：RECAP 在量化校准时保留长历史前缀并轮换短重建区块，按历史缓存对注意力输出的影响设置监督。作者在多种低比特推理配置上报告优于基线；这些结果来自特定模型和基准，未证明任意长链推理均能保真。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **LeHami：用辛几何约束世界模型的潜在动力学**（`lehami-symplectic-world-models`）
  - 原始来源：[LeHami: Symplectic Latent Dynamics for World Models](https://arxiv.org/abs/2610.15267v1)；Romina Yalovetzky 等。
  - v1 提交时间：`2026-10-11T01:28:41Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：LeHami 用辛积分的哈密顿流替换 JEPA 的自由预测器，在结构上保持潜在相空间体积。视觉摆环境实验显示长时速度预测改善，但验证集中在守恒及受控摆系统，不能直接推广到复杂现实世界。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **Co-DSL：人机共同设计可复用空间概念**（`co-dsl-layout-concepts`）
  - 原始来源：[Co-DSL: Human-LLM Co-design of Reusable Spatial Concepts for Layout Generation](https://arxiv.org/abs/2610.15290v1)；R. Kenny Jones 等。
  - v1 提交时间：`2026-10-11T02:49:48Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：Co-DSL 将用户描述和反馈转成可复用空间操作，由语言模型组合概念图，再由求解器寻找满足约束的布局。研究在五类空间布局任务上展示效果，结论依赖概念库和约束表达，未覆盖任意设计需求。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

### 2026-10-12

- **逐层量化误差补偿：保证何时成立、何时失效**（`quantization-compensation-limits`）
  - 原始来源：[When Does Compensating Inherited Quantization Error Help? Mean-Square Guarantees for Layer-Wise Quantization and Their Limits](https://arxiv.org/abs/2610.16020v1)；Tianhao Guo 等。
  - v1 提交时间：`2026-10-12T00:41:39Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：论文推导线性网络在指定舍入噪声等假设下的均方误差改进保证，并展示激活函数、有限码本等可使比较失效。两种 8B 模型实验支持谨慎使用补偿强度，校准数据上的损失下降不保证新文本收益。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **ECHO：按错误责任分配工具型 Agent 的训练反馈**（`echo-agent-credit-assignment`）
  - 原始来源：[Of Errors and Echoes: Responsibility-Aware Credit Assignment for Tool-Use Agents](https://arxiv.org/abs/2610.16027v1)；Xingjian Diao 等。
  - v1 提交时间：`2026-10-12T00:52:30Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：ECHO 用冻结评审器区分新错误、继承后果和有效纠正，对共享后果只计分一次，并限制自行制造错误后的修复奖励。作者在 4B、8B 模型的六项工具任务上报告改进；方法仍依赖评审器的责任判断质量。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **RECONS：按接收方和通信路径约束多 Agent 隐私泄漏**（`recons-multi-agent-privacy`）
  - 原始来源：[When Agents Talk, Secrets Travel: Topology-Driven Leakage and Recipient-Conditioned Sanitization in Multi-Agent LLM Systems](https://arxiv.org/abs/2610.16039v1)；Sunday Oyinlola Ogundoyin 等。
  - v1 提交时间：`2026-10-12T01:23:51Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：研究在 485 个情境中观察授权信息如何经常规协作流向未授权 Agent。RECONS 结合接收方和执行上下文脱敏，在保留多数授权披露时降低泄漏，但仍有残余披露，检测覆盖率是主要瓶颈。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **Agent 基准审计：评分器缺陷可能改写成功率**（`agent-benchmark-oracle-integrity`）
  - 原始来源：[When Agent Evaluation Becomes Unreliable: An Empirical Study of Oracle Failures and Configuration-Dependent Measurement in an LLM Agent Benchmark](https://arxiv.org/abs/2610.16067v1)；Junjie Chen 等。
  - v1 提交时间：`2026-10-12T02:11:43Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：论文提出状态完整性约束与已知答案控制，审计会在评分前修改环境状态的基准缺陷。4,320 次运行经回放校正后，成功率由 94.3% 降至 65.5%；另一个基准缺少可重建终态，方法无法直接验证。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **Dream2Discern：不用新增轨迹训练运行时失败预测器**（`dream2discern-runtime-auditor`）
  - 原始来源：[Dream2Discern: Learning from Hard Latent Variants for Runtime Failure Prediction in Multi-Agent Systems](https://arxiv.org/abs/2610.16071v1)；Boxuan Zhang 等。
  - v1 提交时间：`2026-10-12T02:19:44Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：Dream2Discern 扰动已有轨迹前缀的表示，生成审计器当前难以分类的隐空间变体，再沿用原标签训练。作者在 AFTraj-2K、StepShield 上报告超过 90% 的轨迹加权准确率，但仅验证记录数据上的结果预测。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

### 2026-10-13

- **FEP：跨异构事件日志预测下一个事件**（`foundation-event-predictor`）
  - 原始来源：[Foundation Models for Event Prediction Across Heterogeneous Event Logs](https://arxiv.org/abs/2610.17503v1)；Fabian Spaeh 等。
  - v1 提交时间：`2026-10-13T00:00:04Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：FEP 将基于上下文的非参数事件预测写成注意力运算，以稳健嵌入和时间归一化适应不同系统。作者在 696 个日志数据集预训练，并在 50 个未见数据集上无参数适配评估；效果随目标任务变化。
  - 类型：预印本；标签：`ai`, `papers`。过滤：通过。

- **YUBI-Real2Sim：检查重建场景能否可靠评价机器人**（`yubi-real2sim-policy-evaluation`）
  - 原始来源：[YUBI-Real2Sim: 3DGS Scene Verification for Reliable Policy Evaluation](https://arxiv.org/abs/2610.17521v1)；Hiroki Nishizawa 等。
  - v1 提交时间：`2026-10-13T00:33:21Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：框架将双鱼眼视角、3D 高斯重建与物理模拟结合，在九组场景任务比较中有八组复现实机策略排序。研究同时测试空洞和漂浮伪影影响，指出画质分数尚不能形成通用可靠的场景验收规则。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **Box-WAM：用物体框轨迹压缩机器人未来状态**（`box-wam-compact-world-actions`）
  - 原始来源：[Box-WAM: Box Trajectories as Compact State Representations for World Action Models](https://arxiv.org/abs/2610.17526v1)；Qinxi Yu 等。
  - v1 提交时间：`2026-10-13T00:42:36Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：Box-WAM 用任务相关物体的有向包围框轨迹替代整帧未来视频，联合预测动作与物体运动。作者报告在机器人操作任务中减少计算并改善动作预测，但紧凑表示能否保留开放环境所需细节仍需更广泛验证。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **TacitVLA：让动作不必等待推理文本生成**（`tacitvla-reasoning-latency`）
  - 原始来源：[TacitVLA: Reasoning Vision-Language-Action Models Without Reasoning Latency](https://arxiv.org/abs/2610.17540v1)；Jack Lu 等。
  - v1 提交时间：`2026-10-13T01:09:25Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：TacitVLA 保留推理监督，但动作专家不读取当前调用生成的推理文本，长任务中的记忆可在执行动作时生成。作者在四个操作及驾驶基准上比较延迟与表现，结果是受控实验结论，不能视为实际驾驶安全认证。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

- **Agent 记忆认证：事实变化后如何停止复用旧结论**（`safe-agent-memory-certification`）
  - 原始来源：[Many Steps into One: Reasoning Contraction and the Limits of Safe Memory Reuse for LLM Agents](https://arxiv.org/abs/2610.17544v1)；Jianghong Zhou 等。
  - v1 提交时间：`2026-10-13T01:16:37Z`；摘要页日期与 Atom `published` 一致。
  - 研究与边界：论文分析把多步推理压缩成记忆后的过期风险，提出按失败似然比认证效用、检测变化并重启证书。五种模型的改动事实问答及带精确验证器的代码实验显示优势；安全界依赖可验证反馈和规定的信息条件。
  - 类型：预印本；标签：`ai`, `agents`, `papers`。过滤：通过。

## 可复核 API

单日检索示例：[2026-10-10 原始 Atom 查询](https://export.arxiv.org/api/query?search_query=cat%3Acs.AI%20AND%20submittedDate%3A%5B202610100000%20TO%20202610102359%5D&start=0&max_results=100&sortBy=submittedDate&sortOrder=ascending)。其他三日同样按对应单日 UTC 区间查询，并以上述固定 v1 页面为逐条复核入口。

## 会议状态补充核验

`portable-skills-agentic-rag` 的官方 Atom comment 为作者注明已录用 EMNLP 2026 Industry Track。五语言摘要保留此信息，不称为未经同行评审，也不把行业轨道写成其他轨道。其他论文的评审状态以原文为准，不凭 arXiv 收录或缺少 journal_ref 推断。
