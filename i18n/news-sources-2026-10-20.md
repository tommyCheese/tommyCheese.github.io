# 2026-10-20 新闻更新与补录核验

沿用 `i18n/README.md` 的选题、五语言、标签、真实日期和内容过滤配置。按真实上海日期 **2026-10-20** 整理，新增 **4 条**，原有 27 条对象保持原样，累计 **31 条**。收到补齐近几日新闻的要求后，额外检索 10 月 18—20 日；新增原文日期为 **18 日 1 条、19 日 3 条**。20 日检索未确认可加入的当日首发，不把聚合页日期、事件发生日期或收录日期冒充原文发布日期，也不创建空日期分组。

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
