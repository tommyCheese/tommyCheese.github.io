# 2026-10-21 新闻核验与更新

实际整理日期为上海时间 **2026-10-21**，触发时间 UTC 20日18:56。先读 `i18n/README.md`、全部新闻元数据、19—20日来源记录与17日历史复核清单，按 ID、URL 及事件去重。本批新增 **3 条**、撤下 **0 条**，34→**37 条**。原34条对象与前沿研究数据保留原样，不将旧撤稿重新上架。

开始时只有 `.idea/`、`clean-architecture-prototype/` 未跟踪；过程中其他任务提交了 Linux 实验室文案，编辑前工作区仍无已跟踪改动，本批以 `90aaaf97` 为比较基线并保留该提交。

## OpenBSD 8.0 正式发布

- 新增 ID：`openbsd-80-release`；标签 `software`；`published_at=2026-10-20`、`collected_at=2026-10-21`。
- 已读[官方发行说明](https://www.openbsd.org/80.html)，页面明确 `Released October 20, 2026`，为第61次发行。搜索缓存曾显示日期占位符，实际获取的当前页面已经给出20日，不凭旧缓存推断尚未发布。
- 独立报道：已读 [Phoronix 20日05:44 EDT报道](https://www.phoronix.com/news/OpenBSD-8.0-Released)，核对 amd64 地址空间、arm64 休眠、RISC-V 向量及 Intel Arc A 系列支持。网页读取工具失败，但普通 HTTPS GET 成功取得正文。LWN 另有发布条目，仅作发现线索，不声称已读其全文。
- 官方 VMM/VMD 段明确客户虚拟机新增多处理器支持，最多64 vCPU；摘要未混淆为物理CPU数、所有架构均支持64核或通用性能提升。其他硬件支持仍取决于架构和驱动。更新还包含实际安全修复；不照搬捐款、下载号召或歌曲宣传。
- 配图采用[官方首页的发行主题图](https://www.openbsd.org/images/puffy80.gif)，由实际读取的首页 img 指定。GET 200，`image/gif`，2793216字节，599×198。实际查看图像，为河豚和 OpenBSD 8.0 的海底主题插画，署名 `OpenBSD · release artwork`，完整显示。另检查了发行页自行车主题 GIF，体积更大，未采用。不把主题插画说成系统截图。
- 筛选：实际操作系统发行及可核对的支持变化，非硬件导购、品牌活动或广告；标题、摘要、用于核验的外链正文及采用画面无色情、赌博、毒品及相关推广引流内容。

## qBittorrent 5.3：Web UI 安全修复

- 新增 ID：`qbittorrent-530-webui-security`；`software`；`published_at=2026-10-19`、`collected_at=2026-10-21`。
- 已读[官方新闻页5.3.0条目与变更记录](https://www.qbittorrent.org/news)，标题明确 `Mon Oct 19th 2026 - qBittorrent v5.3.0 release`。卡片链接此原文，故保留19日。搜索缓存一度仍停在9月beta，实际网页读取已显示5.3.0；普通命令行读取该网站返回403，以成功的网页读取为准，不绕过访问控制。
- 日期交叉核对：[GitHub 正式发行页](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)显示20日12:57发布，独立媒体[Linuxiac 20日报道](https://linuxiac.com/qbittorrent-5-3-released-with-web-ui-improvements-security-fixes/)及[IT之家20日报道](https://www.ithome.com/1/015/586.htm)也已发布。区分官方新闻页原始日期与 GitHub release 发布日期，不擅自把新闻页19日改成20日或本次21日；不以此宣称19日所有平台二进制都已提供。
- 实质增量：官方变更明确修复伪造 X-Forwarded-For 导致的 Web UI 验证绕过，使用 Sec-Fetch-Site 加强跨站请求检查，部分 WebAPI 改要求 POST，并新增 RSS 规则导入导出。未编造 CVE 编号、受害规模、实际攻击或所有部署均存在无条件漏洞。
- 保留官方限制：默认后端改用 libtorrent 2.1；大量做种场景读取性能可能弱于1.2并影响上传速度，不能只写成全面性能升级。只报道软件维护，不链接下载资源、搜索插件或任何非法内容。
- 配图采用[独立报道原始分享图](https://linuxiac.com/wp-content/uploads/2026/10/qbittorent53.jpg)，从报道 `og:image` 获取；GET 200，`image/jpeg`，86994字节，1600×900。实际查看为 qBittorrent 标志、版本及开源客户端说明，无下载资源名称、促销价格或不当内容。署名 `Linuxiac · qBittorrent illustration`，完整显示。
- 筛选：合法开源软件的安全修复与功能维护，有独立技术报道；未纳入购物号召或媒体捐助栏。标题、摘要、原文及采用图片无广告促销、色情、赌博、毒品及相关推广、交易引流或擦边内容。

## Quantinuum Helios 彩色码纠错实验

- 新增 ID：`quantinuum-helios-color-code-memory`；`science`；`published_at=2026-10-19`、`collected_at=2026-10-21`。
- 已读[19日机构技术说明](https://www.quantinuum.com/blog/quantinuum-closes-in-on-one-million-error-free-operations)，明确日期19日，并实际阅读其链接的[原始技术报告《Quantum error correction well below the color code threshold》](https://www.quantinuum.com/fault-tolerance-by-2029)摘要、方法、误差定义及解码限制。不是只凭企业新闻稿判定合格。
- 原始报告：Helios 离子阱处理器上测试距离3、5、7的三角彩色码；距离7的逻辑存储误差约为每轮 syndrome extraction `5(+4/-2)×10⁻⁶`，不把它当作全算法错误率或已经连续运行百万步无错。摘要保留约数，不隐去实验种类。
- 报告第3页明确本工作解码均为离线，流式处理用于测量相关延迟；未声称已经端到端闭环实时纠错。魔法态制备的阈下扩展及完整 Clifford+T 电路仍待验证；不写成已经达到通用容错量子计算、不采用2029商业路线、成本或世界纪录排名作确定结论。
- 独立交叉阅读 [HPCwire 19日报道](https://www.hpcwire.com/2026/10/19/quantinuum-says-helios-results-strengthen-its-path-to-apollo/)，与原始论文共同确认研究增量；报道中的公司目标、融资与 CEO 商业预测不写入本站摘要。不采用自动新闻聚合或 AI 研究代理文章作核心证据。
- 配图采用[机构正文图1](https://cdn.prod.website-files.com/669960f53cd73aedb80c8f0e/6ad274e976d3e3d01de0af62_Figure%201%20Logical%20Qubits.png)，GET 200，`image/png`，221592字节，2000×1721。实际查看为距离3、5、7的彩色码布局示意，原文对应图注清楚；署名 `Quantinuum · color-code experiment diagram`，完整显示。未采用品牌路线图或性能营销图。
- 筛选：入选依据是实际纠错实验、原始方法和误差边界，广告用语及品牌未来承诺均删除。核对标题、摘要、采用外链正文及配图，无广告导购或色情、赌博、毒品及相关推广引流。

## 本批覆盖、未采用项与日期

三条分别涉及 OpenBSD 开源项目、qBittorrent 开源项目和 Quantinuum 研究团队，覆盖系统与虚拟化、开源软件安全、量子计算实验；沿用 `software` 与 `science`，无需新增同义标签。没有单一公司的多条宣传，也不为公司、类别或日期数量凑稿。

检索还覆盖 Windows Server、NASA、AI Agent 和产业消息。NASA El Niño 页面实际发布日期为15日，不把首页20日列表当作新发表；Windows Server 快速恢复功能原始更新已于13日发布，本轮不当作20日首次发布；Google Harness² 相关报道追溯至更早论文，未冒充当天研究。折扣导购、品牌预热、换电及镜头传闻、活动演讲计划、仅有商业宣传的稿件不采用。已收录的 TorchNeuron、OVHcloud、MMX 与 OpenCode 不重复新增。搜索返回的不当娱乐或赌博页面不进入数据与来源卡片。

更新 `updated_at` 为本次真实上海日期21日；新增新闻原文日期为20日1条、19日2条，不生成21日空分组，不把整理时间伪装成原文首发时间。本轮仅复核新增，不声称重新核查全部历史外链。

## 构建与发布前检查

- 现有构建成功生成50类页面×5语言；新闻检查通过：37条、12个真实日期分组、首页预览与外链一致。
- 多语言41490项检查、阅读正文不变、标签目录与共享 Linux 实验室入口检查均通过。日期/标签筛选、搜索与语言相关28项 JavaScript 测试全部通过；`git diff --check` 通过。
- 研究检查通过：78条，coverage_start至既有updated_at（10月6—20日）每日不少于5条；研究数据与自动任务不由本轮更改，不声称本轮完成21日研究精选。
- 逐对象核对原34条新闻及已有五语言键值未变。235个生成页面仅更新共享缓存版本，15个实质更新为五语言首页、新闻页、标签总览；站点地图由现有构建核对，路径未新增而保持不变。
- 仅提交本批元数据、五语言文案、来源文档及对应生成页面；未跟踪目录与其他任务既有提交保留原样。
