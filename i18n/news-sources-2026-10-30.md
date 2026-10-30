# 2026-10-30 新闻来源与收录记录

本批新增 4 条，全部完成五语言完整正文；另外补齐历史正文 5 篇，撤下 0 条。新增涉及 OpenAI、Cisco、Microsoft 三家公司，分别为 AI 行为规范、Agent 安全监测、网络设备漏洞修复和远程桌面兼容性修复。新闻合计 71 条，完整正文 43 篇，剩余历史正文 28 篇。收录及撰写日期均为实际上海日期 2026-10-30，原始日期保留各自公告时间。

## 首先检查两个官方发布入口

首次直接访问实际时间为上海时间 **2026-10-30 09:15—09:18**。先完成现有数据核对，再进入 [Anthropic 新闻目录](https://www.anthropic.com/news)与 [OpenAI 新闻目录](https://openai.com/news/)，随后才扩展其他厂商和泛搜索。覆盖目标为 10 月 28—30 日，并向前查看至 26 日，与上次 29 日 08:25—08:27 巡检衔接。

### Anthropic

查看按日期排列的 All news 列表至 22 日及更早；首页推荐的旧模型不是当天发布。当前窗口没有 29—30 日条目，最新为 28 日科学计划扩展。

| 日期 | 候选及链接 | 处理理由 |
| --- | --- | --- |
| 10-28 | [AI for Science expands to foundations and research institutions](https://www.anthropic.com/news/ai-for-science-expands-foundations-research-institutions) | 再次阅读全文，主体为 20 家机构的合作与免费额度支持。模型硬件标准与机构研究是早期项目举例，未证明本次新增实证成果。按合作宣传与额度推广规则排除。 |
| 10-27 | [Early progress on accelerating drug development with Claude](https://www.anthropic.com/research/early-progress-drug-development) | 目录核对，已有 `anthropic-drug-development-early-studies`；不是新事件，不重复。 |
| 10-27 | [Expanding our partnership with GSA](https://www.anthropic.com/news/expanding-partnership-gsa) | 目录直接说明折扣采购协议，既有促销排除结论继续适用；不重新上架。 |
| 10-26 | [S-1 filing](https://www.anthropic.com/news/s1-sec) | 与已收录 `anthropic-public-s1-filing` 相同，确认窗口边界，不重复。 |

### OpenAI

当前完整可读首屏从 29 日两项新公告列到 26 日系统卡，已覆盖本次窗口，不以首页推荐或搜索排序代替目录。两项新候选均打开全文并沿链接核对固定日期规范、API 文档及评估方报告。

| 日期 | 候选及链接 | 处理理由 |
| --- | --- | --- |
| 10-29 | [An updated Model Spec for more capable and beneficial AI](https://openai.com/index/updated-model-spec/) | 收录：公开规范的组织结构、上下文和行动边界有具体变化；明确模型尚未完全反映规范，非新模型或实测结果。 |
| 10-29 | [How we detect frontier model misalignment](https://openai.com/index/how-we-detect-frontier-model-misalignment/) | 收录：新增分层监测公开说明及外部 API 停止条件。与此前围栏事件及 METR 试验报道区分，保留异步、覆盖、误报和未独立复测边界。 |
| 10-28 | [OpenAI and ServiceNow expand their partnership](https://openai.com/index/openai-servicenow-partnership-expansion/) | 本次目录与上次核验衔接，未核实足以改变暂缓结论的新交付；合作公告包含多项未来计划，不统称上线。 |
| 10-28 | [The future of the firm](https://openai.com/index/the-future-of-the-firm/) | 与此前已读观点文章相同；不当成新的经验研究或产品事实。 |
| 10-27 | [Oracle apps in ChatGPT](https://openai.com/index/oracle-apps-in-chatgpt/) | 既有合作和开发计划候选，未取得新交付证据，继续暂缓。 |
| 10-26 | [Scientific understanding](https://openai.com/index/building-scientific-understanding-with-academic-communities/)及[world of work](https://openai.com/index/chatgpt-expanding-world-of-work/) | 两项均已收录，与新窗口衔接，不拆分旧事件。 |
| 10-26 | [GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)及相关系统卡 | 已收录模型发布，系统卡不另凑一条。目录同日 CodeRabbit 品牌案例未提供新的入选依据。 |

逐篇事实定位、日期索引差异及独立报道范围见 [OpenAI 复核](news-openai-review-2026-10-30.md)。

## 新增明细与扩展检索

| ID | 原始发表日 | 实质增量与证据 |
| --- | --- | --- |
| `openai-model-spec-intent-context-update` | 2026-10-29 | 固定日期版行为规范及 Reuters 对本次改版的报道。 |
| `openai-layered-misalignment-monitoring` | 2026-10-29 | 官方完整机制与 API 文档；METR 勘误用于限定独立检验范围，不为新版背书。 |
| `cisco-asa-ftd-ssl-vpn-dos-fix` | 2026-10-28 | 厂商确认已遭实际利用，提供按分支的修复。次日报道不替代原始公告日期。 |
| `microsoft-rdp-admin-protection-fix` | 2026-10-28 | 官方补丁明确修复非管理员 RDP 连接问题，受影响系统范围与补丁适用范围分别说明。 |

Cisco 的原始公告、影响条件、缓解代价与新闻价值见 [Cisco 复核](news-cisco-review-2026-10-30.md)；微软的官方发布日期、版本差异和保护状态见 [Microsoft 复核](news-microsoft-review-2026-10-30.md)。两篇均核对 BleepingComputer 独立报道，并删除页面广告与推荐内容。

Kimi、DeepSeek、Qwen、GLM、MiniMax、Seed、Google DeepMind 等实际入口及暂缓理由见 [扩展厂商巡检](news-vendors-review-2026-10-30.md)。保留动态目录缺口，没有将读取失败当成没有消息；没有为厂商或领域配额凑稿。

## 历史正文与图片

额外补写 5 篇：`quantinuum-helios-color-code-memory`、`torchneuron-native-pytorch-trainium-beta`、`rankmath-pro-supply-chain-incident`、`nasa-standardized-shock-vibration-analysis`、`euclid-first-new-comet`。重新阅读原始材料后撰写，既有 ID、发表与收录日期保留，不计作新新闻。具体分母、日期、方法限制见 [量子与软件历史复核](news-history-quantum-software-review-2026-10-30.md)、[科学历史复核](news-history-science-review-2026-10-30.md)。

四条新增和前三条历史使用本站原创解释图，共 7 张；每张已渲染检查，非产品宣传图、论文实测图或攻击操作示例。文件在 `images/news/`，分别为 `openai-model-spec-intent.svg`、`openai-layered-monitoring.svg`、`cisco-ssl-vpn-remediation.svg`、`windows-rdp-protection-fix.svg`、`quantinuum-logical-memory.svg`、`torchneuron-native-backend.svg`、`rankmath-supply-chain-response.svg`。前三条历史旧封面访问正常，但未找到明确转载许可，改用原创图。NASA 与 ESA 现有图片的可访问性、实际画面、署名和新闻使用条件已复核，保留。

## 筛选与公开内容

新增 4 篇和历史 5 篇均包含五语言独立正文、解释图与实际阅读的参考来源。标题、摘要、正文、图注与外链人工检查，不包含广告、促销导购、返利、品牌软文，或色情、赌博、毒品性质内容及推广引流。安全新闻不展示攻击载荷或操作代码。

所有公开字段和复核记录仅含与事件相关的公开信息，不含本机身份、设备、私密位置、内网地址、凭据、内部代码或执行日志。前沿研究元数据及正文保持不变，历史无正文卡片仍直达原文。
