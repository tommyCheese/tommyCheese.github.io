# 2026-10-28 软件历史新闻正文复核

本批为 3 条已有新闻补齐五语言完整解读，不新增新闻。三条原始发布日期均保持 2026-10-21，收录日期保持 2026-10-22；仅正文撰写日期记为 2026-10-28。重新阅读原始公告、发行说明及交叉来源，正文用独立叙述解释机制、变化与边界，不复制报道全文。

## PowerToys 0.102

- ID：`powertoys-0102-mouse-accessibility-tools`
- [微软官方说明](https://devblogs.microsoft.com/commandline/powertoys-0-102-is-here-new-mouse-utilities-command-palette-improvements-and-much-more/)标注 October 21st, 2026；[实际发行记录](https://github.com/microsoft/PowerToys/releases/tag/v0.102.2933.0)显示 21 Oct 07:45，提供安装包。重新阅读全文的鼠标工具、Command Palette、ZoomIt、自动化接口、Keyboard Manager及其他变更段落。
- [BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/microsoft/microsoft-powertoys-adds-cursorhide-button-lock-mouse-tools/)交叉确认功能交付和最多九项快捷访问。报道有独立新闻主体，也含推广区；正文仅采用新闻事实，不复制推广文字。

事实边界：按键锁定在达到设置时长后允许松手继续拖拽或选择，点击任意按钮结束；不是锁屏或永久禁用。CursorHide在输入、闲置或两者下隐藏，移动恢复。快捷栏是可选功能，不宣称默认对所有用户开启。ZoomIt截图口述的转写在设备上进行，不把这扩写成全部PowerToys AI功能均离线；Advanced Paste仍使用配置的服务商与策略。单独轻按映射与组合按键行为分别说明。新闻依据是可核对的操作变化，不沿用效率宣传或虚构无障碍实测结论。

封面复核：[既有截图](https://www.bleepstatic.com/images/news/u/1109292/2026/PowerToys-Mouse-Button-Lock.jpg)返回 200、image/jpeg、67,555 字节，实际查看为 1,200×591 的 Mouse Button Lock 设置界面，包含按钮选择、按住时长及拖动阈值。与报道内图注匹配；既有署名为 BleepingComputer · PowerToys screenshot。未见个人身份、凭据、促销或不当内容。截图仅证明界面，不代表用户试验。

## PHP2Shell 紧急修复

- ID：`php2shell-emergency-security-fixes`
- 重新阅读 [PHP 2026 年公告](https://www.php.net/archive/2026.php#2026-10-21-5)中的 21 日主安全说明、四分支发行记录和 23 日会话上传进度补充。主修复版本为 8.5.12、8.4.27、8.3.36、8.2.35，涉及 CVE-2026-109618 和 CVE-2026-109619。
- [BleepingComputer 21日报道](https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/)交叉确认四版本、Web部署范围与临时缓解不完整。未采用正文后的厂商推广报告或侧栏赞助内容。

事实边界：解释内存不足时的不完整初始化和释放后遗留状态，只讨论防御性原理、潜在影响与修复，不展示构造请求、代码、载荷或可复制配置。官方将mod_php风险列为最高，并报告可在应用代码执行前到达的验证路径；这不等于所有部署已经受害。PHP 8.1及更早版本停止常规支持，额外的最小源码回补不代表长期支持恢复。发行版回补状态须按供应商公告核对，不能只比较上游版本号。

正文单独说明 23 日补充的 CVE-2026-115560：与运行中更换会话序列化处理器、上传进度仍开启这一少见组合有关，官方给出临时处理建议并计划在常规周期修复。保留“从不运行时切换的应用可继续开启”边界，不写成21日修复无效或所有网站都具备该配置；不修改原新闻发表日期。

封面复核：[既有PHP插图](https://www.bleepstatic.com/content/hl-images/2026/10/21/PHP.jpg)返回 200、image/jpeg、276,482 字节，实际查看为 1,600×900 的PHP标志与抽象网络节点。与报道头图链接一致，署名 BleepingComputer · PHP illustration；并非真实攻击现场，无私人数据或攻击操作。

## Node.js 十月安全版本

- ID：`nodejs-october-security-patches`
- 重新阅读全文：[官方安全公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)和三个实际发行页：[22.23.4](https://nodejs.org/en/blog/release/v22.23.4/)、[24.22.1](https://nodejs.org/en/blog/release/v24.22.1)、[26.12.1](https://nodejs.org/en/blog/release/v26.12.1)。发行页均明确21日，补丁已提供；公告保留的早期预告不作为当前未发布的证据。
- [HKCERT公告](https://www.hkcert.org/security-bulletin/node-js-multiple-vulnerabilities_20261022)于22日发布、26日更新，交叉确认修复版本与潜在影响。仅采用防御性通报，未采用其外链中的利用实现。

事实边界：说明DNS名称验证与实际解析不一致、TLS地址表示与证书身份不一致、Brotli畸形输入导致越界写入、HTTP复用时序、快照随机缓存和权限检查问题，不提供触发文本、非标准地址样本、命令、文件路径或攻击步骤。Brotli风险以应用实际解码外部可控数据为前提，不把安装运行时等同于同样暴露。全角数字TLS回归仅列在24和26系列；ZIP与部分权限通配匹配问题仅列26，其他问题按官方范围描述。依赖更新范围区分OpenSSL的22/24和SQLite的22。最高官方级别为High，不写成Critical；潜在危害不等于确认某个站点遭到利用。

封面复核：[既有官方安全发布图](https://nodejs.org/en/next-data/og/vulnerability/Node.js%20%E2%80%94%20Wednesday,%20October%2021,%202026%20Security%20Releases)返回 200、image/png、188,086 字节，实际查看为 1,200×600 的Node.js标志与21日安全发布标题。署名 Node.js Project · security release graphic，与内容相符，不包含私人信息、命令或敏感路径。

## 图文与内容筛选

三张封面均沿用已有外链和署名，未重新托管、未新增转载图片；本轮能核对图片内容、原始出处和可访问性，但原页面没有提供足以确认普遍再分发权的明确图片许可，不把可访问或署名当作授权证明。正文新增的流程图均由本站独立组织，图注明确为解释性重绘；不复制原图或冒充实验、攻击实录。

三篇五语言正文同步关键事实、时间、条件和限制；安全内容仅解释防御与影响。标题、文章、参考来源及采用的图片未发现广告导购、色情、赌博、毒品或相关推广引流。公开内容不含本机身份、设备信息、私人路径、账号凭据、操作日志或内部实现片段。
