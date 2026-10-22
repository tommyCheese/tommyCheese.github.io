# 2026-10-23 今日要闻来源与筛选记录

本次按上海时间 2026-10-23 整理。起始 HEAD 为 `eef379e1`，新闻 43 条、7 个标签；Git 仅有 `.idea/`、`clean-architecture-prototype/` 两个既有未跟踪目录。已先读维护说明、新闻数据和最近来源记录，并与远端 main 核对。**本批新增 3 条、撤下 0 条，合计 46 条。** 原文日期为22日1条、21日2条；全部 `collected_at=2026-10-23`，`updated_at=2026-10-23`。不生成没有原文的23日空分组，不改研究数据或研究任务规则。

## 1. MAX 源码公开与许可边界

- ID：`modular-max-source-available-license`；标签 `ai`；原始日期 **2026-10-22**。
- 实际阅读 [Modular 原始说明](https://www.modular.com/blog/max-license)、[26.7 发布说明](https://www.modular.com/blog/26-7)、[MAX 许可全文](https://www.modular.com/legal/max-license)、[公开仓库 MAX 目录](https://github.com/modular/modular/tree/main/max)、仓库 README、LICENSE 及 `Licenses/MAX_LICENSE`。两篇公告页均明确标注22日，许可文件修订日为21日；不把许可修订日当作公告日期。
- 核对 [Phoronix 独立报道](https://www.phoronix.com/news/Modular-MAX-Complete-Open)，22日14:32 EDT，已早于本次核验。新闻增量为图编译器、运行时和硬件后端实际公开及新许可，而非发布会预告或性能宣传。仓库目录含 `driver`、`include`、`lib`、`mojo`、`python` 等，README 与根 LICENSE 可直接访问。
- 明确写作“源码公开”，不等同于无条件开源。新许可第1节允许免版税商用及目标代码分发，限制修改源码公开分发（向上游贡献的 fork 有例外）和把 MAX 用于 AI 辅助替代实现；不限制 AI 阅读、分析或改进 MAX。第3.3节对商业托管服务有品牌标识要求。原 Apache 组件按各自许可继续适用。
- **独立报道有一处概括不准确**：将商业托管推理服务列为不允许项，原始公告及许可实际规定的是标识条件。本批以许可原文为准，不复制该错误，也不扩写成法律建议。不收录未经独立复现的性能倍数、合作邀约、报名、安装或购买号召。
- 配图：[官方公告图](https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a82c/6ada33a38fa22d25cecfaab5_ProductReleaseBlogPost-Option_9.1.jpeg)，GET 200，`image/jpeg`，1361904字节，1920×1080。已实际查看：MAX 名称及“Source available now”发布示意，无价格、优惠、购买引流或不当内容；仅作为来源配图，不当作许可自由程度的证据。署名 `Modular · MAX source availability announcement`，完整显示。
- 筛选通过：实际软件源码及许可变更，有可查仓库、原始条款及独立报道；摘要保留限制，无产品推荐或无依据赞誉。所采事实、标题摘要、外链文章和配图已复核，无色情、赌博、毒品及相关推广、交易引流或擦边内容。

## 2. Linux 7.4 用户内存访问接口清理

- ID：`linux-74-uaccess-legacy-removal`；标签 `software`；原始日期 **2026-10-21**。
- 阅读 [Torvalds 原始合并提交](https://github.com/torvalds/linux/commit/22a78a25438d246e4e951960523bee6a5155897d)的完整说明，及 [Phoronix 21日报道](https://www.phoronix.com/news/Linus-Kills-Get-Put-User-Linux)。GitHub commit API 的 author、committer 时间均为 `2026-10-21T17:19:30Z`；报道为21日17:11 EDT。保留21日原始日期。
- 合并分支包含48项提交。旧接口不检查用户地址范围；迁移按用例采用 scoped user access、正常 get/put 或 get_kernel_nofault 等接口，不说成一律替换为同一种函数。通用代码的旧调用清理完成，整套接口最终移除仅针对 x86；arm64 等其他架构仍有保留。文章标题的概括不能盖过原提交的架构限定。
- 这是已合入主线的7.4开发变更，不称7.4稳定版已发布，不把所有架构说成已删除，不推断新增漏洞编号、在野利用或性能提升倍数。AI 辅助代码转换仅作为原文背景，不当作安全保证或模型宣传。
- `git.kernel.org` 对抓取返回403，改读公告所指同一哈希的公开 GitHub 镜像及 API，未绕过访问控制。Python本地证书链读取失败后使用正常 TLS 校验的系统 curl，未关闭证书验证。
- 配图：[报道内代码对比图](https://www.phoronix.net/image.php?id=2026&image=get_put_user)，GET 200，`image/webp`，15466字节，498×256。已实际查看，为红绿代码调用对比，无广告或不当内容。署名 `Phoronix · user access code comparison`，完整显示。另一个候选分类图URL返回403，未采用。
- 筛选通过：有原始提交和独立报道的内核维护进展，非产品软文。标题、摘要、原文和所用图片无色情、赌博、毒品及相关推广、引流或擦边内容；不展示攻击操作。

## 3. KLS 证明中的人类引导 AI 研究过程

- ID：`microsoft-kls-human-directed-ai-proof`；标签 `science`；原始日期 **2026-10-21**。
- 实际阅读 [Microsoft Research 21日说明](https://www.microsoft.com/en-us/research/blog/solving-a-31-year-old-grand-challenge-in-mathematics-the-kls-conjecture/)，页面可见日期及 `article:published_time=2026-10-21T16:00:00+00:00` 一致。本条是21日公布的研究过程说明，**不是23日才证明猜想，也不是21日才首次发布论文**。
- 阅读 [Zhao Song、Xinzhi Zhang 论文摘要与版本记录](https://arxiv.org/abs/2610.01447)及 [v2 正文前3页](https://arxiv.org/pdf/2610.01447v2)。初版为10月1日，v2为10月4日21:21:03 UTC；正文封面另写10月2日，本批不以封面草稿日替代 arXiv 提交记录。v2给出各向同性对数凹分布的维度无关 KLS/Poincaré 常数界；方法为递归改进并控制累计损失，属于理论证明，不是实际机器学习应用性能实验。
- 阅读 [Bizeul、Klartag、Lehec 的平行证明摘要](https://arxiv.org/abs/2610.05474)，10月4日提交，明确采用 Song、Zhang 的高阶导数判据。另读 [TSN 对研究过程的独立报道](https://tsnmedia.org/microsoft-kls-conjecture-ai-proof/)，据此核对新闻增量及人机贡献边界；事实仍以论文和机构说明为准。
- AI 探索、推导和检查由研究者引导，研究者选择方向、组装和核验论证。机构说明未公开所用模型；不写“AI独立证明”，不把自述对照试验泛化为所有AI的能力结论。论文按公开预印本描述，缺少论文录用信息，**不凭 arXiv 收录推断是否已同行评审，也不写成已获会议录用**。未核验所有 Lean 文件，不声称本批已完整形式化验算140页证明；摘要不采纳该宣传性延伸。作者姓名保留拉丁字母，避免猜测中文姓名。
- 配图：[原文几何示意图](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/10/KLS-illustration-scaled.png)，GET 200，`image/png`，533771字节，2560×1520。已实际查看，为平面切割和曲面切割的简化图，无品牌广告、价格或不当内容。署名 `Microsoft Research · simplified KLS geometry illustration`，完整显示，不当作一般性命题的数学证明。
- 筛选通过：公开原始论文、清楚方法与理论边界的研究解读，有平行论文和独立报道，非缺乏研究增量的品牌宣传。删除宣传措辞、论坛活动和产品页推荐；所采标题、正文事实、链接及配图无色情、赌博、毒品及相关推广、交易引流或擦边内容。

## 覆盖与去重

本批涉及 Modular、Linux 开源社区、Microsoft Research 与独立数学研究者，三个新闻主题为推理框架源码与许可、操作系统接口安全、AI辅助数学研究，分别使用 `ai`、`software`、`science` 既有标签。没有新增碎片标签，也未让一家公司的消息主导本批。

已核对43条既有新闻及研究元数据，无同事件重复。PHP、Node.js、Mozilla证书、Onamae等已收录内容不再重复添加；网上“Black October”汇总未当作新事件。另检索航天、半导体和数码来源；发布会预告、手机/手表上架、价格促销、汽车卖点、品牌活动和缺少可核实增量的稿件排除。新闻无最低数量要求，不为补分类凑稿。本批只复核候选及新增三条，不声称全量重新验证所有历史外链。

## 构建与验证

- 现有构建成功：50页×5语言，新闻46条、14个真实原文日期分组、7标签，首页预览和原文链接一致。站点地图由构建核对，未新增规范路径，无需产生文件差异。
- 新闻、多语言42470项、阅读正文不变、标签及共享 Linux 实验室入口检查通过；日期筛选、标签交集、搜索、语言切换28项 JavaScript 检查通过，`git diff --check` 通过。
- 研究检查通过：93条、9标签，既有10月6—22日每日不少于5条；研究数据不变。本轮为新闻任务，不声称完成23日研究精选。
- 逐对象比较43条旧新闻全部保持不变，旧字典所有键值和标签配置保持不变；新增仅为3条新闻及30项五语言标题摘要。生成HTML中235页只更新共享缓存版本，15个实质页面为五语言首页、新闻页及标签总览。
- 仅提交本批元数据、五语言文案、来源文档及生成页面；既有未跟踪目录保留原样。
