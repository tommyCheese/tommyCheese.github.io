# 2026-11-02 新闻来源与复核

本次按实际上海日期 2026-11-02 收录和撰写，保留各原文真实发布日期。执行时间为下午，来源记录使用实际检查时间，不把定时触发时刻当作访问时刻。先检查既有新闻和近期复核，再进行官方入口巡检。研究内容及每日规则保持不变。

## 两家官方入口优先巡检

实际上海时间约 14:13—14:14，先直接访问 [Anthropic 新闻目录](https://www.anthropic.com/news) 和 [OpenAI 新闻目录](https://openai.com/news/)，早于其他厂商及泛搜索。目标覆盖 10 月 31 日至 11 月 2 日，回看至 26 日及更早，与上次成功巡检衔接。Anthropic 的页首当天日期不是最新文章日期；All news 最新仍是 28 日，OpenAI 可读列表最新仍是 30 日。未把目录无新增外推为所有官方频道没有消息，随后通过外部报道补查了产品帮助及模型发布记录。

| 站点 | 候选标题、日期及链接 | 处理 |
| --- | --- | --- |
| Anthropic | 10-28 [AI for Science expands to foundations and research institutions](https://www.anthropic.com/news/ai-for-science-expands-foundations-research-institutions) | 目录仍为机构支持计划；没有核验到新的独立成果，维持暂缓。 |
| Anthropic | 10-27 [Early progress on accelerating drug development with Claude](https://www.anthropic.com/research/early-progress-drug-development) | 已收录，不重复。 |
| Anthropic | 10-27 [GSA 合作](https://www.anthropic.com/news/expanding-partnership-gsa)、10-26 [S-1](https://www.anthropic.com/news/s1-sec) | 前者以折扣为主，维持排除；后者已收录。22 日及更早列表用于衔接，不当作近期新增。 |
| OpenAI | 10-30 [训练偏好信号](https://openai.com/index/helping-websites-express-ai-training-preferences/)与[青少年保护及安全报告计划](https://openai.com/index/community-safety-report-and-new-protections-for-teens/) | 均已收录，保留未全面实施的原口径，不重复。 |
| OpenAI | 10-30 [Fair use benefits everyone](https://openai.com/index/fair-use-benefits-everyone/) | 本轮没有核验到新裁决，不能把既有单方观点当法律结果，维持不收录。 |
| OpenAI | 10-29 [Model Spec](https://openai.com/index/updated-model-spec/)与[模型监测](https://openai.com/index/how-we-detect-frontier-model-misalignment/) | 已收录，不重复。 |
| OpenAI | 10-28 [ServiceNow 合作](https://openai.com/index/openai-servicenow-partnership-expansion/)及 [The future of the firm](https://openai.com/index/the-future-of-the-firm/)、10-27 [Oracle 合作](https://openai.com/index/oracle-apps-in-chatgpt/)、10-26 [科研公告](https://openai.com/index/building-scientific-understanding-with-academic-communities/) | 列表与上次一致，计划及观点不改写成新交付，科研公告已收录。 |

以上是本次目录核对，不冒称把没有变化的旧公告全部重新阅读全文。后续新候选的实际全文核验见本记录及[厂商专项记录](news-vendors-review-2026-11-02.md)，覆盖规定的国内外模型厂商，并保留访问缺口及暂缓理由。

## Alpine：重建后的平台恢复

新增 ID `alpine-gitlab-rebuild-account-recovery`，以[10 月 30 日原始恢复公告](https://alpinelinux.org/posts/GitLab-reopened-after-security-incident.html)为主要来源，因此 published_at 为 2026-10-30；收录与正文日期为 2026-11-02。该事件在本站尚无条目，不是重复旧 CVE 或把 11 月 1 日媒体日期当作首次披露。收录理由是开发基础设施实际重建、依赖修补和账户恢复的具体变化。

实际阅读以下原始材料和交叉报道：

1. [恢复公告](https://alpinelinux.org/posts/GitLab-reopened-after-security-incident.html)全文：新实例运行 GitLab 19.3.7 和 Ruby 3.3.13；项目、议题、合并请求保留。密码、双因素认证、恢复码、个人访问令牌及流水线秘密有不同的重置状态；流水线变量名称设置保留但值清空，一些集成需重新授权。只作非操作性说明，不转写连接指令、主机指纹、密钥或账户资料。
2. [10 月 28 日事故复盘及后续更新](https://alpinelinux.org/posts/GitLab-security-incident-CVE-2026-97229.html)全文：20—21 日的尝试造成8次工作进程崩溃，4次到达中间阶段，未观察到完成；不能将崩溃视为入侵成功。升级应用未修复自行打包的 Ruby 依赖；记录缺口使团队无法排除代码执行，故按可能受侵害重建。未发现的证据与不能排除的风险均保留。
3. 复盘 FAQ 的核验边界：24日检查覆盖20—22日 aports 提交、截至24日软件包及21日稳定版，借助开发者副本与45台构建机记录；原文说扩展至27日，不能称截至27日全部验证完成。签名密钥从未保存在 GitLab，未把潜在账户数据风险误写为发行签名泄露。
4. [GitLab 10 月 12 日修复公告](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/)的发布说明和 CVE-2026-97229 段：官方软件包版本与受影响范围、Ruby 正则表达式依赖关联；其他漏洞章节未被拼入本稿。NVD 页面本次未得到可读正文，不能记作已核验该页详情。
5. [Ruby 3.3.13 原始公告](https://www.ruby-lang.org/en/news/2026/10/23/ruby-3-3-13-released/)：10-23，明确包含相关正则表达式修复。不照抄下载摘要或终端操作。
6. [BleepingComputer 11 月 1 日报道](https://www.bleepingcomputer.com/news/security/alpine-linux-rebuilds-gitlab-after-attempted-rce-attack/)全文：确认事件外部新闻价值，但其截至27日未篡改的概括比原始核验范围更宽，正文以项目 FAQ 的明确范围为准。

图 `images/news/alpine-gitlab-recovery.svg` 为本站原创解释图，区分补丁、重建及外部核验；各语言另有对应图示。没有复用新闻站照片或攻击示意图，不披露攻击流程、真实秘密或本站内部资料。文章讲清供应链风险及依赖管理教训，属于安全新闻，不是产品广告。

## 扩展选题与排除

实际检查 [BleepingComputer 最新目录](https://www.bleepingcomputer.com/)与 [NASA 最新目录](https://www.nasa.gov/news/recently-published/)。前者引出 Alpine 与 OpenAI 产品变化候选；Northflank 和 Reddit 已收录，不能按新媒体转载日期再发。赞助 OAuth/MCP 指南、广告拦截优惠、课程和语言学习推广直接排除。其他安全候选未为数量配额强行纳入。NASA 可读列表仍以30日及更早内容为主，本轮没有把相对日期或媒体活动当新增研究结果。

## 历史复核

本轮按日期倒序继续复核缺正文项。三篇软件、模型和半导体历史见[专项 A](news-history-review-2026-11-02-a.md)；NASA、汽车、三星活动及替补 Google 研究复核见[专项 B](news-history-review-2026-11-02-b.md)。历史正文保持原 ID、发表与已有收录日期，只记录真实补写日，不计入新增新闻。

公开字段只包含相关可核验信息。五语言标题、摘要、正文、图注、来源链接和公开记录排除广告导购、返利促销、色情赌博毒品性质及相关引流；不得混入本机身份、设备资料、私密账户、路径、内网地址、秘密、内部代码、命令或运行记录。厂商自报、独立结果、本站解释及未来计划分别标明。

## Rosalind：新的受控交付，而非旧科研成果重复发布

新增 ID `openai-gpt6-rosalind-research-controlled-rollout`，原始发表日期 2026-10-30，收录与撰写 2026-11-02。实际阅读 [10月30日模型发布记录](https://help.openai.com/en/articles/9624314-model-release-notes)、[生命科学准入说明](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research)的产品、准入、API与数据部分、[同日安全补充文件](https://deploymentsafety.openai.com/gpt-rosalind-6)的方法和控制相关全文，并对照 [The File 11月1日报道](https://thefile.news/story/openai-gpt-rosalind-6-addendum-oct30)。与此前科学成果汇总不同，本次是新版本向有限研究机构交付及其约束。

事实定位：发布记录10月30日条目及帮助页 GPT-6 Rosalind Research 段明确 Work、Codex、另行批准 API，非 Chat；Discovery 仍为5.5，旧5.5 Research仍可选择；Enterprise 两周 Admin Preview 默认关闭，已有批准不豁免。安全文件第1—2节明确与GPT-6 Astra相同权重，无新增训练数据或本次额外后训练，未宣称重新训练专用模型。第4.2节说明机构准入、授权范围、合格人员复核、监测及单独的数据保留安排；帮助页API部分限定获批内部研究。风险等级只按公司自身框架归因，不称独立安全认证或现实危害概率。没有引用生物实验操作、危险能力细节或攻击做法。

补充文件中不同评估设置、样本覆盖及版本的限制保留为解释边界，未拼接分数形成性能宣传，也未将用途列表当独立效率测量。独立报道用于判断新交付的新闻价值，关键事实回到原始说明；未把媒体没有读取的母模型文件冒充本稿核验来源。没有明确获批总数，不编造。图 `images/news/rosalind-research-access.svg` 为本站原创解释图，展示机构批准、管理员启用与人工复核；不是产品画面或科研实验结果。

10月29日普通Chat回答风格调整也出现在模型记录，但作用于Free、Go、未登录及Plus/Pro限额后的回退，不影响其主模型。此次不为厂商数量扩充零碎稿件，未误写为所有GPT-6模型换代。

## 本批内容清单

新增3条，全部具备五语言完整正文：`alpine-gitlab-rebuild-account-recovery`、`openai-chat-work-shared-allowance-plan`、`openai-gpt6-rosalind-research-controlled-rollout`。公司与主题分布为 Alpine/Linux 基础设施安全1条，OpenAI产品入口及额度计划1条、受控科研交付1条；两条OpenAI为独立事件，未按厂商配额凑稿。固定巡检其他厂商及跨领域检索的取舍见上文与专项记录。

额外补齐5条历史正文：`chrome-155-prerender-security-update`、`prismml-ternary-bonsai2-small-models`、`tsmc-2026-third-quarter-results`、`nasa-artemis-ii-heat-shield-assessment`、`google-deep-review-public-release`。涉及Chrome安全、PrismML压缩模型、台积电经营与算力需求、NASA再入材料以及Google文档核查，全部保留原日期。

撤下1条：`samsung-future-wireless-summit-2026`，原文以品牌活动为主，缺少本次可核验的独立技术增量。吉利销量条目保留待核验原始统计口径与图片条件的原因，不虚构补写。完成后新闻共80条，68条有完整正文，尚有12条历史正文待补齐。历史补写和撤下均不计作新增新闻。

内容复核完成：三篇新增及五篇补写的五语言事实、来源归因、限制和解释图逐项检查；七张新增或替换的原创封面均已渲染查看，NASA 既有图片已复核来源与使用条件。新闻、研究、五语言、正文完整性、阅读、标签、日期筛选、搜索和预览交互检查均通过，公开内容隐私检查通过。研究数据、合格历史原日期与原有完整正文保持不变。
