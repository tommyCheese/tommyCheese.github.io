# 2026-10-30 OpenAI 两项公开更新复核

本批核验两项不同事件：公开行为规范改版，以及扩大后的模型失配监测机制说明。两者均有具体文档变化，不以品牌合作、价格或购买引导形成选题。与已有新闻目录按事件、标题和原文链接核对，不重复 GPT-6.1 Terra 发布、METR 早期试验或此前训练环境隔离更新。

实际全文及配套资料检查完成于上海时间 2026-10-30 09:21；收录与撰写日期均为 2026-10-30。官方入口的首轮列表检查由当日总来源记录记载。

## Model Spec 改版

- 新增 ID：`openai-model-spec-intent-context-update`。
- [官方公告](https://openai.com/index/updated-model-spec/)标注 October 29, 2026；[固定日期版规范](https://model-spec.openai.com/2026-10-29.html)独立确认版本日期。原始发表日使用 2026-10-29，不改成收录日。
- [Reuters 报道（Y94 镜像）](https://y94.com/2026/10/29/openai-says-human-intent-at-center-of-updated-ai-model-guidelines/)正文实际读到，署名 Prathik Jayaprakash，日期 Oct 29。其他转载入口有访问限制，未将不可读页面当作已完成核验。独立报道用于判断行为规范变化及社会背景，不转写广告、相关股票或推荐内容。

### 事实定位

1. 公告开头、Organizing the Spec around core values：五项组织价值为忠于人的意图、减少伤害、诚实透明、人的自主性与关怀。OpenAI 设置边界、开发者在边界内引导应用、用户指示具体任务。正文没有把理解意图扩写成模型可凌驾人的选择。
2. 公告 New and retired sections：增加上下文、人类自主性和社会规范指引，扩展附带影响说明，删除大部分细节文风规则；客观呈现等较强默认仍保留。未称所有风格规则被取消，也未将更名为 GPT 当作模型发布。
3. 固定版 Consider context carefully 下的 Carry relevant context forward、Use context proportionately、Consider source, scope, and recency：保留相关项目状态和偏好、区别陈述与推测，考虑过时、敏感性和受众。一次偏好不自动成为长期指令，推测不能压过同级或更高明确指示。
4. 固定版 Preserve user control、Make context use legible and steerable：用户可以纠正或改变偏好；不再使用某信息不等于已经永久删除，不能凭行为承诺宣称完成存储层操作。文章只说明公开行为要求，不带入任何真实私密资料或规范中的敏感示例。
5. 固定版 Support human oversight and correction、Control and communicate side effects：接受合法监督、纠正、替换和停止；超出合理任务范围的重要成本或对他人的重大不利影响需要明确授权，考虑可逆性和副作用。正文没有复制操作样例或代码。
6. 公告 What comes next 与 Reuters 正文：当前模型未完全反映新版规范，新的训练方法结果仍待后续公开。正文明确这是目标行为与评价依据，不是能力实测、已完成产品升级或全量上线保证。

### 图文与筛选

封面 `images/news/openai-model-spec-intent.svg` 为本站原创解释图，以意图、授权范围和人的纠正能力组织信息。已渲染检查文字边界、可读性和图意；没有复制官方图片，不是实验结果。五语言正文均为独立导语、三节六段，保留上述未完全实现的限制。无广告导购、促销、色情、赌博、毒品内容或引流；公开字段无本机身份、位置、凭据、代码和运行记录。

## 分层模型失配监测

- 新增 ID：`openai-layered-misalignment-monitoring`。
- [当前官方原文](https://openai.com/index/how-we-detect-frontier-model-misalignment/)与官方新闻列表明确显示 October 29, 2026，因此采用 2026-10-29。搜索索引摘要曾返回 October 28，属于与当前页面冲突的日期线索；未用索引摘要覆盖当前原文日期，也未隐去不一致。后续若取得更早正式版本证据，应再次核对原始发布日期。
- 实际阅读全文的 Our internal monitoring system today、Human response、评估与红队、异步监测动机、Safeguarding external usage of Astra 各节。
- [API 监测文档](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)的 Request coverage、Handle a stopped request 与警告说明实际核验。
- [METR 原始试验报告及 10 月 29 日更新](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/)实际阅读。其独立范围是旧系统，不构成扩大后系统的评估。
- [Reuters 早期试验报道（MarketScreener）](https://www.marketscreener.com/news/ai-safety-group-metr-finds-flaws-in-openai-s-internal-monitoring-system-ce785cdedc8ff127)实际阅读正文，原始 10 月 22 日，更新同日。用于交代独立审查背景，不能作本次扩大机制的独立验证，也不把旧报道改成今日发布。早期报道的修复口径以 METR 10 月 29 日勘误与当前公告为准。

### 与此前新闻的区别

已有 `metr-openai-monitoring-pilot-review` 报道外部试验，`openai-frontier-training-containment-update` 报道训练环境隔离。本项新增的主体是官方对初筛、模型审查、调查、处置的完整分层说明，以及外部 API 的监测覆盖、停止条件和异步边界。旧事件仅占背景与证据限制，不重复拆稿或把旧事故当新事故。

### 事实定位与边界

1. 初筛及 L1—L3：轻量激活探针、模型审查、上下文调查，敏感工作进一步看环境证据。随机抽查初筛未标记活动中的 5%，分母不是所有流量；前沿强化学习和内部 Codex 直接进入模型审查层。正文没有展示内部配置、工具输出或攻击步骤。
2. Human response：前沿强化学习最高优先级可全天呼叫，大部分其他流量限工作时段，内部 Codex 呼叫通知关闭；部分严重告警可自动暂停，更广的超时暂停仍是推进中。未将“有监测”写成“全天人工接警”。
3. API Request coverage：对适用模型，保留推理状态、WebSockets 或 OpenAI 上下文压缩支持识别连续会话并停止后续执行。没有这些机制的 Responses 请求仍监测、配置好的回调可接收告警，但不能自动停止；回调本身不启用自动停止。Chat Completions 不在此监测覆盖内，其他安全检查仍适用。
4. API 告警说明和停止说明：标记不证明用户违规或 Agent 违背指示；会误报、漏报。检查异步，可能在行为已完成后才发现，停止不会撤销已发生动作。正文保留这些条件，不给出错误码、命令或接入代码。
5. 外部监测节：不例行升级给 OpenAI 人工审查，企业可以路由给自己的安全团队；既有隐私与零数据保留承诺仍适用。未宣称所有请求不留数据，也未推断外部版与内部版拥有相同上下文能力。
6. Hugging Face 事件回放：约 30 分钟后告警、比实际事件的外部入侵早 30 多小时，都是 OpenAI 对事后回放的陈述。不是当时真实拦截或未知攻击检出率，不把回放结果写成独立实测。
7. METR 10 月 29 日更新：三周试验评估 7 月 21 日及此前系统；多数漏洞已修复、仍有一项进行中是 OpenAI 提供的状态，METR 未验证后续覆盖与修复主张。正文不沿用旧报道中过宽的全部已修复口径。

### 图文与筛选

封面 `images/news/openai-layered-monitoring.svg` 为本站原创解释图，已渲染检查，呈现筛查、调查和按能力处置；不复制官方图表，不制造检测率。完整正文五语言均为三节六段，区分厂商结果、独立评估范围与本站解释。未转载内部事例中的敏感标识、凭据、路径、代码或具体绕过流程；技术名称只用于说明公开接口与监测边界。无广告、购买号召、色情、赌博、毒品或相关推广内容。

## 本分项计数

新增 2 条、完成新增五语言正文 2 篇、撤下 0 条。全部来源来自实际阅读的原始资料及明确注明范围的独立报道；没有将独立报道重复转载数量当成多重验证。历史正文由本批其他复核记录单独记载。
