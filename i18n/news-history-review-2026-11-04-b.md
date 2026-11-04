# 2026-11-04 历史新闻正文复核：半导体、对话界面与智能家居

复核日期：2026-11-04（上海时间；本记录核对截至 09:37）。本批补齐 3 条既有新闻的五语言完整正文，不计入新增新闻；撤下 0 条。保留原 ID 和原始发布日期，正文补写日期均为 2026-11-04。

## tsmc-september-revenue

- 原始发布日期：2026-10-08；核对依据为 [TSMC 月度营收公告](https://pr.tsmc.com/english/news/3343) 的日期及完整正文。
- 实际阅读：公告的合并营收段落；[Anadolu 同日独立报道](https://m.aa.com.tr/en/science-technology/tsmc-september-revenue-jumps-546-as-ai-chip-demand-fuels-growth/4081753) 的营收、产业背景和季度业绩安排部分。
- 核实数据：9 月约新台币 5,118.6 亿元，同比增 54.6%、环比减 0.6%；1—9 月约新台币 3 兆 8,987.3 亿元，同比增 41.1%。同比、环比与累计比较的分母分别保留，未换算为美元，也没有把营收称为利润。
- 新闻价值：有明确报告期和可核验金额的经营披露，可观察芯片制造业收入规模；并非品牌活动或导购。Anadolu 提及 AI 基础设施需求和 Nvidia、Apple 等客户，正文仅将其用作产业背景，不把所有收入增长归因于 AI。
- 事实边界：月报未披露客户、制程、应用收入拆分或利润情况；不据此推算订单和盈利。10 月 8 日时，完整第三季度业绩安排在 10 月 15 日发布，正文明确这一时间口径。
- 原图复核：[原配图](https://pr.tsmc.com/sites/pr/multimedia-gallery/A_6747481_0.jpg) 本次访问被拒绝；公告页注明版权保留，未取得可确认本站复用的许可证据，因此不沿用。
- 替换图：`images/news/tsmc-september-revenue-comparisons.svg` 为本站原创解释图，使用已核实金额和比较口径；没有复制厂房照片或官方图表设计。图中三组百分比是不同时间基准，不画成相同时间轴。已检查图像可读性。

## openai-gpt6-intelligent-ui

- 原始发布日期：2026-10-07；核对 [OpenAI 完整公告](https://openai.com/index/gpt-6-for-everyone/) 和 [ChatGPT 官方发布记录](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) 的 10 月 7 日条目。
- 实际阅读定位：公告的 Introducing Intelligent UI、How Intelligent UI works、Frontier Intelligence、Availability；官方记录中的模型、推理模式和入口限制。另阅读 [TechRadar 10 月 8 日体验文章](https://www.techradar.com/ai-platforms-assistants/chatgpt/chatgpt-just-changed-how-it-works-with-intelligent-ui-here-are-5-things-you-can-do-now-that-you-couldnt-before) 的实际例子和结尾限制，不采用其中的促销、购物推荐或购买引导。
- 实质增量：Chat 的回答可组合原生交互组件，界面随生成逐步出现；模型可在继续思考时开始回答。这是已经宣布开始分批提供的交互能力变化，不只是品牌介绍。
- 上线口径：10 月 7 日开始 Plus、Pro、Business、Enterprise，10 月 8 日开始扩展 Free、Go；前者 Chat 使用 Sol，后者使用 Luna，企业还依赖管理员设置。保留“分批”含义，不宣称每个账号同一时刻开放。
- 关键限制：Intelligent UI 从 Instant 到 Extra High；Pro 推理选项仍用 Astra、不支持该界面，不能与 Pro 订阅混为一谈。Work、Codex 模型不因该发布而改变。正文不将这条新闻扩写为 API 发布。
- 性能归因：44% 指厂商报告的网页搜索问题平均开始回答时间改善；不是全部完成时间、不是本站独立测量。TechRadar 的观察仅支持界面有时需额外请求、内容仍须核对，不当作系统性正确率测试。
- 原图复核：原 OpenAI 宣传图可访问，目视确认是交互界面与产品标题展示；未取得可确认本站复用的许可证据，不沿用。改用 `images/news/gpt6-progressive-interface.svg`，仅以本站自行绘制的流程解释问题、组件和渐进显示，另注明模式边界；没有复制截图、图标或产品界面。已检查可读性。

## samsung-smartthings-now

- 原始发布日期：2026-10-06；核对 [Samsung 完整平台更新公告](https://news.samsung.com/global/samsung-introduces-smartthings-now-in-new-platform-update-that-brings-more-intuitive-user-experiences) 的 Korea on October 6, 2026。
- 实际阅读定位：Home Tab、Local Control、Matter 1.6 段落和全部四项脚注；另阅读 [Android Authority 同日报道](https://www.androidauthority.com/samsung-smartthings-now-brief-update-3719415/) 的完整主体。独立报道具有联盟链接的通用披露，正文没有引用其导购入口。
- 保留理由：不仅是 Home 改版，公告还改变手机到兼容中枢的控制路径，并新增 Matter 版本支持，有可描述的功能增量；不采用注册用户规模、品牌赞词、家电推荐或购买话术。
- 行为边界：接近家庭位置后给出建议，用户操作后再提示创建例程；未写成无确认自动执行所有建议。Routine Insight 查看过去一周活动和删除例程，不能推断系统能理解家中所有事件。
- 技术核验：同一 Wi-Fi 中手机可直接与兼容中枢通信；在家与外出采用本地或云端远程控制。外网中断不等于家中 Wi-Fi、中枢、设备失效，本地控制仍须后者正常。
- 性能归因：约 30% 为三星受控环境测试，保留环境差异限制，未写成独立测试或所有设备承诺。兼容中枢条件依官方脚注，未扩大为所有手机与所有旧设备均可使用。
- Matter 口径：按公告写明 1.6、群组控制、稳定性和电能表、开合机构、灌溉、土壤传感器类别；没有因独立报道概括“安全增强”而添加官方该公告未具体说明的安全保证。
- 原图复核：三星原宣传图可访问，目视确认含手机、卡片和品牌设备展示。公告页注明版权保留，未取得可确认本站复用的许可证据，不沿用。采用 `images/news/smartthings-local-control-route.svg` 原创解释图，说明手机—兼容中枢—设备的本地路径及前提；没有复制产品截图或模拟实验结果。已检查可读性。

## 五语言、内容与公开信息复核

三篇均具备简体中文、英语、日语、俄语和繁体中文正文，每种语言有导语、三节六段、解释图说明和四个流程或口径节点。核对了金额单位、比较期间、上线日期、模型与模式、约 30% 和 44% 的厂商归因，以及网络与设备条件；不同语言的主要事实和限制一致。

所有外链均为公开的具体公告、发布记录或新闻报道。正文采用原创叙述；没有原文长段转载、采访或独立测试的虚构陈述。广告、促销返利、购买引导以及色情、赌博、毒品性质与引流内容未纳入。公开正文、图注、图示和本记录未含私密身份、设备信息、内部地址、凭据或操作过程。原创配图只说明公开事实和机制，不冒充产品截图或实验图。
