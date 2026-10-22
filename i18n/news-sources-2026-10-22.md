# 2026-10-22 新闻更新与补录核验

按上海日期 **2026-10-22** 整理，新增 **4 条**。发布前远端另有5条新增，本轮以远端37条为基线，37→**41 条**；已有对象保持原样。此次核实的新增原文为21日3条、20日1条，`collected_at` 均为22日。**最新原文日期仍为21日，没有伪造22日首发或生成空日期分组。** 本轮已查22日中文科技消息，若只是更早公告转载或缺乏独立增量，不以转载日期凑“当天新闻”。

## PHP 紧急安全修复

- ID：`php2shell-emergency-security-fixes`；`software`；原文21日。
- 已读 [PHP 官方21日安全公告](https://www.php.net/archive/2026.php#2026-10-21-5)，核对实际锚点指向安全公告，并交叉阅读 [BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/)。命令行读取媒体页403，网页工具可读，不写成原文失效。
- 摘要保留四个修复版本、两项CVE及Web部署范围；不将临时措施写成完整防护，不复制攻击步骤。
- [配图](https://www.bleepstatic.com/content/hl-images/2026/10/21/PHP.jpg)：GET 200，image/jpeg，276482字节，1600×900。已实际查看，为PHP标志和网络节点概念插图，署名 BleepingComputer · PHP illustration，不冒充攻击现场。

## Node.js 十月安全更新

- ID：`nodejs-october-security-patches`；`software`；原文21日。
- 卡片链接 [Node.js 22.23.4 实际发布记录](https://nodejs.org/en/blog/release/v22.23.4/)，可见正文明确 `2026-10-21`，避免将14日最早预告页的创建日误作补丁发布日期。已另读 [更新完成后的官方安全说明](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)，确认22.23.4、24.22.1、26.12.1已可用。
- 摘要只概括DNS、TLS、Brotli修复；保留不同分支影响不同，官方最高级别为 **High**，不用中文转载标题的“最高严重级别”暗示 Critical。
- [官方安全公告配图](https://nodejs.org/en/next-data/og/vulnerability/Node.js%20%E2%80%94%20Wednesday,%20October%2021,%202026%20Security%20Releases)：GET 200，image/png，188086字节，1200×600。已实际查看，为Node.js标志和21日安全发布文字，注明 Node.js Project · security release graphic。

## Onamae Desktop Cloud 入侵后停服

- ID：`onamae-desktop-cloud-security-shutdown`；`software`；采用 [BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/security/japans-onamae-desktop-cloud-hacked-up-to-27-000-servers-affected/)原始发布日期，明确是21日报道，不宣称入侵首次披露于21日。
- 已读报道完整事实段：20日确认入侵、21日起关闭客户服务器、最多26,739台可能受影响；尚未确认信息外泄或滥用。保留“最多”“可能”“尚未确认”，不推断攻击者或全部服务器均感染。
- 报道引用的[服务商公告](https://www.onamae.com/news/article/11584)本轮网页工具返回404，未声称成功独立读取官方公告；本站卡片采用可读媒体报道。命令行媒体页403，网页工具读取成功。
- [报道配图](https://www.bleepstatic.com/content/hl-images/2026/10/21/cloud-servers.jpg)：GET 200，image/jpeg，192874字节，1600×900。已实际查看，为红黑白云服务器概念插图，注明 BleepingComputer · cloud server illustration，无客户数据或真实攻击画面。

## 补录 Chrome 增强型保护

- ID：`chrome-enhanced-protection-clickfix`；`software`；原文20日。
- 已读 [Google Chrome Security 20日公告](https://blog.google/security/our-latest-defenses-against-evolving-web-scams/)，并交叉阅读 [21日媒体报道](https://www.bleepingcomputer.com/news/google/google-chrome-adds-gemini-powered-scam-detection-warns-users-of-clickfix-attacks/)。采用20日原始公告，不用21日媒体或22日整理日期替换。
- 入选依据是可疑站点分层警告、由端侧转向服务端的Gemini检测及复制ClickFix命令时的警告这三项具体机制。摘要保留增强型保护适用条件和分析可能离开设备；不采用“安全十倍”的宣传结论，不复述开启或购买号召。
- [原文封面](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Scam_Roundup_BlogHeaders_Option_3.width-1300.png)：GET 200，image/png，192425字节，1300×733。已实际查看，为盾牌与浏览器警告插图，注明 Google · scam protection illustration。

## 本轮筛选

四条正文均为具体安全修复、事件或防御机制，标题、摘要、实际卡片外链与四张图片逐一复核。未收录广告、促销导购、优惠返利、产品预热、品牌活动或缺乏独立增量的案例推广；正文及采用图片未见黄赌毒、相关推广、交易引流或擦边内容。媒体侧栏广告不复制进本站。

额外查看22日IT之家首页及候选：[浙江移动110回拨](https://www.ithome.com/1/016/182.htm)转述19日公众号且含较多宣传措辞，[直缝焊管机](https://www.ithome.com/1/016/195.htm)转述21日厂商公告及未经独立确认的效果数字；本轮未收录。手机预热、折扣导购与聚合早报也未采用。没有为填22日分组而改旧稿日期。

标签沿用 `software`，无接口与配置变化；全部五语言同步。本轮只复核新增内容，不宣称全量重查所有历史外链。

## 合并远端前的本地验证（36条草稿）

- 五语言构建完成：50页面 × 5语言。新闻检查通过：36条、13个日期分组；研究检查通过：88条、8标签，10月6—22日逐日不少于5篇，21、22日各5篇。
- 多语言41930项检查、阅读正文与链接检查、标签目录检查全部通过；语言切换与新闻/研究筛选14项Node测试通过。
- 逐对象比较确认原有32条新闻、78条研究与全部既有字典值未变，原有配置与标签未变。工作区既有 `css/header.css`、`i18n/README.md`、`linux-lab/README.md` 与本轮开始时逐字节一致。
- 250个HTML中225个只更新共享缓存版本，25个实质页面为五语言首页、新闻、研究、标签总览和专题目录。没有修改博客正文、筛选实现或接口。
- `git diff --check` 通过。未在浏览器重新检查页面布局，未复现论文实验，未提交或推送。

## 发布前合并远端后的验证

基于远端 `36c12762` 合入本次4条新闻和10篇研究，保留远端新增内容与配置。新闻41条、13日期组；研究93篇、9标签，10月6—22日逐日不少于5篇，21日5篇、22日10篇。本次10篇研究均使用22日真实收录日期。

五语言构建、多语言42335项检查、新闻/研究、阅读、标签检查及14项语言/筛选测试通过。逐对象确认远端既有新闻、研究和翻译值未改动。提交只包含本次数据、翻译、来源记录及生成页面，不含原工作区页头与Linux实验室的未提交改动。


# 同日并行批次的补充核验（合并前草稿）

以下保留本地三项的原始核验记录。与远端合并时发现 PHP 为同一事件，最终只保留远端 `php2shell-emergency-security-fixes`，未新增本地同义 ID。下文40条是合并前草稿计数；合并后净新增2条，最终43条，详细结果见文末。

# 2026-10-22 新闻更新与筛选

实际上海整理日期 **2026-10-22**，触发时间 UTC 21日19:09。先读 `i18n/README.md`、全部新闻数据、近期来源和17日历史复核记录，按 ID、原文 URL 及事件核对去重。本批新增 **3 条**、撤下 **0 条**，37→**40 条**；原37条对象与研究数据保留原样，不重新上架旧撤稿。

编辑基线为 `36c12762`，起始只有 `.idea/` 与 `clean-architecture-prototype/` 未跟踪；本批不纳入这两个目录及其他任务修改。

## PHP 两项严重漏洞的正式修复

- ID：`php2shell-emergency-security-releases`；新增 `security` 标签；`published_at=2026-10-21`、`collected_at=2026-10-22`。
- 已阅读全文：[BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/)，正文可见日期21日10:07，JSON-LD `datePublished=2026-10-21T10:07:05-04:00`，对应上海21日22:07，不采用整理日期22日。
- 原始核验：实际读取 [PHP 官方2026年新闻档案中21日安全公告](https://www.php.net/archive/2026.php)，明确 PHP 8.5.12、8.4.27、8.3.36、8.2.35 修复 CVE-2026-109618 和 CVE-2026-109619，涉及处理 Web 请求的部署。保留官方对 mod_php 风险最高的说明；不扩大为 PHP 命令行的所有用途都可被远程攻击。
- 新闻增量为补丁已经发布，区别于20日预告。漏洞可在未认证条件下造成 Web worker 权限的代码执行；不宣称自动取得 root、所有网站均已被入侵、已确认受害数量，或把网站采用率当作已中招比例。
- 保留边界：临时缓解只减少特定路径暴露，不能替代修复；8.1及更早分支需查发行商/LTS回补或迁移。旧分支有最小源码补丁不等于重新获得长期支持。卡片不发布攻击载荷或未经测试的“一键修复”配置，也不引用商业 WAF 营销。
- 配图为[报道原始分享图](https://www.bleepstatic.com/content/hl-images/2026/10/21/PHP.jpg)，GET 200、`image/jpeg`、276482字节、1600×900；已实际查看，为 PHP 标志和网络线条概念图，无价格或不当内容。署名 `BleepingComputer · PHP illustration`，完整展示，不当作攻击现场。
- 筛选：实际开源运行时紧急安全修复，具有可核对增量；报道中 Blue Report 下载推广及赞助栏不采用。核对标题、摘要、采用外链正文及图像，未收录广告导购、色情、赌博、毒品或相关推广、交易引流、擦边内容。

## PowerToys 0.102 鼠标工具与命令行接口

- ID：`powertoys-0102-mouse-accessibility-tools`；`software`；`published_at=2026-10-21`、`collected_at=2026-10-22`。
- 已读 [Windows Command Line 官方原文](https://devblogs.microsoft.com/commandline/powertoys-0-102-is-here-new-mouse-utilities-command-palette-improvements-and-much-more/)，`datePublished=2026-10-21T11:06:49+00:00`。实际日期为21日，不以中文版转载或本次整理时间代替。
- 交叉核对[官方 GitHub v0.102.2933.0 发行记录](https://github.com/microsoft/PowerToys/releases/tag/v0.102.2933.0)，显示21日07:45发布，版本已提供。独立读取 [BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/microsoft/microsoft-powertoys-adds-cursorhide-button-lock-mouse-tools/)，确认具体功能变化并判断其新闻增量，不单凭企业博客认定合格。
- Mouse Button Lock 是达到按住时长后放开仍维持拖拽/选择，下一次点击解除；不混淆成锁屏或不可逆禁用按键。CursorHide 在打字和/或闲置时隐藏，移动后恢复。Command Palette 快捷栏支持最多九项，部分工具增加脚本接口；不扩写为所有功能均可自动化或所有 Windows 用户已默认启用。
- 配图采用[独立报道正文的 Mouse Button Lock 设置截图](https://www.bleepstatic.com/images/news/u/1109292/2026/PowerToys-Mouse-Button-Lock.jpg)，GET 200、`image/jpeg`、67555字节、1200×591；已实际查看，为按键与时长设置，无促销、个人凭证或不当内容。署名 `BleepingComputer · PowerToys screenshot`，完整显示，未使用带推广内容的品牌横幅。
- 筛选：入选依据是已发布的开放源码工具行为变化和无障碍操作选项，去掉“更强”“大幅提升效率”等无法核验的宣传判断、感谢名单、招募及购买号召。原文相关正文和所用图片无广告导购、黄赌毒及相关推广引流；媒体侧栏广告不复制进本站。

## Firefox 对 eMudhra 问题证书的拦截与客户端更新

- ID：`mozilla-emudhra-certificate-blocking`；`security`；`published_at=2026-10-20`、`collected_at=2026-10-22`。
- 已阅读全文：[Mozilla Security Blog 原文](https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/)，可见日期20日，`datePublished=2026-10-20T12:54:54+00:00`。该页21日增补 Android 158.0.2 信息，不能把修订日期改成首发日期。
- 原始说明：17日20:06 UTC收到八张中间证书的私钥受损报告，22:59 UTC前 OneCRL 已覆盖标准配置 Firefox；20日发布 Desktop/Android 158.0.1及ESR更新，补充覆盖未接收撤销列表的配置。NSS信任列表另行更新，保护使用其证书库而未接收 OneCRL 的程序。21日08:29 UTC又发布Android 158.0.2，修复部分客户端启动后未立即应用内置列表变化的问题。
- 独立交叉阅读 [BleepingComputer 20日报道](https://www.bleepingcomputer.com/news/security/mozilla-google-apple-block-compromised-emudhra-ca-certificates/)，并读其链接的 [Mozilla Bugzilla 原始事件记录](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449)相关描述。厂商原因说明与弱私钥信息不扩写为已证实拦截用户流量；无充分证据认定实际发生中间人攻击，卡片只说明伪造证书的风险和更新范围。
- 标题聚焦 Mozilla 实际防护进展，不把所有应用的证书库、系统 curl 或第三方程序都说成自动得到同等保护。保留独立信任库需要单独更新的边界；不复制私钥、伪造证书或攻击操作。
- 配图：[独立报道原始证书概念图](https://www.bleepstatic.com/content/hl-images/2026/10/20/certificate.jpg)，GET 200、`image/jpeg`、534171字节、1600×900；已实际查看，为破损证书与锁的概念插图，无促销或不当内容。署名 `BleepingComputer · certificate illustration`，完整显示，不当作真实证书截图或入侵实景。
- 筛选：证书信任基础设施的实际安全事件和已推出防护，有原始说明与独立报道，非浏览器品牌宣传。剔除原文 Firefox 下载推广、订阅提示及媒体赞助内容；所采事实、标题摘要和图片无色情、赌博、毒品或相关交易、推广引流及擦边内容。

## 覆盖、标签与未采用项

本批涉及 PHP 安全团队及开源社区、Microsoft PowerToys、Mozilla／eMudhra 证书信任生态，主题覆盖运行时安全、桌面输入与无障碍工具、TLS证书信任；不由单一公司主导。另检索 Node.js、NASA、产业和 AI 相关方向，但不因类别或数量配额降低事实与内容要求。新闻无每日数量下限，本批以三条已完整核验事件为准。

新增长期可用的 `security`（安全与隐私）新闻标签，同步五语言名称，供两条安全事件使用。原6个标签 ID 与已有条目分类保持原样，旧筛选链接兼容；页面筛选、目录计数均由配置生成，不将历史内容批量改分类。前沿研究标签、每日任务和数据不改。

排除促销导购、手机/耳机预售、品牌活动、NASA球赛飞越宣传、只有传闻的公司合并及无法核实统计口径的社区“维护人数报告”。已收录 OpenBSD、qBittorrent、TorchNeuron、OVHcloud、MMX 等不重复添加。搜索列表有显示晚于本次实际时间的条目，本批不依其未来转载时间取材；采用三条原文均已在本次核验前发表。

`updated_at=2026-10-22`，实际原文日期为21日2条、20日1条，不创建22日空分组，不用整理日期冒充首发。仅复核本批新增，不声称重新全量检查全部历史外链。

## 构建与发布前验证

- 五语言构建成功；新闻检查通过：40条、13个真实日期分组、7个配置标签，首页预览、卡片外链与原文日期一致。
- 多语言41880项检查、阅读正文不变、标签目录与共享 Linux 实验室入口检查通过；日期筛选、标签交集、搜索与语言切换28项 JavaScript 测试全部通过；`git diff --check` 通过。
- 研究检查通过：83条、9标签，既有10月6—21日连续归档每日不少于5条；研究数据不改，本轮不声称完成22日研究精选。
- 逐对象核对原37条新闻不变，原五语言键值不变。235个生成页面仅更新共享缓存版本，15个实质更新为五语言首页、新闻页及标签总览。站点地图由现有构建核对，规范路径未新增，文件无需产生差异。
- 本批仅纳入新闻元数据、新标签五语言名称、标题摘要、来源文档及对应生成页面；未跟踪目录和其他任务既有提交保留原样。

# 并行更新合并后的最终发布记录

首次推送因远端新增 `da462c8c` 被拒绝，未强制推送。读取该提交的新闻、研究和来源记录后完成普通合并，保留其所有41条新闻、93篇研究及既有翻译值。

本地 PHP 草稿与远端 `php2shell-emergency-security-fixes` 为同一事件，采用远端原始公告地址、ID、分类与文案，删除未发布的本地同义条目 `php2shell-emergency-security-releases` 及其五语言键；这属于发布前去重，不计为撤下历史稿。PowerToys、eMudhra两项继续加入，**本批净新增2条、撤下0条，合并后新闻43条**。远端同期新增的 Node.js、Onamae、Chrome与10篇研究原样保留，不将它们记作本批新增。

保留远端旧分类，新增 `security` 标签由 eMudhra 项使用；旧软件标签和链接兼容。原始两份来源记录均保留，上面的40条与三项新增仅是本地合并前草稿计数，不能当作最终发布数量。

解决数据、字典和来源记录冲突后，通过现有构建重新生成全部页面；没有逐页手工拼接生成HTML。最终新闻43条、13日期组；研究93篇、9标签，10月6—22日逐日不少于5篇，22日10篇。多语言42400项、阅读正文不变、标签、Linux共享入口及28项日期筛选/搜索/语言测试均通过，`git diff --check` 通过。

逐对象比较确认全部远端新闻、研究和字典旧值保留，新增仅为两项新闻及安全标签名称；相对远端235个页面只更新共享缓存版本，15个实质页面为五语言首页、新闻页及标签总览。其他未跟踪目录保持原样。
