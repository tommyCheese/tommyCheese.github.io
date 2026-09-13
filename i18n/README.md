# 站点多语言维护

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

搜索读取当前语言的 `index.json`，输入和结果均以纯文本渲染。Markdown 下载链接明确标注为简体中文原文。各译文共享原文对应的 GitHub Discussions 评论串。

## 首页、专题与阅读导航

`scripts/reading_layout.py` 在同一构建流程中生成首页精选、最新文章、`/topics/` 专题页、RSS 入口、手机折叠目录及架构系列的上下篇导航。布局样式位于 `css/reading.css`，手机目录选择章节后的收起行为位于 `js/reading.js`；目录和专题在禁用 JavaScript 时仍可使用。

新增或调整精选文章时修改 `FEATURED`；专题文章与阅读顺序维护在 `TOPICS` 和 `ARCHITECTURE` 中。`index.json` 仍是文章元数据来源，日期从各文章页面的 `time` 元素读取。新增界面文案仍需在五语言字典中同步维护。构建会重建这些区域，请勿直接修改生成后的精选卡片、专题正文或上下篇导航。

完成构建后，另运行 `python tests/check_reading.py` 检查专题覆盖、目录锚点、系列顺序、正文完整性和站内链接。

## 博客标签

`scripts/tag_taxonomy.py` 是标签的唯一配置来源：`GROUPS` 定义技术方向和细分主题，`POST_TAGS` 为每篇文章指定一个方向和一个主题，`ALIASES` 保存旧标签与新标签的对应关系。新增文章时必须补充 `POST_TAGS`；新增标签时在五语言字典中添加 `tag.<slug>` 和 `tag.<slug>.description`。

构建自动生成标签目录、文章列表、文章侧栏标签、搜索标签和 RSS 分类。旧标签页自动跳转到对应的新标签；旧 RSS 地址继续提供新分类内容，站点地图只收录规范地址。请勿手动编辑生成的标签页或订阅源。运行 `python tests/check_tags.py` 检查文章归属、计数、重定向与 RSS 一致性。

## GitHub 评论

`scripts/comments_layout.py` 为首页、博客正文和探索页生成 giscus 评论区，清理原来的 Disqus 嵌入。仓库为 `tommyCheese/tommyCheese.github.io`，使用 Announcements 分类。仓库必须公开、开启 Discussions，并安装 [giscus GitHub App](https://github.com/apps/giscus)，应用只需授权该仓库。

仓库 ID 和分类 ID 是公开标识，维护在 `scripts/comments_layout.py` 中，不需要在站点存放访问令牌。可通过 [giscus 配置页](https://giscus.app/zh-CN) 获取或检查 ID。安装状态可用公开接口核验：`https://giscus.app/api/discussions/categories?repo=tommyCheese%2FtommyCheese.github.io`；返回的仓库与分类 ID 必须匹配配置。部署前还应确认浏览器实际显示评论框。

每篇文章使用不带语言前缀、查询参数的原始路径作为 `data-term`，配合 `specific` 和严格匹配，使五个语言版本共用同一讨论。`giscus:backlink` 固定指向生产站点的原始页面。重命名文章路径前需要同步调整关联讨论，避免拆分评论。

`js/comments.js` 按实际 `body.dark` 初始化主题，通过限定来源的 `postMessage` 同步模式切换，并在异步 iframe 加载完成时再次同步。评论异步加载；不执行自动发帖或测试评论。禁用 JavaScript 或组件不可用时，可使用“在 GitHub 查看讨论”链接。`giscus.json` 将可嵌入来源限定为生产域名与本地 8873 端口。

迁移时核对了首页、探索页和 10 篇文章的原始 Disqus 记录：仅首页有 1 条公开评论，其余为 0。首页保留“查看旧评论（Disqus）”外部链接，历史数据仍在 Disqus，未导入 GitHub。正常浏览站点不会加载 Disqus 脚本。如以后需要导入历史数据，先由管理员通过 [Disqus 导出](https://help.disqus.com/en/articles/1717164-comments-export) 取得备份，再单独执行迁移。

运行 `python tests/check_comments.py` 和 `node --test tests/comments.test.cjs` 验证页面覆盖、共享讨论标识、旧脚本清理及主题同步。
