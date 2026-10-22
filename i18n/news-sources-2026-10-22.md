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
