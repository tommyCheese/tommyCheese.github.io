# 2026-11-05 大模型厂商巡检

上海时间 2026-11-05 11:15 起，在 Anthropic 与 OpenAI 首要入口检查完成后，依次访问下列厂商入口。目标覆盖 11 月 3—5 日，并与 `news-sources-2026-11-04.md` 衔接；结论只覆盖本次可读页面，不把未见条目或访问失败扩大为所有渠道无消息。对候选以当前原文重新判断，旧记录仅用于日期衔接和去重。

本组厂商新闻新增 0 条、撤下 0 条。没有为厂商配额把工具维护、评测元数据或旧模型当成新模型新闻。另补充的 NASA 通信产业稿单独记录在 `news-space-review-2026-11-05.md`，不计入本组模型发布数量。

| 厂商与实际入口 | 可见边界、候选与判断 |
| --- | --- |
| [Kimi 研究博客](https://www.kimi.com/blog/) | 最新可见 Kimi K3.1 Pro，2026-10-24；下接 07-16 K3、PerceptionBench 等。与 `kimi-k31-pro-hosted-release` 去重，未见 11-03 至 11-05 新研究博客条目；不重发。 |
| [DeepSeek API 更新](https://api-docs.deepseek.com/updates/) | 最新可读日期仍为 10-17，包含搜索 API 与 V4.1-Flash-1017；无本窗口可见新模型发布。 |
| [DeepSeek Harness 发布目录](https://github.com/deepseek-ai/deepseek-harness/releases) | 新见 [v0.2.2-rc.1](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1)，页面日期 11-04、明确为预发布。已阅读功能、体验优化与问题修复主体，涉及移动端、插件更新失败回退、实验性委派和权限状态保留等；它是工具候选版本，不是模型升级或稳定正式版。未取得足够独立影响证据，暂缓，保留后续稳定版与安全影响核验线索。与 11-03 alpha.3 区分。 |
| [Qwen 博客](https://qwen.ai/blog)、[旧官方博客](https://qwenlm.github.io/blog/) | 新博客没有返回可读列表；旧站提示迁移并保留 2025 年文章，不能补全当前目录。11-03 至 11-05 的新博客覆盖仍有缺口，不记录为无新消息。 |
| [Qwen 官方模型组织](https://huggingface.co/Qwen) | 当前活动包括既有 Qwen3.8 模型补充 IFBench 结果，以及 [SpecOPD 论文页](https://huggingface.co/papers/2611.02846)。模型评测资料变动不等于新权重发布。SpecOPD 页面标明论文发表于 11-02、11-05 推荐；已读摘要，属于推测解码蒸馏研究，可作为研究栏目后续候选，未直接写成新模型/API 新闻，未修改研究数据。 |
| [Qwen Code 发布目录](https://github.com/QwenLM/qwen-code/releases) | 新见 [v0.26.7](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.7)，日期 11-04。已读完整变更主体，含项目明确授信后再运行仓库扩展、远程访问错误信息约束等；确有工具变化，但当前没有独立确认的广泛影响或新的模型交付。不把每个维护版本单独凑作新闻，暂缓。 |
| [智谱官方发布记录](https://docs.z.ai/release-notes/new-released) | 最新可读条目仍为 08-26 GLM-5.3-Flash；向前有 08-18 GLM-5.3 等。补试官网博客入口未能访问；只能确认发布记录的可见范围，不宣称其他渠道没有更新。 |
| [MiniMax 发布目录](https://ir.minimax.io/news-events/new-releases)、[官网新闻](https://www.minimax.io/news)、[官方模型组织](https://huggingface.co/MiniMaxAI) | 可读发布目录最新为 10-22 Mini App、10-19 M3.1 Flash，官网新闻主体未给出可读完整列表。模型组织今日显示 M3.1 Flash 更新，进一步打开 [评测资料合并记录](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/discussions/7) 及 [变更内容](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/discussions/7/files)：仅新增评测元数据，条目内评测日期为 10-17。不是今天发布新模型，不能把合并时间当模型发表日，排除重复。 |
| [字节 Seed 研究入口](https://seed.bytedance.com/en/research) | 最新可见论文日期 10-25 Recycler；其余研究、SeedRealtime 和模型入口为既有展示，本窗口未取得新的发布时间或交付证据，不重发。 |
| [DeepMind 新闻入口](https://deepmind.google/blog/) | 新近可见仍为 11-03 [Antigravity 化学信息学工作流](https://deepmind.google/blog/agentic-cheminformatics-with-google-antigravity/)，其余近期 Genie 4、Carbon 已收录。重新阅读全文，保留暂缓判断，详见下文。 |
| [Mistral 官方新闻](https://mistral.ai/news/) | 扩展巡检：最新可见 10-29 [Le Chonk 权重发布](https://mistral.ai/news/mistral-large-4-oss/)，与 `mistral-large4-open-weights-release` 去重；未发现该目录内 11-03 至 11-05 新条目。 |

## 重点暂缓的证据边界

DeepMind 11-03 化学信息学文章介绍了 Agent 编排与确定性化学工具的分工，使用 RDKit、ChEMBL 和 PubChem；示例展示 568 个整理后的化合物、分子对分析、模型预测和设计建议。原文明确指出稀疏数据、实验室间噪声和狭窄取值范围限制预测精度，计算设计必须经过合成和实验验证。因此不把小时级工作流自报写成已证实药物发现或临床效果。文章附带平台使用与资源申请推广，当前未取得足以支撑独立效果的新证据，维持暂缓，不转写推广部分。

DeepSeek 与 Qwen 的工具版本进行了补充检索，但未找到足以独立核实重大实际影响的报道。第三方版本汇总和镜像不能当作独立测试；没有把候选版称为正式稳定版，没有把权限修复推演成已被利用的安全事件。SpecOPD 仅保留研究线索，不能用推荐日期替代论文原始发表日期，也未将摘要中的最高加速数当作普遍性能保证。

## 筛选与公开信息

本组未采用第三方照片或论文图表，因此没有新增模型配图。公开记录只保存官方入口、候选标题、日期与筛选结论，不含本机身份、私密地址、凭据、操作命令、代码或运行输出。促销、价格诱导、推广邀请码、品牌案例宣传及色情赌博毒品性质与引流内容均未进入候选正文。访问不足的 Qwen 新博客及其他仅外壳页面仍作为后续覆盖缺口保留。

## 补充核验：Claude Ultra 与五小时额度变更

上海时间 2026-11-05 11:25，补查 [TNW 11 月 1 日报道](https://thenextweb.com/news/claude-ultra-max-plan-rename-five-hour-limit)。该文将变更时间指向此前星期五，即 10 月 30 日；现有新闻数据未发现这一套餐更名与额度调整事件，不能记作已收录。它涉及实际服务规则，有新闻增量，不因涉及付费套餐就直接视为广告；但本轮 11 月 3—5 日窗口内未发现进一步变化，保留为遗漏的历史候选，暂不为当日数量补入。

重新阅读全文并核对 [Ultra 官方说明](https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan) 的“What changed from Max 20x?”及“Does the Ultra plan have any usage limits?”部分：原 Max 20x 更名 Ultra，旧订阅自动迁移且价格不变；取消五小时限制仅适用于通过验证的 Ultra 账户，周额度仍然存在，Fable 还有单独的周限制。验证依据账户与支付历史自动进行；未验证账户仍有临时限制，结账时的手机号验证不等于通过这项验证。不能写成所有 Max 用户取消限制，也不能写成无限量使用。

[Max 官方说明](https://support.claude.com/en/articles/11049741-what-is-the-max-plan) 当前仍明确保留五小时和每周额度，并把两者分别列为 Pro 的五倍。TNW 报道原 Max 5x 简称 Max，原 Max 20x 改名 Ultra。当前 Ultra 官方口径是 Pro 的十倍**每周**额度。旧套餐名称的“20x”和当前每周“10x”不是已经证明可直接相比的同一统计口径；本次没有取得旧版完整官方额度表，不能据此写成周额度减半，也不推算实际消息数。

[额度机制官方说明](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work) 的五小时及每周限制部分确认：五小时窗口从首条消息开始，周额度按账户固定时间重置，各产品界面共同计量；模型、任务复杂度和功能会影响消耗。它还明确列出已验证 Ultra 的五小时例外。取消短窗口限制只改变一周内如何分配使用时间，并不消除总量及容量管理约束。

日期证据仍有边界：[官方发布记录](https://support.claude.com/en/articles/12138966-release-notes) 可读最近条目为 10 月 21 日，没有提供此次 10 月 30 日变更的日期记录；帮助文章仅显示本周更新。TNW 所链接的 [Claude 官方公告](https://x.com/claudeai/status/2116220869479428500) 本次无法直接读取，不能说已独立读到公告日期。现行规则由帮助中心核实，10 月 30 日发生日期目前按 TNW 归因；如后续单独补报，需保留这一归因并继续补原公告日期证据，不把今天核验日写成发生日。

本次只更新来源复核记录，没有新增卡片或正文，也未采用 TNW 的商业图库照片。未采集 API 赠额、促销或购买引导；未纳入色情、赌博、毒品及相关推广内容。
