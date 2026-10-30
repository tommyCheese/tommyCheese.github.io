# 2026-10-30 Microsoft 远程桌面修复复核

新增 ID：`microsoft-rdp-admin-protection-fix`。原始发布日期 2026-10-28，收录与正文日期 2026-10-30，分类为软件。与既有新闻按事件、原文地址和标题核对，无重复远程桌面管理员保护修复条目。本次不拆分同一更新中的其他功能来增加数量。

## 实际阅读来源

- [KB5127936 官方发布说明](https://support.microsoft.com/en-us/servicing/os/windows-11/2026/10/kb5127936-windows-11-25h2-26h2-update)：原始短链接重定向至该正式页面，标题为 October 28, 2026，Applies To 明确 25H2 与 26H2。实际阅读适用范围、Announcements and messages、Remote Desktop 已知问题修复项及更新说明。
- [Windows 11 25H2 发布运行状况](https://learn.microsoft.com/en-us/windows/release-health/status-windows-11-25h2)：实际阅读 Remote Desktop connections might fail for non-admin users with error 0xC000000D 的完整条目、历史、Resolution、Workaround 与 Affected platforms。
- [Administrator protection 官方机制文档](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/administrator-protection/)：实际阅读 System requirements、How Administrator protection works、Key architectural highlights 与默认策略说明；配置示例不转载进文章。
- [BleepingComputer 独立报道](https://www.bleepingcomputer.com/news/microsoft/microsoft-fixes-remote-desktop-failures-caused-by-recent-windows-updates/)：2026-10-29，署名 Sergiu Gatlan，实际阅读新闻正文至相关报道区。确认修复是兼容性进展，不是品牌促销；不纳入附带广告和推荐模块。媒体日期不替代原补丁 28 日日期。

## 关键事实与限制

1. 原始问题由 9 月 22 日 KB5124010 非安全预览更新及之后的更新触发，官方历史记录为 10 月 13 日公开、10 月 28 日解决。目标条件是非管理员账户连接已经开启管理员保护的远程桌面主机，主要在企业管理设备出现；不是全部远程桌面连接或所有 Windows 设备都会失败。
2. 官方修复项明确 0xC000000D 和无效令牌错误。正文解释令牌表示授权，不复制错误日志、配置命令或内部代码。没有声称本站独立实测成功率，也未填造受影响设备数。
3. 功能机制文档说明，管理员日常会话处于低权限，获明确授权的请求进程取得隔离管理员令牌，进程退出后令牌销毁。没有把非管理员连接用户与能够提权的管理员混为一谈；本次修复不表示向所有标准用户授予管理权限。
4. 一般默认关闭，与采用 Windows 安全基线组织的默认启用是不同条件。官方功能说明将后者关联 10 月安全更新与 24H2、25H2、26H2 基线，组织可通过策略调整；未推断所有个人电脑已经开启功能。
5. 官方运行状况的受影响客户端列为 24H2、25H2、26H1、26H2，Server 为 None；但 KB5127936 适用栏仅列 25H2、26H2。正文完整保留这种范围差异，不能因运行状况统称已解决就断言所有四个版本可安装同一补丁。
6. KB 的公告区说明：24H2 从 2026 年 10 月起停止非安全预览更新，Enterprise 与 Education 仍接收每月安全更新。正文不扩大到其他版本或支持状态，也不编造 26H1 对应补丁。
7. 旧更新状态下官方给出的临时变通是由管理员停用管理员保护。正文只解释其代价与临时性质，不提供降低防护的操作步骤。安装适用的修复更新后无需继续此变通，不概括为所有远程桌面或服务器问题均解决。

## 图文与公开内容筛选

封面 `images/news/windows-rdp-protection-fix.svg` 为本站原创解释图，使用自绘形状和文字表达主机条件、版本匹配及保持保护，不包含 Microsoft 标识、第三方照片、程序界面或复制的实验图。已实际渲染查看，文字清晰，无裁切。正文各语言另有相同事实的四步解释图，并明确不是实测成功率或操作指南。

五语言标题、摘要、完整正文、流程、来源链接与封面均复核，关键日期、版本、默认状态和限制一致。无广告、促销导购、品牌宣传、色情、赌博、毒品内容或推广；不转写来源页附加广告。只保留公开产品及补丁标识，无私密用户、设备、本机或临时位置、内网地址、凭据、代码与执行记录。

交付为 1 条新增新闻和 1 篇五语言完整正文；不撤下既有条目。
