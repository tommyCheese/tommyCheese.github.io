# 2026-10-20 新闻更新与补录核验

沿用 `i18n/README.md` 的选题、五语言、标签、真实日期和内容过滤配置。按真实上海日期 **2026-10-20** 整理，新增 **4 条**，原有 27 条对象保持原样，累计 **31 条**。收到补齐近几日新闻的要求后，额外检索 10 月 18—20 日；新增原文日期为 **18 日 1 条、19 日 3 条**。首轮检索未确认20日当日首发（后续补充见下文），不把聚合页日期、事件发生日期或收录日期冒充原文发布日期，也不创建空日期分组。

## Rank Math PRO 安装包供应链事件

- ID：`rankmath-pro-supply-chain-incident`；`software`。
- 已读 [BleepingComputer 10 月 19 日报道](https://www.bleepingcomputer.com/news/security/wordpress-seo-plugin-rank-math-compromised-to-backdoor-websites/)及其引用的[厂商原始事件说明](https://rankmath.com/kb/pro-3-0-123-security-incident/)。命令行读取报道返回 403，网页读取成功；不把命令行失败写成原文不可访问。
- 仅特定下载窗口的 PRO 3.0.123 受影响；免费版不受本事件影响。干净版本不自动清除已经植入的持久化后门。未知攻击规模与归因不写入卡片。
- [原文配图](https://www.bleepstatic.com/content/hl-images/2026/06/18/WordPress.jpg)：GET 200，image/jpeg，124441 字节。已实际查看，为 WordPress 链条概念插图，无不当或促销内容；署名 BleepingComputer，注明 illustration，不当作入侵实景。

## NASA 冲击与振动分析

- ID：`nasa-standardized-shock-vibration-analysis`；`science`。
- 已读 [NASA 10 月 19 日工程说明](https://www.nasa.gov/centers-and-facilities/kennedy/nasa-improves-shock-vibration-analysis/)，可见日期 19 日；元数据 `2026-10-19T15:28:32-04:00`，原文日期保持 19 日，收录 20 日。
- 入选依据是已经用于火箭认证的有限元工作流与运输冲击风险检查，不是品牌软件案例推介。不引用宣传措辞、不推断统一节省比例、不声称模型替代全部实体试验。
- [原文照片的 1200 像素版本](https://www.nasa.gov/wp-content/uploads/2026/10/ksc-20260924-ph-rcr01-0036.jpg?w=1200)：GET 200，image/jpeg，268962 字节。已实际查看，为工程师查看有限元网格；署名 NASA / Clayton Rougelot，完整展示。

## Euclid 发现此前未知彗星

- ID：`euclid-first-new-comet`；`science`。
- 已读 [ESA 10 月 19 日原文](https://www.esa.int/Science_Exploration/Space_Science/Euclid/Euclid_discovers_new_comet)。区分 9 月图像、10 月 8 日确认与 19 日报道；不把它说成 Comet Interceptor 的既定目标。
- [配图说明与许可](https://www.esa.int/ESA_Multimedia/Images/2026/10/Comet_C_2026_S1_Euclid_observations_in_context)：使用该页 `og:image`，GET 200，image/png，1368239 字节。已实际查看，为天区及彗星局部放大图，无广告或不当内容；完整展示并注明 ESA/Euclid/Euclid Consortium/NASA · M. Pöntinen et al. 2026 · CC BY-SA 3.0 IGO。

## 补录：SiteGuard 漏洞实际利用

- ID：`siteguard-statistics-exploitation`；`software`。
- 卡片目标是 [BleepingComputer 10 月 18 日报道](https://www.bleepingcomputer.com/news/security/hackers-exploit-siteguard-waf-flaw-to-run-commands-as-system-root/)，采用该报道真实日期，不声称漏洞首次在18日披露。
- 已交叉阅读 [JVN 原始公告](https://jvn.jp/en/jp/JVN88474777/index.html)及[厂商公告](https://www.eg-secure.co.jp/siteguard/news/alert-202610-1)，两者日期均为14日。官方确认实际利用与统计功能条件；按官方描述保留影响范围，不把它扩写成无条件、未认证的远程漏洞。修补可能抹去痕迹，因此摘要保留先保存诊断信息的提醒；不提供攻击步骤。
- [报道配图](https://www.bleepstatic.com/content/hl-images/2026/05/05/hacker.jpg)：GET 200，image/jpeg，287632 字节。已实际查看，为网络安全概念插图，无不当及促销内容；署名 BleepingComputer，注明 illustration，不声称照片中人物是攻击者。

## 筛选与覆盖

四条标题、正文、实际使用的外链与配图均逐项核对；正文分别是安全事件、工程方法应用和天体发现，具有事实增量。厂商与媒体导航、侧栏存在产品及广告入口，不复制进本站卡片；用于核验的正文及采用图片未见色情、赌博、毒品及其推广、交易引流或擦边内容。排除报名征集、营销导购、无独立信息的产品预热与重复 OpenCode 事件；没有为了填日期重新上架旧撤稿。

本次只复核新增项，不宣称重新全量核查所有历史外链。标签沿用 `software`、`science`；不改配置或筛选逻辑。

## 构建与验证

- 运行现有五语言构建；新闻检查通过：31条、11个日期分组、5语言，首页预览与外链一致。
- 研究检查通过：78条，10月6—20日逐日不少于5条，20日为5条。
- 多语言41360项、阅读正文不变检查、标签目录检查通过；语言切换与日期标签筛选14项测试通过；`git diff --check` 通过。
- 逐对象比较确认全部既有新闻、研究及五语言字典值保持原样。生成的博客HTML只更新共享缓存版本；实质内容限于五语言首页、新闻、研究、标签总览和研究专题摘要。工作区另有并行 Linux 实验室和页头修改，保留原样，不将其当作本次新闻成果。


## 后续补充：10 月 20 日当日新闻

再次检索并核对原文后，新增 **1 条**，31→**32 条**；首轮4条与此前历史保持原样。新闻页面新增真实的 **2026-10-20** 分组；并非把19日旧条目改日期。

### JAXA 确认 MMX 发射成功

- ID：`jaxa-mmx-h3-launch-success`；沿用 `science` 标签；`published_at` 与 `collected_at` 均为 **2026-10-20**。
- 已阅读全文：[JAXA 原始发射结果公告](https://www.jaxa.jp/press/2026/10/20261020-1_j.html)，明确日期2026年10月20日。公告记录日本时间4:41:03发射，约1小时11分13秒后正常分离MMX并投入轨道。独立交叉核对[中央社20日08:36报道](https://www.cna.com.tw/news/ait/202610200017.aspx)，区分发射成功与后续采样返回目标。
- 五语言卡片仅描述已完成的发射与分离，不把计划中的火卫一采样或地球返回写成已完成；公告中的轨道投入不扩写为已到达火星轨道。日本时间4:41相当于上海时间3:41，均是20日。
- 配图采用公告 `og:image` 指定的[JAXA 标志图](https://www.jaxa.jp/press/images/jaxa-thumb-240x240-2404.png)，GET 200，image/png，15942字节。已实际查看，为蓝底白色JAXA标志；注明 logo，完整展示，不把机构标志当发射现场照片。
- 已复核标题、正文、采用外链与图片，属于已发生的航天任务技术进展，无广告促销、黄赌毒或相关推广、交易引流、擦边内容；不采用8月发布的发射日程或海报宣传作为当天新闻。
- 其他筛选：IT之家20日的微软Guardian Agents报道追溯至[微软19日原文](https://blogs.microsoft.com/blog/2026/10/19/securing-the-agentic-insider/)，不以中文转载日期凑入20日。Airscope及科技兴商的20日转载也未在本轮冒充当日首次披露。

### 当日补充验证

五语言构建及新闻检查通过：32条、12个真实日期分组。多语言41390项、研究历史覆盖、正文不变、标签目录以及28项语言／筛选／搜索测试通过；旧31条新闻对象逐项保持原样。235个页面仅更新共享缓存版本，实质变更为五语言首页、新闻页及标签总览。`git diff --check` 通过；其他任务的改动不纳入提交。

## 晚间补充：CLI 供应链安全与 PyTorch 后端

按本次实际上海日期 **2026-10-20** 核验，新增 **2 条**，32→**34 条**，撤下 **0 条**。先核对现有全部 ID 与 URL；两项均为未收录事件，不将同一事件改写标题重复计数。原有32条对象保留原样；本轮只复核新增项，不声称全量重查历史链接。

### OVHcloud CLI 发布文件遭篡改

- ID：`ovhcloud-cli-release-assets-compromise`；`software`；`published_at`、`collected_at` 均为 **2026-10-20**。
- 已阅读全文：[BleepingComputer 原始报道](https://www.bleepingcomputer.com/news/security/ovhcloud-cli-releases-backdoored-on-github-to-steal-developer-secrets/)。页面可见日期20日07:31，JSON-LD `datePublished` 为 `2026-10-20T07:31:22-04:00`；事件发生于19日，不把发生时间当报道日期。网页读取工具失败后通过普通 HTTPS GET 成功读取正文，没有绕过访问控制。
- 原始证据：已读[发现者 GitHub issue #300](https://github.com/ovh/ovhcloud-cli/issues/300)，创建时间 `2026-10-19T13:50:09Z`。其观察到既有版本的二进制及校验文件被替换，而标签指向的源码提交未改变。另核对 [CEO 首次说明](https://x.com/olesovhcom/status/2112225308589834260)与[后续说明](https://x.com/olesovhcom/status/2112280116017471626)的 X 公开 syndication 文本；返回文本有截断，不宣称读到完整长帖。实际查看报道内嵌的后续说明截图，确认官方称 CI/CD 未受影响，原因是未启用 GitHub 发布不可变设置，现已启用。
- 版本范围 v0.11.0—v0.15.0 来自官方说明及报道；不声称这些版本在所有历史下载窗口都被污染。摘要限定19日被替换的下载文件，不扩大到所有云服务或源码仓库。执行过受影响包的用户仍需清理系统并撤销凭证；不误导为只升级即可清除入侵。不采用尚无充分证据的 GlassWorm 归因、攻击规模或窃取数量。
- 配图：[报道原始插图](https://www.bleepstatic.com/content/hl-images/2026/10/20/ovhcloud.jpg)，HTTPS GET 200，`image/jpeg`，50413字节，1600×900。已实际查看，为云与 OVHcloud 标志概念插图，无购物、色情、赌博、毒品及相关引流；署名 `BleepingComputer · illustration`，完整显示，不当作入侵现场照片。
- 筛选：属于可核验的供应链安全事件。原文插入的 BlueReport 推广、侧栏及导航广告均不采用；标题、摘要及采用图片不含广告促销与黄赌毒性质内容，不复制恶意载荷或执行攻击文件。

### TorchNeuron 原生 PyTorch 后端公开测试

- ID：`torchneuron-native-pytorch-trainium-beta`；`software`；`published_at` **2026-10-19**，`collected_at` **2026-10-20**。
- 已读 [PyTorch 技术原文](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/)，作者日期19日，`article:published_time` 为 `2026-10-19T12:45:23+00:00`；页面后续修改及20日公开测试不替代原始发布日期。
- 已读[官方公开代码库 README](https://github.com/aws-neuron/torch-neuronx)，现场可访问并标注 Beta，含安装方法和兼容性限制。实质增量是通过 PyTorch 原生设备扩展对接 Trainium2/3，支持 eager、torch.compile 和分布式训练；不是会议日程或预热海报。只读核验，未安装软件或执行仓库代码。
- 交叉阅读 [GeekWire 19日报道及对 AWS 技术负责人的采访](https://www.geekwire.com/2026/amazon-challenges-nvidias-software-advantage-with-new-tool-for-its-ai-chips/)，用于判断开发者迁移与芯片生态的新闻价值。该报道只代表采访与报道，不视为独立硬件基准。另检索到 TechCrunch 报道，但卡片事实以原始技术说明和实际仓库为准；不采用自动汇总页面作核心核验依据。
- 保留边界：编译图要求静态形状，新形状可能重新编译；部分算子回退 CPU 或不支持，float64 在计算路径按 float32 处理。卡片概括兼容性限制，不声称所有 PyTorch 代码无需改动、不引用品牌客户背书、成本节省或无独立验证的性能数字。原文测试采用缩小模型配置且有跳过项，不能视作完整生产负载普遍通过。
- 配图：[原文架构图](https://pytorch.org/wp-content/uploads/2026/10/AWS-TorchNeuron-image-1.png)，HTTPS GET 200，`image/png`，463690字节，1496×1005。已实际查看，展示 PyTorch、编译器、运行时与 Trainium 的结构，无促销价格或黄赌毒性质内容；署名 `AWS / PyTorch · architecture diagram`，完整显示。
- 筛选：入选依据是已公开的软件接口和可核对的支持范围；剔除正文客户案例宣传、价格性能承诺、报名信息及媒体赞助栏，不收录广告、购物导向及黄赌毒或相关推广引流内容。

### 本批覆盖与排除

两项分别涉及 OVHcloud，以及 AWS／PyTorch 开源生态，主题为供应链安全和 AI 计算软件。没有单一公司的多条稿件；延续当天已有 JAXA、NASA、ESA、Rank Math 等来源。沿用准确的 `software` 标签，不为新稿强造同义标签。本批 `updated_at` 保持本次真实日期20日。

另外核对 MITRE ATT&CK v20 官方更新页，其真实更新日期为13日；NGINX 相关聚合报道也未核实20日新增漏洞事实，均不以聚合页日期充作当天新闻。已收录的 MMX 发射事件不重复添加，不为补数量或分类收录营销稿。

### 晚间补充验证

- 五语言构建成功；新闻检查通过：34条、12个真实日期分组、五语言原文链接和首页预览一致。
- 多语言41430项检查、阅读正文不变、标签目录、共享 Linux 实验室入口均通过；日期与标签筛选、搜索、语言切换28项 JavaScript 测试全部通过；`git diff --check` 通过。
- 研究检查通过：78条，10月6—20日逐日不少于5条，20日5条；本轮不修改研究数据或每日任务。
- 逐对象核对原32条新闻保持原样，已有五语言键值不变。生成页面中235个仅更新共享缓存版本，15个实质更新是五语言首页、新闻页与标签总览；既有页头修复保留。仅纳入本轮新闻元数据、翻译、来源文档与对应生成文件；未跟踪的 `.idea/`、`clean-architecture-prototype/` 保留原样。
