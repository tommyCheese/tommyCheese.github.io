# 2026-10-31 历史新闻正文复核：安全事件与依赖许可证

复核日期：2026-10-31（上海时间）。本记录覆盖 3 条既有新闻的正文补写与封面替换，不计为新增新闻；没有撤下条目。3 篇均补齐简体中文、英语、日语、俄语及繁体中文独立阅读正文。原始 ID、发表日期与已有收录日期保持不变，正文撰写日期为 2026-10-31。

## SiteGuard 统计功能漏洞

- ID：`siteguard-statistics-exploitation`。
- 原条目发表日期：2026-10-18，为独立报道日期；收录日期保留 2026-10-20。官方公开告警实际发表于 2026-10-14，正文明确区分。
- 实际阅读：[厂商原始告警](https://www.eg-secure.co.jp/siteguard/news/alert-202610-1) 的漏洞概要、受影响版本、修复措施与诊断信息提醒；[JVN 原始记录](https://jvn.jp/en/jp/JVN88474777/index.html) 的版本范围及 CVSS；[JPCERT/CC 警告](https://www.jpcert.or.jp/at/2026/at260032.html) 的概要、影响、对策和缓解措施；[BleepingComputer 10 月 18 日报道](https://www.bleepingcomputer.com/news/security/hackers-exploit-siteguard-waf-flaw-to-run-commands-as-system-root/) 的实际利用、厂商说明与披露范围。
- 核验：CVE-2026-106931；统计功能默认启用，可能导致 SYSTEM/root 权限的操作系统命令执行。官方 CVSS 4.0 为 8.5，向量含本地攻击条件及低权限前提；CVSS 3.0 为 7.8。不能改写为任意未认证远程访客均可利用。
- 受影响范围从 2.20 开始；非 FreeBSD 的 Apache/Nginx/IIS 修复界线为 8.00 Update 5，FreeBSD 的 Apache/Nginx 为 7.00 Update 6；IIS 3.10 至 4.00 Update 4 被明确排除。需结合平台、完整版本与统计功能判断，不以主版本号一概而论。
- 重要顺序：厂商要求修补前保存诊断资料，因为修补可能清除调查线索；直接支持合同客户于 9 月 29 日收到通知。JPCERT/CC 提到关闭统计功能可作为临时缓解。更新漏洞与确认历史入侵/持久影响是不同事项。
- 未知边界：攻击者、受害数量、完整攻击链均未公开。未采用产品总体覆盖网站数或其他版本安装量作为受害数量。正文没有提供攻击载荷、系统操作命令或真实环境细节。
- 摘要调整：移除“补录报道”这类面向编辑流程的说法，五语言改为直接描述漏洞、修复与范围；不改标题及日期。

## OpenCode Console 第三方服务商密钥事件

- ID：`opencode-console-provider-key-breach`。
- 发表日期保留 2026-10-17；原条目没有收录日期，不补填。正文引用 10 月 19 日后续报道补充同一事件，不把其当成新的发表日期。
- 实际阅读：[OpenCode 官方声明](https://x.com/opencode/status/2111519637049319818) 的公开可取回部分；[Notebookcheck 原报道](https://www.notebookcheck.net/OpenCode-hacked-users-urged-to-revoke-their-API-keys.1426957.0.html) 正文及其客户通知转述；[BleepingComputer 10 月 19 日跟进](https://www.bleepingcomputer.com/news/security/opencode-hack-exposes-api-keys-amid-ai-distillation-attacks/) 正文及其中展示的后续客户通知；[官方 Console 说明](https://opencode.ai/v2/docs/console/) 和 [官方 provider 凭据说明](https://opencode.ai/v2/docs/console/providers/)。
- 访问边界：X 的普通帖子页面无法完整取得；官方公开嵌入及同步内容接口能核对声明开头的 1.4%、Console 用户分母、外部 provider 子集与邮件通知说法，以及 10 月 17 日日期。未将未取得的长帖余文声称为已阅读全文。其余细节依靠实际阅读的两份独立报道及所展示通知，并在正文保留厂商归因。
- 核验：1.4% 是公司披露的 Console 用户比例，不能外推为全部本地安装或全部开发者；原因描述为正在退役的旧系统遭未授权访问。后续通知列出的最早可能暴露时间为 2026-10-17 00:30 UTC，同时表示无法确认通知涉及的密钥是否已被未经授权使用。
- “大规模蒸馏攻击”是公司对动机的说法；初期“未发现其他数据暴露”也只是当时调查判断，未作已独立核验的攻击归因或全面无其他影响保证。没有声称调查在正文撰写日仍未完成，也没有虚构新的结案消息。
- 当前官方文档解释托管凭据与模型网关的信任关系，正文明确它不是旧系统漏洞的取证证据。根据凭据生命周期说明，停用一个工具配置不自动等于签发方撤销了旧密钥。
- 后续通知支持的处置包括撤销/替换受影响密钥、更新应用、核对调用和费用；与 OpenAI、Anthropic、Google 的费用沟通不等于普遍退款承诺。个人网上自报金额未纳入正文或推导损失总额。
- 后续通知图中含有部分凭据标识，复核时仅用于理解通知内容，未转载该图、未转写任何密钥片段或个人账户信息。

## GitHub 开源许可证合规检查正式可用

- ID：`github-license-compliance-ga`。
- 发表日期保留 2026-10-16；原条目没有收录日期，不补填。
- 实际阅读：[10 月 16 日 GA 公告](https://github.blog/changelog/2026-10-16-open-source-license-compliance-generally-available/) 完整主要说明；[6 月 30 日公开预览公告](https://github.blog/changelog/2026-06-30-open-source-license-compliance-is-in-public-preview/)；[官方概念文档](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/supply-chain-security/open-source-license-compliance) 的依赖图、Active/Evaluate、例外流程；[配置文档](https://docs.github.com/en/enterprise-cloud@latest/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-license-policies) 的策略、角色、依赖图前提、审计与接口；[CodeGangsta 10 月 19 日独立报道](https://codegangsta.io/coding/github-open-source-license-compliance-ga/) 的合并前检查及元数据边界讨论。
- 适用范围：GitHub Enterprise Cloud 的 Code Security 仓库，包含数据驻留版本。不能扩展为所有 GitHub 仓库自动启用。
- 已区分预览和正式可用增量：企业政策与许可证管理者角色在 6 月预览就已存在；GA 的增量包括数据驻留环境支持、政策审计事件、获取/更新/替换政策的接口及按包查询合规状态。未采用独立报道中把管理角色笼统说成 GA 首次增加的表述，以早期官方公告为准。
- 机制：比较拉取请求前后依赖图中的包与许可证，覆盖检测到的传递依赖。Active 可拦截，Evaluate 本身按该规则不拦截，但别的评审注释解决要求可能仍影响合并；出现注释不自动等于发起例外申请。
- 边界：元数据可见性限制检查范围；通过配置的政策不等于所有实际分发/修改/商用场景获得法律免责。许可证风险分类是信息，不是法律意见。批准组织内例外不改变原许可证条款。
- 未将 API 可查询写成每个编码 Agent 自动使用；未编造检测准确率、独立性能/工时指标或政策自动正确性。不包含购买号召、价格推广或品牌宣传性结论。

## 封面、解释图与内容筛选

三个历史封面均已实际取回并查看，但没有核验到可供本站广泛转载的明确授权，因此本批不继续使用这些外部图：SiteGuard 的安全主题图库插画、OpenCode 标识图、GitHub 示例界面图。网络可访问不等于拥有转载权；不复制原图或其中人物、标识和界面元素。

本批改为本站原创解释性流程图：

- `images/news/siteguard-evidence-before-patch.svg`：核对暴露、保存诊断、修复并调查，明确修复不等于清除既往入侵。
- `images/news/opencode-provider-key-response.svg`：确认通知范围、在签发方撤销/替换、核账与更新应用，明确 1.4% 的分母。
- `images/news/github-license-policy-checks.svg`：识别依赖、比较政策、人工处理例外，明确通过策略不等于普遍法律认可。

三图均已实际渲染并查看，文字完整、边界说明可读，不包含真实凭据、用户资料或内部界面。图注写明为解释性重绘，不表示实验数据或取证截图。正文内 visual 亦为本站重绘流程。新封面由站点托管，发布后的外网可访问性需随本批发布核验，不把尚未发布的文件声称为已在线。

三篇的正文、五语言摘要调整、图示及参考链接均经内容复核：属于有明确事实与机制的安全事件或软件治理更新，没有采用广告、促销导购、返利、色情、赌博、毒品内容及相关引流。保留公开产品名、标准漏洞编号和机构名，删除不必要的凭据片段及操作过程。未转载原文长段或客户通知截图；译文保留相同日期、比例分母、证据归因及限制。全文是本站根据核实资料重新组织的解释，未声称进行过独立入侵测试、实测或采访。
