# 2026-11-02 扩展厂商巡检与 ChatGPT 共享额度预告复核

本专项实际检查时间为上海时间 2026 年 11 月 2 日约 14:14—14:17，覆盖 10 月 31 日至 11 月 2 日，并衔接 11 月 1 日已完成的厂商记录。先核对既有新闻及近期来源记录；当日主批已先行检查 Anthropic、OpenAI 官方新闻目录，本专项随后扩展到其他厂商，并补查 OpenAI 帮助中心发布记录。实际检查时间不写成定时触发时间。

## 厂商覆盖与取舍

| 厂商 | 本次实际访问的入口与候选日期 | 处理与覆盖边界 |
| --- | --- | --- |
| Kimi | [官方博客](https://www.kimi.ai/blog/) 最新可读仍为 10-24 Kimi K3.1 Pro，后面为 7 月 K3、PerceptionBench；[官方模型组织](https://huggingface.co/moonshotai) 的 K3 权重更新时间仍为 9 月。 | K3.1 Pro 已收录，不重复。可读入口未发现目标窗口内新交付；不能把托管 K3.1 Pro 描述为 K3 新权重。 |
| DeepSeek | [更新日志](https://api-docs.deepseek.com/updates/) 最新可读为 10-17 搜索 API 与 Flash 1017；[官方模型组织](https://huggingface.co/deepseek-ai) 也显示既有 Flash 1017；[Harness 发布列表](https://github.com/deepseek-ai/deepseek-harness/releases) 顶部仍为 10-30 的 v0.2.1-rc.5。 | 已阅读预发布说明，主要改进对话中思考内容的显示。与上次相同，未核验到新模型；日常显示维护不单独发稿。 |
| Qwen | [博客](https://qwen.ai/blog) 仍无可读正文；改读[官方模型组织](https://huggingface.co/Qwen)及[Qwen Code 发布列表](https://github.com/QwenLM/qwen-code/releases)。后者新增 11-01 v0.26.5，完整说明列出交互卡片界面默认启用、卡片内容可带入后续对话、历史分页及多项工具维护。 | 这是真实工具更新，不能写成新模型发布。此次未核验到足以独立解释该版本影响的进一步材料，暂不收录零碎维护稿。博客覆盖缺口明确保留，不能将无法读取等同于没有消息。模型组织的近期活动主要是已看到的研究与评测信息，不用活动时间替代论文首发日。 |
| GLM / Z.ai | [模型发布记录](https://docs.z.ai/release-notes/new-released) 最新可读仍为 8-26 GLM-5.3-Flash；[官方模型组织](https://huggingface.co/zai-org) 最新活动为更早的研究与模板维护。 | 在这些入口未核验到目标窗口新模型交付，不外推到所有社交渠道。 |
| MiniMax | [发布目录](https://ir.minimax.io/news-events/new-releases) 最新可读为 10-22 Mini App、10-19 M3.1 Flash；[官方模型组织](https://huggingface.co/MiniMaxAI) 最近活动仍是 M3.1 Flash 评测补充与名称调整。 | 与 11 月 1 日已复核的评测元数据补充衔接，没有把权重页面更新时间误写成新发布。推广活动和品牌内容不收。 |
| 字节 Seed | [研究列表](https://seed.bytedance.com/en/research) 顶部博客含既有 SeedRealtime 等，最新可见论文为 10-25 Recycler，之后为更早论文。 | 这些不是目标窗口的新模型交付；论文可按研究规则另行全文核验，本次不以论文活动或旧博客填补新闻。 |
| Google DeepMind | [官方新闻列表](https://deepmind.google/blog/) 当前顶部仍是 Genie 4、Gemini 4 Carbon，随后为森林类型、抗菌肽等更早内容。 | Genie 4 和 Carbon 已收录，不重复。列表只显示月份，精确日期仍应从文章核验；不声称 Google 所有产品渠道都无更新。 |
| Mistral | [官方新闻目录](https://mistral.ai/news/) 最新仍为 10-29 Le Chonk 权重交付，其后为 10-21 合作、10-20 Voxtral 3、10-15 Timestral、10-06 Large 4 预览。 | 29 日 Large 4 权重已在 11 月 1 日补收，不再重复；与预览和品牌合作区分。 |

上述结果是各可读入口的检查结论，不是所有厂商所有渠道的完整保证。没有为厂商数量、主题配额而补入促销、购买引导或缺少新闻增量的宣传。

## 新增：Chat、Work 合并体验与共享额度计划

新增 ID：`openai-chat-work-shared-allowance-plan`。本专项交付 1 条新增新闻及其完整五语言正文，历史补写 0 条、撤下 0 条，其他新增和历史正文由主批分别统计。新闻原始发表日期使用所选独立报道的 **2026-11-01**，真实收录及正文日期为 **2026-11-02**；帮助页仅显示相对更新时间，未将其擅自解释为精确首发日期。

### 已阅读来源与事实定位

1. [BleepingComputer 11 月 1 日报道](https://www.bleepingcomputer.com/news/artificial-intelligence/openai-says-its-doubling-pro-usage-limits-and-bringing-work-features-to-chat/)：页首明确 November 1, 2026、08:53 AM；实际阅读主文全部相关段落。其依据是看到的 OpenAI 订阅者邮件，描述未来数周先在少量用户中测试 Chat 与 Work 合并体验、随后扩大，支持文件和插件及连续任务；明确桌面 Codex 仍是独立体验。未把“正推出”标题概括误读为所有账户已上线。配图为邮件和用量界面，未复制使用，避免未明授权和不必要的账户画面。正文后广告与评论不作事实来源。
2. [OpenAI：Understanding ChatGPT and Codex usage limits](https://help.openai.com/en/articles/20001625-understanding-chatgpt-and-codex-usage-limits)：已读全文三段。第一段明确 **December**、**Plus / Pro / Business**、把 Work 的 Agent 能力纳入主 ChatGPT 体验；第二段明确按 token 衡量、模型与复杂任务影响消耗、**Instant chat 不扣此额度**；第三段说明剩余额度与重置时间可见，并将“多数用户不会更常等待”表述为公司预期。未把预期写成独立测试结论。文中的升级、购买额度入口不转写为推荐或引流。
3. [OpenAI：ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)：已阅读 Overview、模型及访问相关段落，用于解释当前 Chat、Work、Codex 的不同定位。工作入口整合不意味着宣布所有工具、模型或独立开发体验取消。不沿用其他旧缓存页面推断新规则已经生效。
4. [OpenAI：ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)：已阅读顶部 10-30 至 10-26 记录，以及 10-29 用量条目。准确区分 Pro 100 / 500 的二倍额度、Pro 200 撤销削减并统一到较高额度；不能照独立报道的简写声称所有 Pro 200 用户再次翻倍。10-29 调整、小规模界面试验、12 月共享额度是不同阶段。10-28 的 API 促销额度明确排除，不作为相关新闻增量。

新闻价值为产品执行入口与资源计量规则的变化，而非“额度翻倍”的购买宣传。正文解释 token 与提问次数不同，说明高度依赖聊天及编程的用户可能共享同一余量；这是根据规则作出的含义解释，不声称已测量每个用户受影响程度，也不编造全部地区的统一上线日期。五语言一致保留预告、试验、已生效调整之间的边界。

### 补漏候选：GPT-6 Rosalind Research

补查[官方模型发布记录](https://help.openai.com/en/articles/9624314-model-release-notes)发现 10-30 的 GPT-6 Rosalind Research。继续实际阅读全文[官方生命科学说明](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research)：有限已批准 Research 机构在 Work、Codex 及另行批准的 API 使用，非 Chat；Discovery 不授予 Research，仍用 5.5；Enterprise 有两周默认关闭的 Admin Preview，旧批准不绕过预览；5.5 Research 仍可用。既有 10-26 科学结果新闻是数学、物理及 ETH 相关外部核验，不是同一事件。此为有实质增量的候选，已交主批继续阅读安全附录与独立材料、撰写及决定收录，未纳入本专项 1 条计数。

### 图片、筛选与公开字段

`images/news/openai-chat-work-shared-allowance.svg` 为本站原创解释图，表示现有分工、计划中的少量试验及 12 月共享规则，明确不是产品截图或已全面上线证明。图片已渲染并目视检查，标题、流程与脚注清楚，没有裁切、重叠；图片生产链接随主批发布生效。每种语言另有对应的解释图步骤，不依赖英文封面理解文章。

五语言正文均包含独立导语、三节六段及图示，内容明显多于卡片摘要；没有照搬文章或整封邮件。已复核参考链接、所有语言、图注及本记录，排除广告、购买引流、色情、赌博、毒品性质内容。没有本机身份、私密信息、绝对路径、内网地址、凭据、内部代码、命令或运行日志。结构与公开内容额外检查通过；全站构建和发布由主批统一完成。
