# 新闻来源核验：2026-10-17

本次补充三条，共十九条历史新闻。三篇原文均发表于 **2026-10-16**，按原始日期归档，不把 17 日的整理日期替代发布日期。五种语言同步标题、摘要与页面。

## 本次发布前筛选

逐条核对原文正文、标题、采用的配图和跳转地址：三条均有可核对的研究结果或修复信息，不属于广告、促销导购、返利、产品预热或品牌活动宣传；不含色情、赌博、毒品性质的内容及相关推广、交易引流、擦边内容。仅链接原始研究和技术公告，不采用来源站点的订阅、购买或产品推广入口。以企业或项目官方身份发布不自动构成入选理由。

`i18n/README.md` 已明确要求每次新增、补录、替换都执行上述筛选并留下记录。此前[全量复核](news-review-2026-10-17.md)撤下的九条不重新上架。

## AI：NIST 椭圆曲线种子溯源研究

- ID：`anthropic-nist-curve-seed-research`。
- [Anthropic 原文](https://www.anthropic.com/research/ecdsa-curve-origins)，可见发布日期 **Oct 16, 2026**，HTTPS GET 返回 200。
- 采用可复现的技术发现：五条 NIST 素数曲线的种子与 `lrand48`、历史 Unix 时间戳的对应关系；原文附复现代码。摘要明确这不是破解 ECDSA，并保留部分基点来源和候选筛选规则未解释的限制，不写成“证明绝无后门”或模型性能宣传。
- [原文分享配图](https://www-cdn.anthropic.com/images/4zrzovbb/website/d0c862c5cabd703c0fcbaad939385133f02b694c-1200x630.jpg)，署名 Anthropic，完整展示。HEAD 返回 200、`image/jpeg`、137000 字节；不声称是研究实测截图。

## 数码：Windows 11 预览版崩溃修复与辅助功能

- ID：`windows-11-28120-3272-accessibility-fixes`。
- [Microsoft Learn 发布说明](https://learn.microsoft.com/en-us/windows-insider/release-notes/experimental-26-h1/preview-build-28120-3272)，明确 **Release date: 16 October 2026**，HTTPS GET 返回 200，公开正文可读；[Windows Insider 当日公告](https://blogs.windows.com/windows-insider/2026/10/16/announcing-new-builds-for-16-october-2026/)交叉确认版本和日期。
- 摘要只采用 `msmpeg2ac3dec.dll` 崩溃修复与低视力用户的指示器功能；明确 Experimental（26H1）预览渠道和分批提供，不说成稳定版全面开放，不收录公告中的硬件销售宣传。
- [发布说明中的设置截图](https://learn.microsoft.com/en-us/windows-insider/release-notes/images/9d-pointerindicator-settings.png)，署名 Microsoft，完整展示。HEAD 返回 200、`image/png`、69774 字节。图片为复用的功能设置示意，不据图片上传日期改写本次版本发布日期。

## 数码：Debian 内核安全更新

- ID：`debian-linux-dsa-6568-security-update`。
- [Debian 安全公告 DSA-6568-1](https://lists.debian.org/debian-security-announce/2026/msg00482.html)，邮件日期 **Fri, 16 Oct 2026 13:39:29 +0000**，公告署名日期也是 16 日；官网公告入口重定向到该邮件，HTTPS GET 返回 200。
- 公告列出多项可能造成提权、拒绝服务或信息泄露的内核漏洞，稳定版 trixie 的修复包为 `6.12.113-1`。另核对 [CVE-2026-99999 跟踪页](https://security-tracker.debian.org/tracker/CVE-2026-99999)，该漏洞包含在本次公告中。只发布防御性更新信息，不刊载利用步骤，不把单一发行版修复版本推广为所有 Linux 系统通用版本。
- [Debian 官方开放标志](https://www.debian.org/logos/openlogo-nd.svg)，署名 Debian，完整展示；GET 返回 200、`image/svg+xml`、6863 字节。作为项目标志配图，不声称是漏洞现场或本次补丁截图。

配图沿用来源 HTTPS 外链。构建后检查历史完整性、日期排序、五语言同步、首页最近三条和日期筛选功能。
