# 2026-10-29 大模型厂商新闻巡检与复核

复核日期为上海时间 2026-10-29，重点时间窗为 10 月 27—29 日，并向前查看各厂商近期列表，以区分新事件、已收录事件与旧内容。以当次 64 条新闻目录核对标题、来源地址和事件，不因新增稿较少而降低门槛。这里记录扩展厂商；OpenAI 与 Anthropic 的官网首轮巡检另见当日总来源记录。

## 入选：Gemini 4 Carbon 受控开放

- 新增 ID：`google-gemini4-carbon-defender-preview`。
- 原始发表：2026-10-28；本次收录及正文日期：2026-10-29。
- [Google 原始公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)明确显示 Oct 28, 2026。[Google DeepMind 新闻目录](https://deepmind.google/blog/)将 Genie 4 放在 Carbon 前面，但不能据排列位置判断日期；逐项打开后发现 Carbon 晚一天。原有目录只有 Genie 4，不存在本次事件。
- [Reuters 独立报道](https://tech.yahoo.com/ai/gemini/articles/google-launches-gemini-4-carbon-180841678.html)署明 2026-10-28 18:12 UTC，报道发布与先向部分防御者开放的安排。全文已阅读；网页广告、推荐及购买入口不用于正文。
- [Artificial Analysis Intelligence Index v5.0](https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index)和[模型页](https://artificialanalysis.ai/models/gemini-4-carbon)作为评测者原始来源；[CWE-bench](https://cwe-bench.com/)作为安全修复评测原始来源。
- [Fairwind 项目页](https://deepmind.google/fairwind-program/)用于解释一般准入与治理，而不是证明所有合作方已获得 Carbon。

### 正文定位与核验

1. Google 公告开头及末尾：10 月 28 日宣布，表示本周向部分网络防御团队提供、再通过 Fairwind 分阶段扩大；开发者、企业和消费者的广泛开放尚无确切日期。未发现公告交付权重，不写成开放权重、全面上线或现有服务自动切换。
2. Reuters 正文：独立确认事件与受控开放安排，性能仍明确归因 Google。无需复制其文字，不采用配套 Reuters 插画，避免图片授权问题。
3. Artificial Analysis 页的 Methodology、Score 与 FAQ：Carbon High 在 v5.0 显示 59 分，当前榜首；九项评测覆盖知识工作、编程、科学与一般能力，四类各 25%。指数不是任意真实工作完成率，版本或推理配置不同不得直接比较。页面确认独立运行测试；正文不把这一综合指数作为 Google 所有内部安全主张的验证。
4. CWE-bench 的 v1 排行和计分说明：120 个未公开的审计与修补任务、每题四次高推理尝试、每次一小时；Carbon 在 Antigravity 中程序校验 pass@1 为 71%，Argon 为 68%。该数不同于 pass@4，也不是现实环境下发现漏洞的比例。检查要求修复奏效且已有功能不受破坏。页面同时包含较旧 v0 的 100 题信息，正文只采用 v1 条件，没有混用分母。
5. Fairwind 的 Governance and trust：一般规则涉及准入审查、身份验证、访问记录及禁止转售；其合作方总量不能视为 Carbon 已开放人数。页面仍有 Argon 专属介绍，因此未推断 Carbon 已接入某个具体产品。
6. Google 对长时工程、漏洞发现、越界与编造的说明均标为厂商观察。未把未充分说明样本分母的内部增幅、提示注入零成功率或动态 Arena 排名写成独立确认事实。SEC-bench 原始站所见榜单版本没有直接核对到 Carbon，因此未将 Google 引述的 SEC-bench 成绩当作该站已独立验证。

### 新闻价值、图文与筛选

这是一项有日期、有分阶段访问安排及独立评测的新模型公告，具备真实增量。正文讲清有限开放与评测边界，不转写价格优惠、购买号召或品牌口号。完整正文为五种语言，各含三个实质章节、六段正文及独立导语，关键数字、限制、归因一致。

封面为本站原创解释图 `images/news/gemini4-carbon-defender-preview.svg`，仅表现受控访问、修复验证与防护调整，没有使用 Google/Reuters 原图，不伪造实测图表。正文流程同样标明解释性重绘。标题、摘要、正文、图注与参考来源通过人工检查，不含广告导购、色情、赌博、毒品推广，也不含私密身份、设备、内部路径、代码或运行记录。

## 厂商巡检范围与未入选原因

| 厂商 | 实际查阅的公开入口 | 截止本次可核验情况与处理 |
| --- | --- | --- |
| 月之暗面 Kimi | [研究列表](https://www.kimi.ai/blog/)、[Kimi K3 官方资料库](https://github.com/MoonshotAI/Kimi-K3) | 官网最新为 10 月 24 日 K3.1 Pro，已有 `kimi-k31-pro-hosted-release`。未核验到 27—29 日新的原厂事件，不把第三方“开放权重”标记当作权重交付证据。 |
| DeepSeek | [官方更新日志](https://api-docs.deepseek.com/updates/)、[官方项目列表](https://github.com/deepseek-ai)、[Harness 发布页](https://github.com/deepseek-ai/deepseek-harness/releases) | API 日志最近为 10 月 17 日。10 月 28 日的 Harness alpha/rc 是实际软件预发布；当前来源以版本说明为主，暂未选为本批综合新闻，不解释成基础模型发布。 |
| Qwen | [新官网](https://qwen.ai/blog)、[旧博客](https://qwenlm.github.io/blog/)、[官方项目列表](https://github.com/QwenLM)、[模型组织](https://huggingface.co/Qwen)、[Qwen Code 发布页](https://github.com/QwenLM/qwen-code/releases) | 新官网未取得可完整阅读的动态文章列表，旧博客已指向新站，不能将旧页当当前全量。补查模型组织与发布页：模型页显示已有 3.8 系列，代码工具 10 月 28 日发布 0.26.3。工具支持某模型别名不是基础模型正式发布证据；未采用 Qwen4 日期传闻。 |
| 智谱 GLM / Z.ai | [正确的官方更新日志](https://docs.z.ai/release-notes/new-released)、[官方项目列表](https://github.com/zai-org)、[AutoClaw 文章列表](https://autoclaw.z.ai/blog/) | 日志所见模型更新最近为 8 月 26 日 GLM-5.3-Flash，项目列表有 10 月 27 日插件维护。AutoClaw 近期多为赠送额度和登录奖励，直接排除；没有凭奖励活动生成研究/模型新闻。 |
| MiniMax | [官方新闻](https://www.minimax.io/news)、[官方 IR 发布列表](https://ir.minimax.io/news-events/new-releases)、[官方项目列表](https://github.com/MiniMax-AI) | 新闻主入口正文不完整，以 IR 列表补充，最近可读发布日期为 10 月 22 日 Mini App、10 月 19 日 M3.1 Flash。已收录 10 月 23 日 vLLM 支持进展，不重复。项目最近更新不自动等于新发布。 |
| 字节跳动 Seed | [官网](https://seed.bytedance.com/en/)、官网 Blog & Publication 入口 | 主页近期项包含 10 月 14 日招聘，后续列出的模型文章更早；没有将招聘、演示/产品入口或未核验 Seedance 传闻收为新模型发布。动态目录仍有内容提取限制，不能据此断言全网没有新消息。 |
| Google DeepMind | [新闻目录](https://deepmind.google/blog/)及十月候选详情 | Carbon 10 月 28 日入选；Genie 4 10 月 27 日已收录。ForTy 森林分类原文为 10 月 22 日、抗菌肽候选为 10 月 15 日、新加坡防诈骗合作为 10 月 14 日，不伪装成 27—29 日发布。 |

### 需避免的误报

- [第三方 Flash Cyber 目录](https://llmgateway.io/models/deepseek-v4.1-flash-cyber)标注 10 月 29 日，描述为基于 Flash 1017 的修改版本且只列第三方提供者。它不是 DeepSeek 官方发布证明；官方日志未找到对应事件，本次排除。
- Qwen Code 0.26.3 的模型别名处理和模型组织中的既有模型不能证明 Qwen4 正式上线。社区发布日期猜测、付费追踪页面以及产品推广内容不用于发稿。
- Qwen Code 与 DeepSeek Harness 的实际软件更新保留为后续选题线索；新闻按增量选择，不为凑足厂商数量逐个发版本摘要。

本次扩展厂商共形成 1 条新增新闻、1 篇五语言完整正文，未撤下现有合格新闻。访问失败或动态列表限制已明确记录，不将有限巡检表述为完整覆盖所有渠道。

## 扩展入选：GitHub Actions 依赖锁文件正式提供

- 新增 ID：`github-actions-workflow-lockfiles-ga`；原始发表 2026-10-28，收录及完整正文日期 2026-10-29。原目录没有该事件，没有将同场发布拆成多条。
- [GitHub 正式公告](https://github.blog/changelog/2026-10-28-github-actions-workflow-lockfiles-are-generally-available/)完整阅读，页面显示 October 28, 2026。原文首段及能力清单确认从公开预览进入正式提供，面向 Enterprise Cloud、带数据驻留的 Enterprise Cloud、Team 与 Free。不是全体仓库自动启用。
- [官方概念文档](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles)的 Why、How、What 三节完整核验：固定直接与传递 action 依赖、记录提交和来源仓库身份、逐工作流启用。当前文档明确排除可复用工作流调用的那层引用；被调用工作流内部的依赖由定义它的仓库自行管理。不会把所有构建输入都锁定。
- [官方工具说明](https://github.com/github/gh-actions-lock)的 Limitations 节确认：不固定跨仓库可复用工作流调用，不锁容器镜像；本次正文只用自然语言说明能力及边界，不转载工具命令、内部实现或示例代码。
- [公开问题 #179](https://github.com/github/gh-actions-lock/issues/179)的 10 月 20 日维护者回复承认早期文档存在错误。结合当前概念文档，正文不沿用“可复用工作流调用也已覆盖”的过宽表述。该限制并非从一条用户猜测推断，而有维护者与现行官方说明相互印证。
- [DevOpsNess 独立技术评述](https://www.devopsness.com/blog/github-actions-workflow-lockfiles)发表于 10 月 26 日，已阅读正文与限制表。它讨论的是预览版本的技术价值和覆盖缺口，不作为 10 月 28 日正式提供的独立日期证据。可用于区分真实功能变化与活动宣传，事实仍以原始公告及当前文档复核。
- Dependabot 对已接入工作流的版本更新会同步匹配的锁定记录；不会自动把未接入工作流纳入。版本固定不能证明依赖本身没有漏洞，不写成已验证减少某比例攻击，也不虚构实测。
- 原创封面 `images/news/github-actions-lockfiles-ga.svg` 描述“审查来源—锁定版本—执行核对”，下方说明未覆盖输入；正文示意图明确为本站解释性重绘，没有使用第三方图片或伪造实验结果。五种语言的关键事实、正式提供口径与限制一致。
- 内容复核通过：实质软件供应链安全功能，不是活动日程、套餐促销或品牌宣传；无色情、赌博、毒品推广，无私密身份、本机路径、设备、凭据、内部代码或运行记录。

本次最终交付共 2 条新增新闻、2 篇五语言完整正文，分别涉及 Google DeepMind 的受控模型访问及 GitHub 的软件供应链安全功能；未撤下既有合格新闻。前文 1 条计数仅指大模型厂商巡检直接形成的入选，扩展科技方向后总计为 2 条。
