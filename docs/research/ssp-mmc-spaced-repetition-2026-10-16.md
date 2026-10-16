# SSP-MMC 论文研究笔记

研究日期：2026-10-16。仅研究与记录；未修改练习系统。

论文：Junyao Ye、Jingyong Su、Yilong Cao，*A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling*，KDD 2022，4381–4390，DOI [10.1145/3534678.3539081](https://doi.org/10.1145/3534678.3539081)。作者来自哈工大深圳与 MaiMemo，因此准确说法是高校与墨墨合作研究。[官方项目](https://github.com/maimemo/SSP-MMC)

## 主要思想

把“何时复习”拆成两件事：DHP 预测复习对记忆的影响；SSP-MMC 在预测模型中寻找达到目标记忆强度的最低预期时间成本。研究使用约 2.2 亿条词汇复习日志，包含历史结果与间隔，而非仅累计次数。[作者上传的原论文](https://www.researchgate.net/publication/369233423_A_Stochastic_Shortest_Path_Algorithm_for_Optimizing_Spaced_Repetition_Scheduling)，§3–4；[官方中文全文](https://memodocs.maimemo.com/docs/2022_KDD)

## DHP 与调度

DHP 是 Difficulty–Halflife–P(recall)：难度 d、半衰期 h、当前回忆概率 p。遗忘曲线为 `p = 2^(-Δt/h)`，所以半衰期表示不复习时回忆概率降至 50% 所需的时间。SSP 求解时的状态是 `(d,h)`，动作是下次复习间隔 Δt；p 由动作和 h 得出，复习结果 r 服从 Bernoulli(p)。

公开代码中的参数化转移：

- 记起：`h' = h × [1 + exp(3.81) × d^-0.534 × h^-0.127 × (1-p)^0.970]`；d 不变。
- 遗忘：`h' = exp(-0.041) × d^-0.041 × h^0.377 × (1-p)^-0.227`；`d' = min(d+2,18)`。

成功提取时，较低的 p 会带来更大的巩固增益；但等待太久会增加遗忘风险和重学成本。不能把这概括为“越晚复习越好”。[官方模型实现](https://github.com/maimemo/SSP-MMC/blob/main/model/utils.py)，[官方求解器](https://github.com/maimemo/SSP-MMC/blob/main/algo/main.cpp)

SSP 的“路径长度”是累积复习成本，不是日历等待时间。Bellman 方程为 `J(d,h)=min_Δt E[g(r)+J(d',h')]`，达到目标半衰期后余下成本置零；公开求解器将半衰期按 1.05 的对数网格离散化，对候选整数天间隔迭代求解。成功成本设为 3，失败成本设为 9。它优化整个未来过程，不只优化下一次正确率，也不是固定保持 90% 正确率。[求解器](https://github.com/maimemo/SSP-MMC/blob/main/algo/main.cpp)

## 12.6% 到底指什么

这是同一个 DHP 环境中的**离线模拟**结果，不是线上随机对照实验的记忆准确率提高 12.6 个百分点。条件为目标半衰期 360 天、每日学习成本约 600 秒、模拟 1000 天。让 6000 个项目达到目标半衰期：SSP-MMC 466 天，THRESHOLD 533 天，ANKI 569 天，MEMORIZE 793 天；`(533-466)/533≈12.6%`。达到目标的项目在模拟中退出复习，不能解释成永久不会忘。[原论文 §5.3](https://www.researchgate.net/publication/369233423_A_Stochastic_Shortest_Path_Algorithm_for_Optimizing_Spaced_Repetition_Scheduling)，[官方模拟器](https://github.com/maimemo/SSP-MMC/blob/main/simulator.py)

材料核对提醒：官方中文译文把 THRESHOLD 写成 80%，但目前公开 `simulator.py` 的公式是 `-h*log2(0.9)`，即 90%。引用数字应明确版本，不宜把译文的 80% 当作已复现的代码设置。

## 边界与对 Learn Linux Command 的启发

“最优”限定在拟合模型、候选动作、设定成本与目标之内。模型按聚合日志拟合，作者把纳入用户特征、拓展到词汇之外列为未来工作；不应宣称已完整刻画个人记忆，更不能直接保证 Linux 技能也提升 12.6%。[原论文 §6](https://www.researchgate.net/publication/369233423_A_Stochastic_Shortest_Path_Algorithm_for_Optimizing_Spaced_Repetition_Scheduling)

以下是产品推论，非论文直接证明：

- 可以把复习拆到“命令用途、关键参数、路径规则、组合技能”，记录每次实际提取结果和跨天间隔。
- 过关只证明当次完成；应在后续变换文件名、数据与场景，观察能否再次独立完成。
- 不宜把每条错误命令视为遗忘：探索、拼写错误、任务理解偏差与记忆失败需区分。
- 先验证复习的跨天保持效果，再考虑训练自有模型；不能照搬背单词的 3/9 秒成本和参数。
- 复习调度负责决定“何时再练”，任务教学与组合迁移仍需独立设计。
