# 2026-11-04 OpenAI 官方入口与新增新闻复核

实际巡检与核验时间：上海时间 2026-11-04 上午，本记录截至 09:39 复核。主批先直接访问 Anthropic、OpenAI 官方发布入口；本专项再直接打开 [OpenAI 新闻目录](https://openai.com/news/)，按最新顺序逐项检查 11 月 3 日、11 月 2 日公告，衔接 10 月 30 日既有记录。优先官方巡检完成后才补充独立报道检索。未把单篇公告当成完整目录巡检。

## 全部候选与处理

| 日期 | 官方候选与入口 | 核验、去重与处理 |
| --- | --- | --- |
| 11-03 | [Accelerating engineering for the physical world](https://openai.com/index/accelerating-engineering-for-the-physical-world/) | 已读设备原型、制造限制、内部 CAD 使用、BenchCAD 2.0、CGR 与 Mazda 合作及结尾邀约。跟进 Astra 页面及 [CGR 官方合作页](https://openai.com/index/chip-ganassi-racing/)。原型仍需制造审查；0.875 与 0.594 为厂商自报，未见可复现 BenchCAD 2.0 完整方法。正文主要是合作案例与推广，暂缓独立成稿，不采用销售或合作招募段落。Mazda 演示注明不得转载，不下载使用其图片或视频。 |
| 11-03 | [Jill Hazelbaker 任命](https://openai.com/index/jill-hazelbaker-chief-corporate-affairs-officer/) | 已读职责、履历、公司与本人引述。属于企业事务人事稿，无相应技术或服务交付；排除本批。 |
| 11-02 | [Preparing our next security sprint](https://openai.com/index/preparing-our-next-security-sprint-to-harden-openai/) | 已读全文，跟进 [Defense Factory 公开说明](https://openai.com/the-defense-factory/)。新一轮与 Cathedral 合作尚在准备，没有成果可报道；合并作为奖励制度稿的背景，不单独计数，不将此前 25% 产品工程师参与的行动写成此次已完成。 |
| 11-02 | [Rewarding defenders with bigger bug bounties](https://openai.com/index/rewarding-defenders-with-bigger-bug-bounties/) | 已读全文、条件、示例和追溯范围；结合 Help Net Security 独立报道收录制度变化。公告所链 [Bugcrowd 项目](https://bugcrowd.com/engagements/openai)仅返回页面外壳，更新页未能读取；没有冒称已逐项检查平台全部规则，不采用官方公告以外的奖励等级细则。 |
| 11-02 | [LifeVal](https://openai.com/index/lifeval/) | 已重读全文，并发现当前有可读 [16 页技术报告](https://cdn.openai.com/pdf/lifeval.pdf)，封面日期 11-03。实际阅读方法、评分、结果、限制及附录，查看结果图。公开方法补足了上轮暂缓时的重要证据，现收录；不能继续沿用“没有论文”的旧判断。仍未见完整任务集供外部复现，不宣称开源或独立验证。 |
| 11-02 | [Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/) | 复核动机、读写取舍、生产部署与贡献口径，衔接上轮已读全文和公开 Git 链接。Pando 为内部生产后端，不能称已对外发布或全套开源；本轮未取得新的可靠独立核验，维持暂缓，不为数量重发。 |
| 11-02 | [Grid Protectors](https://openai.com/index/grid-protectors-program/) | 已读当前全文，与 `openai-grid-protectors-demand-response-plan` 重复；没有新增已落地园区合同或运行结果，不重复收录。 |
| 11-02 | [Dan Driscoll 任命](https://openai.com/index/dan-driscoll-joins-openai/) | 已重读全文，延续上轮判断：人事与政策合作表述，无独立具体交付，排除本批。 |
| 10-30 | [网站训练偏好](https://openai.com/index/helping-websites-express-ai-training-preferences/) | 已读当前全文，仍是未来数月实现共同信号、保留既有控制。与 `openai-shared-training-preference-signal-plan` 重复，不重复收录。 |

同时直接检查[官方产品发布记录](https://openai.com/products/release-notes/)和[模型发布记录](https://help.openai.com/en/articles/9624314-model-release-notes)。近期条目仍至 10-30，Rosalind、Terra、额度与模型规范已有记录；促销 API 额度排除。未把该列表没有新日期外推成全渠道没有任何新消息。

## 新增 1：漏洞报告质量与奖励规则

ID：`openai-security-bounty-quality-bonuses`。原始发表日期 2026-11-02，收录及正文日期 2026-11-04。类别为网络安全。

- 官方公告的“Serious vulnerabilities”段：中等、高危、严重等级奖励区间的中点平均超过原来的四倍，不是每份奖励或最高额都涨四倍。核心产品严重发现基础奖励最高 30,000 美元；特别严重发现既有基础上限 100,000 美元，奖金叠加后的可能总额约 172,000 美元。所有上限保持条件限定。
- “High quality”“Loyalty”“Priority campaign”三段：证据质量奖励、五级持续贡献奖励、短期重点测试奖金。正文只解释制度与证据如何帮助修复，不包含参与邀约、活动日期、宣传补贴或购买引导。
- “Updated payout calculation examples”明示情形及历史金额均为说明性示例。不当作真实漏洞披露、尚未修复事件或已发生付款；不转写攻击细节。
- “Retroactive payments”：未授奖报告使用新区间；公告前 30 天已授奖报告若按新规更多，则补基础奖励与持续贡献奖励差额。未扩大为所有旧报告或所有奖励类型可追溯。
- 同日 sprint 公告与 Defense Factory 资料提供持续发现、隔离验证、准备补丁与人工审查的背景；下一轮尚在计划，不声称已取得新安全结果。正文不携带内部代码、环境信息或操作命令。
- 已实际阅读 [Help Net Security 11 月 3 日独立报道](https://www.helpnetsecurity.com/2026/11/03/openai-bigger-bug-bounty-rewards/)，作者 Anamarija Pogorelec。该报道确认基础与叠加上限、质量激励、旧报告处理；未把新闻报道当成实测安全效果。与官方日期区别，采用原公告 11 月 2 日。

## 新增 2：LifeVal 方法公开

ID：`openai-lifeval-personalized-agent-evaluation`。新闻公告原始日期 2026-11-02；技术报告封面为 2026-11-03。真实收录及正文日期为 2026-11-04，新闻仍按公告原始日期归档，五语言导语均说明两个日期。

实际核验原文定位：

1. 报告 §3.1、附录 A.2：148 个活动类别用于任务收集配额，最终比较为 §4 的 169 个任务。不能把类别数、收集目标数和最终评测数混用。
2. §3.2—3.4：有经验的任务作者提供要求、背景、文件、初始状态与评分细则；涉及历史对话和记忆的研究使用取得同意并去标识化，个人身份内容由合成资料替换；至少三轮人工审核。公开稿不复制任何个体实例、对话、文档或个人信息。
3. §3.3、3.5：模型在可控应用环境中执行并使用离线网页资料；两个基于 GPT-5.6 的评分/检查机制分别核验完成证据与利用环境捷径的行为。检测到后者则该次为零分。正文只解释机制，不提供捷径或操作细节。
4. §4、图 5：169 任务，模型为 GPT-5.2、5.4、5.5、5.6、GPT-6 Astra；每次最长 8 小时。图示平均 reward 是允许部分得分的评价，不能转写为现实事务完全成功率。已直接查看论文图 5、图 6；不抄取图像，也不将示例最佳分数当平均数。
5. 附录 A.3：17 名人工评分者评估 30 条 GPT-5.5 运行轨迹；平均人工 83.61%、自动 84.20%，相关系数 0.864。正文采用样本、模型和相关系数，明确只是局部一致性证据，不是外部复现或全覆盖保证。
6. 附录 B：删除额外背景显著降低得分；把这类背景移入历史对话，降幅相近。论文认为显式背景承载较多必要个人信息，模型从旧对话中发现并利用信息仍困难。正文不将“有记忆”写成“能稳定利用全部记忆”。
7. §4.1、§5：错误信息/建议、遗漏和未完成动作仍存在；美国、英语调查代表性有限，付费意愿是自报代理指标，网页缓存未完全冻结。结果为厂商自评，没有其他厂商对照，也未开放完整任务集供外部复现。
8. 人数差异明确记录：公告 3,995；论文 §3.1、A.2 为 3,837 完成、1,826 筛后保留。两者未解释衔接，五语言正文均写明，不自行编造筛选关系。论文时间调查年份表述也不完全一致，稿件不采用具体年份外推。未使用万亿美元估值作经济实绩。
9. 已读 [ALFW 对平均与精选最佳分的外部分析](https://alfw.ai/article/openai-lifeval-806-average-best-recorded/)，用于识别平均分与精选高分的差异和复现边界。其部分“方法未公开”表述早于当前可读报告，不能覆盖本次原论文核验。曾检索到其他“无论文”的旧报道，同样不直接沿用。正文技术事实只依据当前原始论文和官方公告。

## 配图、五语言与内容筛选

- 原创封面为 `images/news/openai-bounty-evidence-review.svg` 与 `images/news/openai-lifeval-context-evidence.svg`，仅用流程框、箭头和事实标签解释机制；均已渲染并目视检查可读性，不复制品牌图、受限 Mazda 演示或论文图表。图注注明解释性重绘，不冒充实验结果。站内图片使用生产 HTTPS 链接，随本批发布生效。
- 两条均具备简体中文、英语、日语、俄语、繁体中文导语、三节六段与对应机制说明，显著多于卡片摘要，保留日期、条件、结果归因与限制。
- 奖励制度属于负责任漏洞披露新闻，不是促销返利稿。所有发布文本已删除活动引流、合作招募和购买号召；没有色情、赌博、毒品性质内容或相关推广。
- 已人工复核五语言标题、摘要、正文、图注与来源记录，未携带本机身份、私密用户信息、绝对路径、内网地址、凭据、内部代码、终端命令或日志。结构和公开内容检查通过；全站检查由主批统一执行。
- 本专项新增 2 条、完成新增正文 2 篇、历史补写 0 篇、撤下 0 条。后续统一统计不把两篇来源或两个图示重复计作新闻。
