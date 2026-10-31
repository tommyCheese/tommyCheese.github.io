# 2026-11-01 新闻来源与复核

本次收录和正文撰写日期为上海时间 2026-11-01。新增 3 条，新增条目均有五语言完整正文；补齐 5 篇历史正文，撤下 0 条。保留原始发布日期，不以本次整理时间改写旧闻。完成后新闻共 78 条，60 篇有完整正文，18 篇历史正文待补齐。研究栏目及其每日规则不作改动。

## 首先巡检官方发布入口

上海时间约 03:11，在检查既有数据和近期记录后，先直接访问 [Anthropic 新闻目录](https://www.anthropic.com/news) 与 [OpenAI 新闻目录](https://openai.com/news/)。检查最新列表覆盖 10 月 30 日至 11 月 1 日，并回看到 26 日以前，与 10 月 31 日上次成功巡检衔接；这一步早于其他厂商及泛搜索。两个入口可读，当前列表没有比上次更新的公告；这只描述实际可见目录，不推论所有官方频道均无新消息。

| 站点 | 实际检查的近期候选 | 处理 |
| --- | --- | --- |
| Anthropic | 10-28 [AI for Science expands to foundations and research institutions](https://www.anthropic.com/news/ai-for-science-expands-foundations-research-institutions) | 目录说明仍为机构合作及支持，未核验新的独立研究成果，维持暂缓，不以支持计划充当研究结果。 |
| Anthropic | 10-27 [Early progress on accelerating drug development with Claude](https://www.anthropic.com/research/early-progress-drug-development) | 已收录，不重复。 |
| Anthropic | 10-27 [Expanding our partnership with GSA](https://www.anthropic.com/news/expanding-partnership-gsa)；10-26 [S-1](https://www.anthropic.com/news/s1-sec) | 前者目录明确以折扣为主，排除；后者已收录。更早 22 日及以前列表用于确认时间衔接，不算新发布。 |
| OpenAI | 10-30 [网站训练偏好信号](https://openai.com/index/helping-websites-express-ai-training-preferences/) 与[青少年保护和安全报告计划](https://openai.com/index/community-safety-report-and-new-protections-for-teens/) | 均已收录，维持原有未来实施边界，不重复。 |
| OpenAI | 10-30 [Fair use benefits everyone](https://openai.com/index/fair-use-benefits-everyone/) | 维持上次暂不收录：没有本轮核验的新裁决，不将单方观点写成法律结论。 |
| OpenAI | 10-29 [Model Spec](https://openai.com/index/updated-model-spec/) 与[分层监测](https://openai.com/index/how-we-detect-frontier-model-misalignment/) | 均已收录。 |
| OpenAI | 10-28 [ServiceNow 合作](https://openai.com/index/openai-servicenow-partnership-expansion/)与 [The future of the firm](https://openai.com/index/the-future-of-the-firm/)、27 日 [Oracle 合作](https://openai.com/index/oracle-apps-in-chatgpt/)、26 日[科研公告](https://openai.com/index/building-scientific-understanding-with-academic-communities/) | 列表与上次一致；计划和观点不被包装成新交付，科研公告已收录。 |

本轮没有新候选需要重开两站公告全文，既有文章结论不冒称本轮重新做过全文实验核验。扩展厂商逐项入口、日期、结果和访问缺口见[厂商巡检与 Mistral 复核](news-vendors-review-2026-11-01.md)。覆盖 Kimi、DeepSeek、Qwen、GLM、MiniMax、字节 Seed、Google DeepMind，并补收 Mistral 29 日实际权重交付，后者不是把 6 日托管预览重复发稿。

## 本批新增与分布

| ID | 原始发布日期 | 主题与机构 | 收录理由 |
| --- | --- | --- | --- |
| `northflank-ai-credentials-incident` | 2026-10-30 | 云服务、凭据安全；Northflank、Wiz | 官方已披露事件，并记录用户 AI 密钥不当使用报告和后续处置；不把广泛防护要求写成逐一确认的泄露规模。 |
| `reddit-logged-in-access-pilot` | 2026-10-29 | 平台访问与数据治理；Reddit | 登录访问试点将改变阅读入口，保留未来试点、范围未定和隐私承诺归因。属于近期漏项，不用 31 日媒体报道日期替代首次公布。 |
| `mistral-large4-open-weights-release` | 2026-10-29 | 大模型权重与许可；Mistral | 可下载改进权重与此前托管预览有实质区别，保留许可条件和厂商、独立测试的不同口径。 |

三条分别来自三家公司，无单一公司主导。还检查了 [GitHub 更新目录](https://github.blog/changelog/) 和 [NASA 最新列表](https://www.nasa.gov/news/recently-published/)。GitHub 最新 29 日 webhook 地址条目本轮只作目录筛选，未全文核验，不为数量收录零碎维护；28 日多项发布可在后续另做完整核验。[TRACERS 首批结果](https://science.nasa.gov/blogs/tracers/2026/10/29/nasas-tracers-first-results-offers-peek-into-violent-magnetic-process/) 本轮打开页面但未完成结果部分及独立资料核验，暂缓，不宣称已读完整研究。BleepingComputer 目录中的赞助浏览器指南、课程推广和优惠直接排除；其他安全候选不因数量配额强行发布。

## Northflank：事件响应与外部凭据

实际阅读 [Northflank 状态公告](https://status.northflank.com/) 全部事件更新。最早公开条目 10-30 13:40 UTC，含 11:43 告警、11:44 工程师确认、12:02 首次网络策略修补及后续修补时间。时间线是发现与响应，不作为首次入侵时间。13:58 与 15:12 的全量环境变量风险要求是响应范围；客户 AI 密钥使用报告出现在 15:12 和 23:38 更新。10-31 01:04 开放所有客户审计记录，13:34 开放 MySQL/Redis 轮换；PostgreSQL/MongoDB 是前一日更新。

原始公告尚未给出最初入侵方式、确定客户数量、其他凭据的已证实滥用范围。正文明确区分风险假设、用户报告与已确认调查结论；不将广泛轮换要求换算成受害人数。平台修补与签发方撤销旧凭据是不同层次的处置，属于依据公告进行的解释。

实际阅读 [Wiz 同期原始研究](https://www.wiz.io/blog/black-october-for-ai-developer-platforms) 的事件模式、两案例和归因限制。文章未把多个事件归为同一漏洞；具体案例账单和流量没有证据可直接归到 Northflank，因此未采用这些数字。正文也没有转写研究中的攻击基础设施地址、代码、调用序列或转售站点。实际阅读 [BleepingComputer 31 日独立报道](https://www.bleepingcomputer.com/news/security/northflank-security-breach-leads-to-abuse-of-customers-ai-api-keys/)，用于交叉确认事件新闻价值及尚未披露事项；全部事件时间以原始公告为准。

## Reddit：试点不是全球立即封闭

实际阅读 [Steve Huffman 的官方说明](https://www.reddit.com/user/spez/comments/1xiupm0/about_that_login_screen/) 全文和与隐私、外链、年龄核验有关的本人回复。公告说明登录体验的理由包括社区参与、个性化、广告、监管适应与数据访问管理；未来数月在非美国部分市场试点，首页和外链入口仍需权衡。没有国家清单或全面实施日。未将公司说法升级为“已阻止抓取”或“已做独立隐私审计”。

日期与商业背景由 10-29 的[官方季度公告](https://investor.redditinc.com/news-events/news-releases/news-details/2026/Reddit-Reports-Third-Quarter-2026-Results/default.aspx)及[Reuters 当日报道](https://www.investing.com/news/stock-market-news/reddit-puts-logged-in-experience-first-as-google-ai-hits-traffic-4985602)交叉核对。已读公司公告的日期、收入构成、电话会信息及官方披露渠道说明；已读 Reuters 正文，确认当日已公布计划。采用季度总收入 8.95 亿美元和广告收入 8.47 亿美元作为背景，不当作登录试点产生的效果。不采用股价变动、未经独立验证的因果结论或评论区用户的推测。

直接读取公告页面的精确时间属性未取得，页面相对时间不作精确日期依据；独立当日报道及同日公司公告完成日历日期交叉核实。隐私段落保留公司的真实姓名承诺、应用只读隐身模式与退出个性化，并根据本人回复区分既有第三方年龄核验，避免绝对化。正文仅为相关服务变化报道，不包含注册或购买引导，不转写评论区不相关及不合格内容。

## 五篇历史正文与配图

新增历史正文 ID：`ollama-0406-gguf-windows-fixes`、`mozilla-devtools-mcp-0106-pdf-tabs`、`anthropic-nist-curve-seed-research`、`windows-11-28120-3272-accessibility-fixes`、`debian-linux-dsa-6568-security-update`。均是按日期优先的下一批缺失项。保持 ID、published_at、已有 collected_at 不变；仅正文 written_at 为本次真实日期，不计入新增新闻。

原始全文、相关变更、独立复现与版本边界见[软件历史复核](news-history-review-2026-11-01-a.md)和[密码学及内核复核](news-history-review-2026-11-01-b.md)。Ollama 短摘要同步收窄为 Windows 独立服务强制结束场景，不声称正常桌面关闭也有此问题。

本轮新增及替换共 7 张本站原创解释图：`northflank-ai-credentials-incident.svg`、`reddit-logged-in-access-pilot.svg`、`mistral-large4-weight-delivery.svg`、`ollama-0406-compatibility.svg`、`firefox-mcp-0106-controls.svg`、`windows-experimental-28120.svg`、`anthropic-curve-seed-origins.svg`，位于 images/news。均已渲染并实际查看，文字清楚、无裁切；用机制和时间关系帮助理解，不冒充原站截图、研究实测或性能图。四张历史封面原图可访问但转载许可未明确，改用上述原创解释图。Debian 开放徽标保留并补齐 CC BY-SA 3.0 署名，核验见专项记录。无新增外部照片或未经授权图表。五语言正文各自另有对应语言图示与参考来源。

## 内容与公开信息复核

本批三条新闻和五篇历史解读的标题、摘要、全文、图注、参考链接及公开记录均复核：排除广告、软文、优惠返利、导购、品牌活动，以及色情、赌博、毒品性质和相关推广引流。仅使用相关可核验公开事实，不含本机身份、设备名、私密资料、绝对路径、内部地址、凭据、代码片段、命令或运行记录。厂商自报与独立结果区分，预告和已交付区分，安全事件不展开攻击操作。正文使用原创叙述，不全文翻译或照搬来源段落。
