# 站点多语言维护

## 中文命令实验室

`/linux-lab/` 是共享的简体中文任务练习页面，独立于多语言生成目录。构建会在五种语言的导航和首页增加入口，始终指向同一中文 URL。搜索 Linux、命令、终端或 shell 可跳转；不要给该路径添加语言前缀。课程、命令手册与验证方法见 `linux-lab/README.md`。构建后另运行 `python tests/check_linux_lab.py` 检查集成。

这是直接发布到 GitHub Pages 的静态站点。简体中文使用根路径，其余版本分别位于 `/en/`、`/ja/`、`/ru/`、`/zh-TW/`。每个地址均包含完整 HTML 正文，阅读不依赖 JavaScript。

## 更新内容

1. 编辑根目录下的简体中文页面。已有界面文案带有 `data-i18n` 标记，请在 `js/i18n-messages.js` 中同步修改对应键的五种翻译。
2. 每篇文章的四种译文放在 `i18n/<语言>/posts/<原始 slug>.html`，只包含 `<article>` 内的 HTML。保留标题 ID、代码、公式与技术标识符，正文、图注、图片替代文本需要翻译。繁体版已按台湾常用词汇转换并保留代码和公式。
3. 新文章还需要添加原文页面、原文 `index.json` 条目、各语言的 `post.<slug>.title` 与 `.description`。翻译文件缺失时构建会中止，避免发布空白译文。
4. 新增界面文本时，在五语言字典添加相同键，并通过 `data-i18n`、`data-i18n-aria-label` 等属性标记。`i18n/message-map.json` 只用于识别旧站点文案，新的页面优先直接标记。
5. 可编辑流程图的文字映射位于 `i18n/diagrams.json`。现有截图及历史插图保留原貌；示例代码中的注释与数学公式保持原文。

## 构建与验证

在仓库根目录运行：

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r scripts/requirements-i18n.txt
python scripts/build_i18n.py
python tests/check_i18n.py
node --test tests/i18n.test.cjs
```

构建器更新根目录中文页面并生成其余四种版本、各语言全文搜索索引和 RSS、canonical/hreflang、站点地图以及流程图。生成目录不应手动编辑。重复构建应产生相同结果。提交生成文件后推送到 GitHub，Pages 直接发布 `.nojekyll` 静态站点。

访问无语言前缀的首页时，浏览器优先使用已选择的语言，其次使用浏览器语言；带语言前缀的 URL 始终优先。语言选择会保留当前页面、查询参数和章节锚点。禁用 JavaScript 时可通过普通链接切换语言。

Ctrl+K（Mac 为 ⌘K）打开搜索与跳转，默认以两列紧凑布局显示常用页面入口，左右方向键切换入口、上下方向键切换行；输入首页、博客、专题、标签、关于或探索（也支持英文别名与当前语言名称）可匹配“功能跳转”。“文章搜索”读取当前语言的 `index.json`，仅展示博客文章，与页面入口通过分组、图标和类型标记区分。方向键选择、回车打开，跳转保留当前语言。输入和结果均以纯文本渲染，文章索引不可用时页面入口仍可使用。Markdown 下载链接明确标注为简体中文原文。各译文共享原文对应的 GitHub Discussions 评论串。

## 首页、专题与阅读导航

`scripts/reading_layout.py` 在同一构建流程中生成首页精选、最新文章、`/topics/` 专题页、RSS 入口、手机折叠目录及架构系列的上下篇导航。布局样式位于 `css/reading.css`，手机目录选择章节后的收起行为位于 `js/reading.js`；目录和专题在禁用 JavaScript 时仍可使用。

新增或调整精选文章时修改 `FEATURED`；专题文章与阅读顺序维护在 `TOPICS` 和 `ARCHITECTURE` 中。`index.json` 仍是文章元数据来源，日期从各文章页面的 `time` 元素读取。新增界面文案仍需在五语言字典中同步维护。构建会重建这些区域，请勿直接修改生成后的精选卡片、专题正文或上下篇导航。

完成构建后，另运行 `python tests/check_reading.py` 检查专题覆盖、目录锚点、系列顺序、正文完整性和站内链接。

## 今日要闻

顶部“今日要闻”与搜索入口跳转到当前语言的 `/news/` 新闻页。首页 `#today-news` 保留最近三条预览与“查看完整时间流”链接，预览卡片跳转到新闻页对应日期。新闻页按原文发布日期倒序分组，展示完整历史；每张卡片保留封面、标题、概述、来源、图片署名和原文链接，点击打开来源网站。

`i18n/news.json` 保存新闻 ID、分类、原文地址、封面地址、来源、发布日期和本次整理日期；顶层 `tags` 是新闻标签配置，条目的 `category` 引用其中一个标签。标签用于整理而非限定采集范围，科技、计算机及相关产业的合格新闻均可收录；按内容新增相关标签时同步 `news.category.<标签>` 的五语言名称，筛选和标签目录自动读取配置，保留原有标签 ID。标题与概述的五种翻译维护在 `js/i18n-messages.js` 的 `news.<ID>.title`、`news.<ID>.summary` 中。更新时追加新闻记录并保留历史，核对原文日期与图片可访问性；不把整理日期当作新闻发布日期，不为没有新闻的日期生成空分组。竖版海报可设置 `image_fit: "contain"` 完整展示。来源核验记录在 `i18n/news-sources.md` 与按日期保存的 `i18n/news-sources-YYYY-MM-DD.md`，内容仍为手动维护。

每次新增、补录或替换新闻或研究条目，必须在发布前复核标题、正文、外链和配图，并在当次来源文档记录筛选结果。色情、赌博、毒品性质的内容（包括相关推广、交易引流与擦边内容）一律不收录；发现已上线条目不合要求时立即撤下。

选题不得收录广告、促销导购、优惠返利稿，以及以产品预热、车型卖点、品牌案例或品牌活动推广为主且缺少独立新闻增量的内容。企业官网只用于确认事实，不能单凭官方来源认定值得收录；技术发布、研究、安全事件、财报及产业动态须有可核对的实质信息，摘要删去购买号召和未经验证的宣传结论。不为凑分类或日期而纳入营销稿。发现历史条目不符合要求时，应从新闻数据、五语言文案及生成页面撤下，并保留逐条复核记录；历史来源文档不作为重新上架的依据。全量复核见 [2026-10-17 新闻复核](news-review-2026-10-17.md)。

`scripts/build_i18n.py` 创建五种语言的新闻页、导航与站点地图；`scripts/reading_layout.py` 生成预览和时间流。修改后运行构建及 `python tests/check_news.py`，检查完整历史、日期排序与分组、首页预览、各语言入口与原文链接。搜索“今日要闻”“新闻”或 “news” 可跳转到新闻页，搜索弹窗默认推荐首页、博客、专题、标签、关于、探索、今日要闻、前沿研究八个入口，保持两列紧凑布局；无需输入即可选择新闻或研究，也支持对应关键词和当前语言名称跳转。

新闻和研究页共用 `js/reading.js` 的渐进增强筛选。页首与卡片标签均为可点击链接，单选标签与日期条件取交集，同时更新每日数量和空结果提示。日期支持全部、今天、近七天与“选择日期”；“今天”按上海时区计算。“选择日期”统一支持单日及含首尾的范围，点击应用按钮后生效。标签与已应用的日期条件保存在 `tag`、`period`、`start`、`end` 查询参数中，支持分享、刷新、返回、前进和切换语言；保留 `v` 等其他参数。日期锚点命中被筛选隐藏的日期时会清除筛选，使目标仍可访问。禁用 JavaScript 时保留完整静态时间流。运行 `node --test tests/news-filter.test.cjs` 检查标签、日期边界、范围校验、地址恢复与锚点行为。

## 前沿研究

`/research/` 与今日要闻使用相同的卡片和时间流风格。导航、专题目录、搜索及首页 `#frontier-research` 均提供入口；首页分别预览最近的论文／预印本、研究报告和会议论文。五个语言版本均生成完整静态页面。

`i18n/research.json` 是研究元数据与标签的唯一来源：顶层 `tags` 管理标签 ID，每条记录用 `tags` 关联一个或多个标签。`kind` 仅允许 `preprint`、`research`、`conference-paper`。**“会议”只指会议论文，不是会议日程、会期、时间线、DDL、征稿或报名信息；这些内容不得收录或计入数量。** 会议论文使用 `conferences` 和 `papers` 标签，并用 `venue` 写明主会、行业轨道或工作坊；来源须是论文、论文集、OpenReview 或原文录用注释。只有作者注释时写“作者注明”，不把工作坊录用升级为主会录用。标签及标题、摘要的五语言文案维护在 `research.tag.<tag>`、`research.<ID>.title`、`research.<ID>.summary`。

会议论文应主动扩大会议与领域覆盖，不能只检索 NeurIPS，也不以人工智能为收录前提。检索范围包括 SIGMOD、VLDB、ICDE 等数据库会议，KDD、SIGIR、WWW 等数据挖掘与信息检索会议，OSDI、SOSP、EuroSys、FAST 等系统会议，以及 ICML、ICLR、ACL、EMNLP、AAAI、IJCAI 等其他相关会议；以上为示例，不是封闭白名单。每次选题主动检索多个会议来源，在当次来源记录中说明覆盖范围和筛选结果，不为会议配额降低质量要求。

数据治理、数据库和数据系统均可收录，重点包括数据质量、血缘与溯源、元数据、数据集成、隐私与访问治理，以及查询优化、索引、事务、流处理、分布式数据库与存储。根据实际论文使用现有适用标签；确需新标签时同步五语言名称，不强行给非 AI 论文添加 AI 标签。录用证据、主会／行业轨道／工作坊区分、真实日期、去重及内容过滤规则保持不变。

每日最低收录量为 **5 条真实论文或研究成果，只能多不能少**。`coverage_start` 标明连续归档起点（当前为 2026-10-06），`minimum_per_day` 不得低于 5。每日精选使用真实的上海日期 `collected_at` 归档，`published_at` 始终保留原文真实发表日期，页面分别标注“发布于”“收录于”，不强求五条全是当日首发。历史未记录 `collected_at` 的条目仍按原文日期归档，不倒填虚假收录日期。每次更新 `updated_at` 时核对完整日期范围；`tests/check_research.py` 会逐日输出计数、拒绝缺日或不足，禁止日历类型及 `verified_at`、`event_start`、`event_end` 字段，并拒绝同一来源换 ID 或 arXiv 换版本重复计数。不得伪造日期或降低广告、黄赌毒过滤标准满足数量。

只采用可核验的论文、研究机构原文和会议官网；预印本不写成已录用成果；arXiv 收录也不等于未经同行评审，有明确录用注释时记录具体主会、行业轨道或工作坊，缺少字段时不臆断评审状态。研究结果保留实验范围与限制。来源核验及与新闻相同的广告、黄赌毒过滤结果记录在 `i18n/research-sources-YYYY-MM-DD.md`。最新口径见 [2026-10-17 研究内容更正](research-correction-2026-10-17.md)，[首批来源记录](research-sources-2026-10-17.md)仅保留为历史。运行构建、`python tests/check_research.py` 及上述筛选测试后发布。

## 博客标签

`scripts/tag_taxonomy.py` 是标签的唯一配置来源：`GROUPS` 定义技术方向和细分主题，`POST_TAGS` 为每篇文章指定一个方向和一个主题，`ALIASES` 保存旧标签与新标签的对应关系。新增文章时必须补充 `POST_TAGS`；新增标签时在五语言字典中添加 `tag.<slug>` 和 `tag.<slug>.description`。

构建自动生成标签目录、文章列表、文章侧栏标签、搜索标签和 RSS 分类。旧标签页自动跳转到对应的新标签；旧 RSS 地址继续提供新分类内容，站点地图只收录规范地址。请勿手动编辑生成的标签页或订阅源。运行 `python tests/check_tags.py` 检查文章归属、计数、重定向与 RSS 一致性。

标签总览另展示“今日要闻标签”和“前沿研究标签”，从 `NEWS_TAGS`、新闻数据与研究数据生成条目数量和对应筛选链接；博客 RSS 的成员规则沿用 `POST_TAGS`。

## GitHub 评论

`scripts/comments_layout.py` 为首页、博客正文和探索页生成 giscus 评论区，清理原来的 Disqus 嵌入。仓库为 `tommyCheese/tommyCheese.github.io`，使用 Announcements 分类。仓库必须公开、开启 Discussions，并安装 [giscus GitHub App](https://github.com/apps/giscus)，应用只需授权该仓库。

仓库 ID 和分类 ID 是公开标识，维护在 `scripts/comments_layout.py` 中，不需要在站点存放访问令牌。可通过 [giscus 配置页](https://giscus.app/zh-CN) 获取或检查 ID。安装状态可用公开接口核验：`https://giscus.app/api/discussions/categories?repo=tommyCheese%2FtommyCheese.github.io`；返回的仓库与分类 ID 必须匹配配置。部署前还应确认浏览器实际显示评论框。

每篇文章使用不带语言前缀、查询参数的原始路径作为 `data-term`，配合 `specific` 和严格匹配，使五个语言版本共用同一讨论。`giscus:backlink` 固定指向生产站点的原始页面。重命名文章路径前需要同步调整关联讨论，避免拆分评论。

`js/comments.js` 按实际 `body.dark` 初始化主题，通过限定来源的 `postMessage` 同步模式切换，并在异步 iframe 加载完成时再次同步。评论异步加载；不执行自动发帖或测试评论。禁用 JavaScript 或组件不可用时，可使用“在 GitHub 查看讨论”链接。`giscus.json` 将可嵌入来源限定为生产域名与本地 8873 端口。

迁移时核对了首页、探索页和 10 篇文章的原始 Disqus 记录：仅首页有 1 条公开评论，其余为 0。首页保留“查看旧评论（Disqus）”外部链接，历史数据仍在 Disqus，未导入 GitHub。正常浏览站点不会加载 Disqus 脚本。如以后需要导入历史数据，先由管理员通过 [Disqus 导出](https://help.disqus.com/en/articles/1717164-comments-export) 取得备份，再单独执行迁移。

运行 `python tests/check_comments.py` 和 `node --test tests/comments.test.cjs` 验证页面覆盖、共享讨论标识、旧脚本清理及主题同步。
