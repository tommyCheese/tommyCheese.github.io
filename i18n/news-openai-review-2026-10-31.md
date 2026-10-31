# 2026-10-31 OpenAI 新闻正文复核

本批复核截至上海时间 2026-10-31 09:30。官方新闻入口巡检见当日主来源记录；本记录补充两条 10 月 30 日公告的原文定位与完整正文核验。两条均保留真实发表日期 2026-10-30，收录及正文日期为 2026-10-31。

## 新增及正文

- `openai-shared-training-preference-signal-plan`：新增新闻和五语言完整正文。主题为网站内容用途偏好、AI 数据来源治理及标准讨论。
- `openai-teen-safeguards-safety-report-plan`：新增新闻和五语言完整正文。主题为未成年人保护、风险干预及安全透明度。
- 本子批共新增 2 条、完成新增正文 2 篇、历史补写 0 篇、撤下 0 条。主批另行汇总其他机构及历史正文工作，不能把本子批视为全站公司分布。
- 与现有 Model Spec、分层监测、METR 试点、训练隔离条目核对，分别属于新的内容用途承诺与用户保护计划，不复用旧事件凑数。没有将相同文章的不同链接重复计数。

## 训练用途共同信号：原始证据

1. [OpenAI：Making it easier for websites to express AI training preferences](https://openai.com/index/helping-websites-express-ai-training-preferences/)。实际阅读全文，页首日期 October 30, 2026。第 1—2 段说明共同信号及减少逐服务商维护规则的目的；第 3 段明确目标为未来数月实施、详情将另行公布、现有爬虫控制继续有效；后续段落说明这是自愿协作并与 IETF 持续讨论相关。正文不写已上线，不扩张为所有提供商承诺。
2. [Machine-Readable Training Preference Signal，第 00 版](https://www.ietf.org/archive/id/draft-kelley-aipref-training-preference-signal-00.html)。实际阅读正文。页首日期 30 October 2026，作者 Kevin Kelley 的所属机构为 Anthropic；这是个别 Internet-Draft，而非通过的 RFC。状态段明确其为可更新或替换的工作文件。第 1、4.1、4.2 节说明复用既有规则结构及按网站路径表达偏好；第 3 节界定训练为修改生成式模型学习参数，并区分只做非生成任务的模型；第 4.2 节区分缺少用途声明与已表达偏好；第 4.3—4.4 节说明内容用途与访问控制独立，信号本身不是抓取指令；第 4.5 节允许更具体声明及协议影响优先关系。面向读者只解释含义，不复制配置片段。
3. [AI usage preference vocabulary，第 08 版](https://www.ietf.org/archive/id/draft-ietf-aipref-vocab-08.html)。阅读定义与理解偏好、具体指示相关章节。文件仍在讨论，部分内容不代表工作组共识；这支持正文保留术语与标准状态的边界，而不是作出内容授权的法律结论。
4. [OpenAI：爬虫文档](https://developers.openai.com/api/docs/bots)。阅读 GPTBot、OAI-SearchBot 与独立控制说明。训练相关爬虫与搜索爬虫用途不同，网站可以分别设置。没有把用户主动访问、搜索收录或历史训练数据处理一概等同于新计划。

独立报道交叉核实：[Okay News 10 月 30 日报道](https://www.okaynews.com/openai-shared-ai-training-signal-websites-october-2026/)及[CGH 10 月 30 日报道](https://crawfordgroupholdings.com/news/industry/openai-shared-robots-ai-training-preference-signal/)。已阅读搜索索引呈现的完整报道文本，两篇的直接页面访问均未成功，不能记为直接页面全文访问成功。报道一致强调未来实施、草案状态及训练与访问的区别；CGH 明确其基于公司公告且没有实施测试。仅用于判断事件受到外部报道及发布者面临的配置负担，全部技术事实仍以实际阅读的官方原文为依据。没有采用其他报道未经核实的参与厂商名单、时间表或抓取测试数字。

筛选结论：收录的是新的可核验治理承诺及公开技术草案，不是付费产品、导购或品牌活动；避免把自愿信号称为不可绕过的访问屏障、行业一致标准或法律授权。意义与待观察事项明确为本站解释。

## 社区安全与青少年保护：原始证据

1. [OpenAI：Community safety report and new protections for teens](https://openai.com/index/community-safety-report-and-new-protections-for-teens/)。实际阅读全文，页首日期 October 30, 2026。
   - 开篇称 2026 年第三季度转交执法部门超过 200 次；保持“OpenAI 称”，不写成已证实犯罪、拘捕或成功阻止事件数量，不计算缺少分母的有效率。
   - “OpenAI’s Community Safety Report”明确首份报告在 2027 年初，覆盖 2026 年下半年，此后半年一次；计划披露匿名案例、政策、缓解措施及发现、调查、响应方式。尚未发布。
   - “Stronger policy boundaries for all users”说明所有年龄的历史大规模暴力事件回答限制；“Responding to warning signs”说明近期对话、较保守回答、开发中的会话结束与重复触发后的可能临时暂停。没有复述危险行为细节。
   - “More protections for teens”说明进一步限制未成年人得到的武器及安保系统实用信息、持续年龄判断、Persona 纠正，以及家长现有设置与七月已扩展的停用通知。临时暂停的家长通知仍在开发。
   - “Looking ahead”明确未来几周开始推出，不声称全部措施已面向所有用户生效。
2. [OpenAI：Our approach to age prediction](https://openai.com/index/our-approach-to-age-prediction/)。阅读账户与行为信号、可能误判及确认成人年龄的说明。年龄判断是估计，不等同于身份核验。正文不宣称准确率或完美保护，不展开个人资料提交操作。公告关于年龄预测起始年份的措辞与链接页日期不完全一致，本稿不使用该起始年份。
3. [Reuters 10 月 30 日报道，Investing.com 转载](https://www.investing.com/news/stock-market-news/openai-to-limit-weapons-information-for-teens-on-chatgpt-in-violenceprevention-push-4988471)。实际打开并阅读完整报道，交叉核实未来几周推出、未成年人限制、临时暂停与透明度报告。它是独立新闻报道，不是对新功能效果的独立实验；不引入其中另需复核的第三方测试争议或无关使用量数字。

筛选结论：这是公共安全政策及产品行为的实质变化，保留未来状态与效果待验证的限制。文章只作非操作性的防护解释，不包含攻击手段、危险细节、情色、赌博、毒品或相关推广引流，也不引导购买。

## 五语言及图示

两篇均有简体中文、英文、日文、俄文、繁体中文的完整正文，每语言包括导语、三节六段和解释图步骤。逐项对照日期、未来实施状态、报告周期、转交数字及证据归因。繁体中文完成术语人工复核。标题和短摘要不代替正文；正文无需跳转即可理解事件、背景、机制与边界。

- `images/news/openai-training-preferences.svg`：本站原创解释图，表示共同训练偏好、参与方及独立的爬虫控制；图中文字说明未来实施和非正式标准。依据前述公告及草案，不复制第三方图表，不表达已经部署或合规测试。
- `images/news/openai-teen-safety-plan.svg`：本站原创解释图，表示判断、限制与未来报告；标明未来几周及 2027 年初，并提醒转交次数不是已阻止事件的指标。不使用危险图像或案例截图。
- 两图均不采用第三方照片、商标图或受限论文图，无外部素材授权依赖。已渲染检查，文字完整、没有裁切或重叠；实际图文件可读，生产链接待主批发布后生效。卡片和正文均明确图示性质。

公开字段人工复核覆盖两篇五语言标题、摘要、全文、图注、参考链接、两张图及本记录：只使用相关公开事实，没有本机身份、设备、绝对路径、私密地址、凭据、内部代码或运行过程。额外扫描亦通过；全站构建、测试与推送由主批统一执行，本记录不冒称已完成发布。
