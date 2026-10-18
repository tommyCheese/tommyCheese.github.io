# 新闻来源核验：2026-10-19

本次实际上海日期为 **2026-10-19**（触发时间为 UTC 10 月 18 日 18:55，上海已是 19 日），新增 **4 条**，撤下 **0 条**，保留原有 23 条，共 **27 条**。先读 `i18n/README.md`、`news.json`、10 月 17—18 日来源记录与 17 日全量撤稿清单，按事件、原文 URL 和 ID 去重；未重新上架撤稿。开始时仅有 `.idea/` 和 `clean-architecture-prototype/` 未跟踪，不纳入提交。

检索优先覆盖 17—18 日，另补录 15—16 日仍有新闻价值、尚未收录的安全修复和航天技术数据。**没有把补录日期写成原文发表日期**，也没有为当天日期或类别配额凑稿。`updated_at` 为 19 日；各篇原文日期分别为 17、16、15、15 日。

## OpenCode Console 安全事件

- 新增 ID：`opencode-console-provider-key-breach`；标签 `software`。
- 已阅读全文：[Notebookcheck 原文](https://www.notebookcheck.net/OpenCode-hacked-users-urged-to-revoke-their-API-keys.1426957.0.html)，页面注明 Published **10/17/2026**，末尾另有 Update 10/18，采用首次发表日期 17 日。
- 原始披露：[OpenCode 官方账号公告](https://x.com/opencode/status/2111519637049319818)。X 普通网页读取失败，随后通过 X 自有公开嵌入数据[syndication 接口](https://cdn.syndication.twimg.com/tweet-result?id=2111519637049319818&lang=en&token=0)取得 HTTP 200 JSON，核对账号 `opencode`、公告 ID、`created_at=2026-10-17T18:08:06.000Z`、1.4% 的 Console 用户及关联外部服务的账户子集。接口正文到“external providers”截断，**没有声称读到完整长帖**；调查状态与旧系统密钥可能暴露的描述归于已完整读取的 Notebookcheck 报道，不把长帖剩余部分当作直接核验内容。
- 新闻增量：安全事件已获项目官方确认，独立报道介绍旧系统未授权访问与第三方密钥可能暴露。比例是全部 Console 用户的 1.4%，不是外部提供商账户的 1.4%，也不是所有本地 CLI 用户。仍在调查，不宣称攻击者身份、全部密钥泄露、总损失、已完全修复或所有密钥已失效。未经独立核实的用户账单金额不写进卡片。
- 配图：[官方站分享图](https://opencode.ai/social-share.png)，由 `opencode.ai` 的 `og:image` 指定。GET 及 HEAD 均成功，HTTP 200、`image/png`、14,238 字节，1280×721。已实际查看：项目名称、开源编码代理的说明文字，无价格、购买号召或活动；用作项目标志图，不能当作泄露现场截图。署名 OpenCode，完整展示。
- 筛选：正文是安全事件报道，未采用导购或品牌宣传。正文及目标外链中用于报道的内容、采用图片未见广告促销、色情、赌博、毒品及相关交易推广、引流或擦边内容；统一页脚的联盟营销声明与新闻事实分开判断，不复制为站点卡片内容。

## ESA Juice：JANUS 在轨相机测试图像

- 新增 ID：`esa-juice-janus-africa-flyby-images`；标签 `science`。
- 已阅读全文：[ESA 原文](https://www.esa.int/ESA_Multimedia/Images/2026/10/Fly_over_Africa_with_Juice)，可见日期 **16/10/2026**。通过原文链接另读 [DLR 的仪器测试报告](https://www.dlr.de/en/latest/news/2026/say-cheese-juice-snaps-flyby-photos-of-earth-and-moon)，发布日期同为 16 日；DLR 是任务参与机构，作为另一份原始技术说明交叉核对，**不冒称独立报道**。[ESA 官方 Flickr 同篇](https://www.flickr.com/photos/europeanspaceagency/55592860709)也注明上传于 16 日。
- 新闻增量：发布 JANUS 地月飞掠试验数据与处理方法。约 40 帧 RGB 图像按探测器位置和指向投影、拼接成 250—300 公里宽的非洲条带；整个多日观测取得 740 张图像并使用全部 13 个滤镜。DLR 说明测试还检查杂散光、不同视尺寸下的成像表现。卡片强调测试数据，未写成新的木星或冰月研究发现。
- 日期与边界：飞掠发生在 **9 月 28 日**，观测窗口至 10 月 2 日；16 日是本次公开图像及技术说明的发布日期。条带像素尺度随距离约为 150—375 米，不能扩写为全程统一分辨率。不是活动日历、任务预热或商业产品推介，技术增量是已取得的相机试验结果，不是仅凭图片好看入选。
- 配图：[ESA 原文分享图](https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2026/10/fly_over_africa_with_juice/27579386-1-eng-GB/Fly_over_Africa_with_Juice_pillars.png)，原文 `og:image`。GET/HEAD HTTP 200、`image/png`、4,192,660 字节，2798×1080。已实际查看，为非洲底图上的观测条带，无商业或不当内容；署名 **ESA/Juice/JANUS · L. Penasa · CC BY-SA 3.0 IGO**，完整展示，不裁去地理上下文。图片未修改，原文许可入口保留。
- 筛选：原始科学仪器测试、实际图像与处理说明，未采用产业承包商宣传或未来性能承诺。已检查正文、任务与仪器来源链接及采用图片，不含广告、色情、赌博、毒品及相关推广引流。

## Chrome 155 桌面安全更新

- 新增 ID：`chrome-155-prerender-security-update`；标签 `software`。
- 已阅读全文：[Google Chrome Releases 原文](https://chromereleases.googleblog.com/2026/10/stable-channel-update-for-desktop_01886704284.html)，明确 **Thursday, October 15, 2026**。另读独立媒体 [Security NEXT 10 月 16 日报道](https://www.security-next.com/191540)，核对版本、修复数量及 Critical 等级；不能以 16 日转载日期或 18 日聚合日期替代原文日期。
- 新闻增量：修复 10 项安全问题，包括 Prerender 的释放后使用问题 **CVE-2026-110922**（Critical），以及 DOM、V8 等问题。Windows/Mac 版本 **155.0.8059.84/.85**，Linux 为 **155.0.8059.84**。这是不同于 13 日版本的修复批次，站点此前未收录。
- 边界：官方说明分批推出，部分漏洞细节暂不公开；未确认遭在野利用。卡片不把漏洞细节未公开写成没有风险或已经零日利用，不提供利用过程，也不把桌面版本扩写成所有平台同一版本。
- 配图：[公告页使用的 Google 标志](https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_284x96dp.png)。GET/HEAD HTTP 200、`image/png`、13,804 字节，568×192。已实际查看，只有 Google 标志；标明 Google，完整展示，不声称是漏洞截图或 Chrome 新功能界面。未采用页面中的广告跟踪像素。
- 筛选：防御性安全更新，具备修复版本与漏洞编号，非浏览器下载导购或产品营销。正文、事实链接、采用图片未见广告促销、色情、赌博、毒品及相关推广引流。

## NASA Artemis II：隔热罩飞行后工程评估

- 新增 ID：`nasa-artemis-ii-heat-shield-assessment`；标签 `science`。
- 已阅读全文：[NASA 原始工程说明](https://www.nasa.gov/missions/artemis/artemis-2/rigorous-analysis-confirms-nasas-artemis-ii-heat-shield-performance/)。可见 **Oct 15, 2026**，元数据 `article:published_time=2026-10-15T10:57:21-04:00`；补充阅读独立媒体 [NeoTeo 10 月 16 日报道](https://www.neoteo.com/en/nasa-says-artemis-ii-heat-shield-performed-in-line-with-predictions)，区分统计数字、NASA 归因与仍在继续的分析。
- 新闻增量：后续飞行后评估与轨迹修改效果。NASA 记录 Artemis II 隔热罩 9 处炭化层脱落、Artemis I 为 103 处，并报告再入下航程缩短后裂纹与脱落减少，整体热防护与飞行前预测相符。卡片将结论归于 NASA，不把观察点数的比值写成自行测得的总体风险下降比例。
- 边界：这是对 **4 月任务**的新评估，不能写成 10 月刚完成绕月飞行。试样提取、材料测试和热分析仍在进行，不宣称隔热罩零损伤、所有问题永久解决或后续任务免于验证。未加入品牌承包商推介、任务日程或未发生的任务结果。
- 配图：[NASA 原文对比照片](https://www.nasa.gov/wp-content/uploads/2026/10/combineda1anda2-heatshield4k.jpg)。GET/HEAD HTTP 200、`image/jpeg`、2,196,437 字节，4000×1333。已实际查看，左为 Artemis I，右为 Artemis II 的拆卸后隔热罩；署名 **NASA**，完整展示两侧，不用单张裁图替代对比。图片无商业或不当内容。
- 筛选：可核查的工程检查与测试结果，非品牌案例、产品宣传或报名预告。已核对正文、引用与目标链接和采用照片，没有广告促销、色情、赌博、毒品及相关推广、交易引流或擦边内容。

## 选择与分布

- 新增 4 个事件涉及 **OpenCode、Google、ESA/JANUS 团队、NASA**，各 1 条；Notebookcheck 与 Security NEXT 等提供独立报道参考。一家公司没有主导本批。
- 主题为开发工具凭据安全、浏览器漏洞修复、在轨相机测试及航天器热防护工程；`software` 2 条，`science` 2 条，沿用适用标签，不创建同义碎片标签。
- 搜索发现的日历、活动报名、品牌周年回顾、产品卖点和无新增分析的每日图片未收录。研究栏目每日数量规则与数据不改动；不以新闻新增代替前沿研究任务。
- 本轮不对未重新阅读全文的历史新闻追加“已复核”标记，也不凭旧来源文档重新上架。来源记录与卡片中的原始日期一致。

## 构建与验证

- 五语言构建完成；新闻检查通过：27 条、9 个原文日期分组、5 种语言，首页最近三条和来源链接一致。
- 多语言检查 40,630 项通过；阅读检查使用 `--check-unchanged`，正文与链接保持完整；标签数量与检索检查通过；研究检查仍为原有 67 条、10 月 6—18 日逐日不少于 5 条，研究数据未改。
- 日期与标签筛选、地址恢复、搜索跳转及语言切换共 28 项 JavaScript 测试通过；Linux 共享入口集成检查通过；`git diff --check` 通过。
- 构建按共享字典内容更新全站 UI 缓存版本。审计结果：235 个页面只变更缓存版本；实质页面变更限于五语言首页、新闻页、标签总览，加上新闻元数据与五语言字典。站点地图已通过现有构建核对，未增删规范页面 URL，因此文件无差异。未混入 Linux 练习、研究内容、其他未提交项目或未跟踪目录。
