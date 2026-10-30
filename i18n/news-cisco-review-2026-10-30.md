# 2026-10-30 Cisco SSL VPN 安全公告复核

- 新增 ID：`cisco-asa-ftd-ssl-vpn-dos-fix`。
- [Cisco PSIRT 原始公告](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-tunnel-dos-s6mgkb75)首次公开时间为 2026-10-28 19:15 GMT，修订表同样为 28 日。元数据保留 2026-10-28，收录及撰写日期为上海时间 2026-10-30。
- [BleepingComputer 独立报道](https://www.bleepingcomputer.com/news/security/cisco-warns-of-firewall-zero-day-exploited-to-crash-ssl-vpn-devices/)发表于 29 日。实际阅读全文并顺着链接核对原始公告，不以次日报道日期覆盖首次公告日期。
- 已与 67 条既有新闻按事件、编号及原文链接去重；这是新漏洞 CVE-2026-76418，不是以前的 Cisco 漏洞换标题。

## 原文定位与事实边界

1. Summary、Affected Products：ASA 与 FTD 的远程访问 SSL VPN 在特定二次认证配置下存在逻辑错误，未认证远程攻击者可造成意外重启与拒绝服务。成功 VPN 登录不是触达问题路径的前提。
2. Vulnerable Products：需要受影响软件、可到达的登录服务及相关隧道组二次认证条件。不能只检查页面可见连接项；默认组也必须纳入。Cloud-delivered Firewall、Cloud-delivered FMC、Secure Access、Secure FMC 明确列为不受影响。
3. Workarounds：没有消除漏洞的绕行修复。默认组不使用二次认证与使用二次认证的情况，所需缓解不同；关闭组选单并非总能消除暴露。取消二次认证会降低安全性。厂商只在测试环境验证过，要求逐部署评估功能与安全影响。正文仅概述条件，不展示配置、命令或攻击请求。
4. Fixed Releases：ASA 9.20 对应首个修复 9.20.4.50；FTD 7.4 对应 7.4.9。正文作为两条分支例子，不写成全体设备统一升级目标。其他分支应查原表与兼容性资料。
5. Exploitation and Public Announcements：PSIRT 在 2026 年 10 月得知实际利用。首次公告未披露攻击者、受害组织数量或攻击规模。CVSS 3.1 基础分 8.6 是严重性，不是攻击概率；保密性与完整性未在本漏洞评分中列为受损，不将拒绝服务写成已确认信息失窃或远程代码执行。
6. 独立报道用于确认现实新闻增量；其互联网暴露总数并非受影响或已入侵总数，本稿不采用该数字，也不把其他年份活动的归属套给本次。其尾部赞助报告、购买入口及推荐内容未纳入正文。

## 图文和筛选

五语言均有独立导语、三个实质章节、六段正文及风险核对流程。连接中断为对已知拒绝服务机制的解释，不虚构停止时长或本站实测。封面 `images/news/cisco-ssl-vpn-remediation.svg` 为本站原创解释图，已渲染检查可读性，不使用报道照片、攻击样例或未经许可图表。

标题、摘要、正文、流程和来源链接人工复核：无广告导购、促销、色情、赌博、毒品性质内容或引流；无私密身份、设备信息、内部位置、凭据、代码、命令或运行记录。公开产品与漏洞编号仅用于描述真实事件。
