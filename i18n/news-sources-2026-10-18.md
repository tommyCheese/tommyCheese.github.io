# 新闻来源核验：2026-10-18

整理日期采用上海时区 2026-10-18。本批新增 **4 条**，保留原有 19 条，共 **23 条**。新闻继续按来源真实发布日期归档，不把本次更新日期当作原文发布日期。核验前已阅读 `i18n/README.md`、新闻历史记录以及 `news-review-2026-10-17.md` 的撤下清单；四条新增均不重复，也不重新上架已撤下内容。

## GitHub：企业级开源许可证检查正式可用

- 新增 ID：`github-license-compliance-ga`；建议标签：软件与开源（`software`）。
- [GitHub Changelog 原文](https://github.blog/changelog/2026-10-16-open-source-license-compliance-generally-available/)，页面明确发布日期 **2026-10-16**。
- 已阅读全文。更新提供企业级依赖许可证策略，并可用合并规则检查 PR 新增或变更的依赖。新增策略变更审计事件、策略管理 API 与包合规查询 API。
- 范围限制：面向 GitHub Enterprise Cloud（含数据驻留版本）且已启用 Code Security 的仓库，不能写成所有免费仓库默认提供；不宣称自动保证许可证合法性。
- [原文配图](https://github.blog/wp-content/uploads/2026/10/613833573-be40bdee-f6b9-49d6-945d-68ff04006833.jpg?resize=2064%2C1096)：HTTP 200，`image/jpeg`，134457 字节。已实际查看，为许可证告警、依赖详情及审批时间线界面，署名 **GitHub**；建议 `image_fit: contain`。
- 筛选结果：真实功能发布，有明确使用范围、API 与策略行为增量，非导购、优惠或品牌案例。正文、目标外链及采用配图未见色情、赌博、毒品性质及推广引流内容。页眉/页脚的统一产品入口不作为新闻事实，卡片不采用购买号召。

## NASA：夜光遥感记录飓风后供电恢复

- 新增 ID：`nasa-black-marble-isaias-power-recovery`；标签：科学与遥感（`science`）。
- [NASA Earth Observatory 原文](https://science.nasa.gov/earth/earth-observatory/isaias-dims-the-gulf-coast/)，页面与 `article:published_time` 确认 **2026-10-16**（元数据 `2026-10-16T00:00:00-04:00`）。
- 已阅读全文。Black Marble HD 采用 NOAA-20 的 VIIRS 夜光观测并叠加 Landsat 9 底图，对比佛罗里达狭长地带 10 月 11、12 日的夜间灯光；显示 Pensacola—Destin 一带停电和恢复的空间分布。处理包括月相、大气、地表变化与杂散光校正。
- 范围限制：10 月 11、12 日是图像观测日期，不能写成本次发表日。云层会形成缺测；持续亮灯的地点可能涉及备用电源等原因，但影像本身无法确认。数据用于补充地面停电报告，不替代现场核验。卡片聚焦遥感技术和公开数据，不扩写灾情推断。
- [采用原文地图](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/iotd/2026/isaias-dims-the-gulf-coast/isaias_bmhd_20261011.jpg)：HTTP 200，`image/jpeg`，157637 字节。已实际查看，为 10 月 11 日夜光地图，标注缺测云区与城市，不含商业推广；署名 **NASA Earth Observatory / Lauren Dauphin**，底层 Black Marble HD 数据由 Ranjay Shrestha/NASA GSFC 提供，Landsat 数据来自 USGS；建议 `image_fit: contain`。
- 筛选结果：公开科学观测和灾害响应数据应用，有实质方法与限制，非品牌推广。已检查正文、数据来源链接及配图，没有色情、赌博、毒品性质及相关推广引流内容。

## Ollama：0.40.6 的进程清理和 GGUF 兼容性修复

- 新增 ID：`ollama-0406-gguf-windows-fixes`；建议标签：软件与开源（`software`）。
- [官方正式发布](https://github.com/ollama/ollama/releases/tag/v0.40.6)，HTML `relative-time` 明确 **2026-10-16T22:00:46Z**，原文日历日期 **2026-10-16**（上海已是 17 日）；按站点既有原文日期口径记录 16 日，不写成 18 日发布。
- 已读版本说明及其原始 PR：[Windows 进程清理 #18500](https://github.com/ollama/ollama/pull/18500)、[Q2_0 类型支持 #18967](https://github.com/ollama/ollama/pull/18967)、[--ask 问题键 #19041](https://github.com/ollama/ollama/pull/19041)。
- Windows 更新用带退出终止选项的 Job Object 管理推理子进程，针对命令行 `ollama serve` 被强制结束后的残留进程；PR 明确桌面应用的正常退出已有清理。GGUF 读取器加入 Q2_0 张量/文件类型，解决此前相关文件导入或加载失败。版本同时调整 `--ask` 模式的问题键为标识符。
- 范围限制：这是进程生命周期与文件兼容性更新，不据此宣称模型速度、精度、显存或通用性能提升。Q2_0 PR 的模型运行测试为作者在 Apple silicon 上报告，不能扩写为所有硬件都已独立验证。官方 API 读取本轮返回 403，日期直接由可访问的正式发布页 HTML `datetime` 核验。
- [官方发布页分享图](https://opengraph.githubassets.com/d7fd87977c01d38ac9933547a226df74b34bbd1c8b1ef18d787d8b0aa0e95efc/ollama/ollama/releases/tag/v0.40.6)：HTTP 200，`image/png`，67225 字节。已实际查看，包含版本号、变更摘要与项目标识；署名 **Ollama / GitHub**；建议 `image_fit: contain`。
- 筛选结果：开源项目正式发布，有可追溯代码变更；卡片只采用实际修复和兼容性事实，不采用云服务购买或营销内容。正文、PR、正式发布外链及图片未见色情、赌博、毒品性质或推广引流。

## Mozilla：Firefox DevTools MCP 的 PDF 与标签操作更新

- 新增 ID：`mozilla-devtools-mcp-0106-pdf-tabs`；标签：软件与开源（`software`）。
- 已读 [Mozilla 开发者原始公告](https://discourse.mozilla.org/t/firefox-devtools-mcp-0-10-6-released/149832)与 [v0.10.6 正式发布说明](https://github.com/mozilla/firefox-devtools-mcp/releases/tag/v0.10.6)。公告 HTML `time` 为 **2026-10-16T16:08:47Z**，发布页同为 16 日，按 16 日归档。
- 新增 `print_page`，按打印 CSS 导出 PDF，可设置横向与背景；标签枚举迁移至 WebDriver BiDi，避免查询时逐个激活标签；已创建的 MCP 配置文件可直接复用。只概括已发布的开发工具行为，不把它写成 Firefox 浏览器本体版本更新或性能宣传。
- [公告分享配图](https://us1.discourse-cdn.com/flex001/uploads/mozilla/original/3X/1/8/180ccfafb4284e125acb62e88c091db07e8a77bb.png)：HTTP 200，`image/png`，6512 字节，512×512。已实际查看，为黑底绿色 Mozilla 旗标，署名 Mozilla，`image_fit: contain`；这是项目标志，不是新功能截图，图片上传日期不作为新闻日期。
- 筛选结果：原始发布说明具有工具功能与修复增量，无导购、优惠或购买号召；正文、外链和采用配图不含广告及色情、赌博、毒品性质内容或相关引流。

## 排除与日期说明

- ESA 媒体邀请、黑客松报名、会议和活动日程不作为本批新闻增量。
- 没有采用仅转述开源模型爆料、无法直接读取原文的内容，也没有用搜索摘要替代原始事实核验。
- NASA Hubble 当日星系图片未选入本批，避免把单纯图片展示当作新的研究结论。
- Meta 商业条款更新未采用：原始条款跳转登录，原始采访报道本轮无法完整读取；不以聚合摘要补足事实。

## 标签、批次与验证

四条分别来自 GitHub、NASA、Ollama、Mozilla，没有由一家公司的消息主导。主题为许可证策略检查、遥感数据应用、本地模型工具兼容性和浏览器开发工具；软件与开源 3 条，科学与遥感 1 条。四篇原文均发表于 16 日，本次真实整理日期为 18 日，不为制造“当天新闻”改写原始日期。

新闻标签从 `i18n/news.json` 顶层 `tags` 统一读取，新增 `software` 与 `science` 并同步五语言名称。保留原有四类标签 ID 和链接；页首、卡片、标签总览及数量检查均使用该配置。新闻介绍改为科技、计算机与相关产业的开放范围，标签不再限制选题。

已完成五语言构建；新闻、多语言、阅读正文完整性、标签目录、研究每日数量和 Linux 入口集成检查通过，28 项 JavaScript 日期筛选、搜索与语言测试通过。全部 19 条合格历史记录保留，研究元数据未改动；其他任务的未提交工作不纳入本次提交。
