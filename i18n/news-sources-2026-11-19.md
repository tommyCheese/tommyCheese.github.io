# 2026-11-19 今日要闻来源与复核

本批新增 1 条，撤下 0 条。新增 ID 为 `microsoft-agent-framework-pypi-compromise`，原始报道与安全公告发布日期为 11 月 18 日，实际收录及正文撰写日期为上海时间 11 月 19 日。五语言完整正文新增 1 篇。历史正文补写 0 篇，待补 0 篇。主题为软件供应链安全，涉及 Microsoft Agent Framework、PyPI、GitHub、Socket 与 StepSecurity。

## 两站优先巡检

- 上海时间 11 月 19 日约 02:56 首先查看 [Anthropic 新闻目录](https://www.anthropic.com/news)，覆盖 11 月 17–18 日并衔接前次巡检。All 列表最新可核验标题仍为 11 月 10 日 IPO 路演及 11 月 9 日模型发布。页首显示 11 月 18 日，未关联具体公告，无法据此确定新事件。补查 [Claude Platform 发布记录](https://platform.claude.com/docs/en/release-notes/overview)，最新为 11 月 17 日关联计费测试版，保持前次暂缓结论。
- 同时查看 [OpenAI 新闻目录](https://openai.com/news/)，约 02:58 补核 [官方 RSS](https://openai.com/news/rss.xml)，覆盖 11 月 17–18 日完整候选列表。11 月 18 日 [Codex 沙箱解读](https://openai.com/index/inside-the-codex-sandbox/) 是既有架构与配置的技术说明，未确认本次新增上线功能，暂缓。同期 [芯片设计研究](https://openai.com/index/advancing-chip-design-with-our-models/) 的生产设计改进与 RISC-V 基准范围不同，仍需独立核对和合作方证据，本批暂缓。[Figaro 合作](https://openai.com/index/le-groupe-figaro-and-openai-announce-partnership/) 为内容发现与企业采用安排，实际实施范围待跟进。[The Silent Consensus](https://openai.com/index/the-silent-consensus/) 为署名观点文章，排除。11 月 17 日 [ChatGPT for Sales](https://openai.com/index/introducing-chatgpt-for-sales/) 宣布销售工作流及插件扩展，开放范围和独立验证待跟进。GPT‑6.2 Astra 与 Sol 已收录，系统卡与 Astra for Law 未作重复计数。

## 其他来源与厂商

补查 [Kimi 博客](https://www.kimi.com/blog/)、[DeepSeek 文档](https://api-docs.deepseek.com/news/)、[Qwen 博客](https://qwen.ai/blog)、[智谱 GLM 发布记录](https://docs.z.ai/release-notes/new-released)、[MiniMax 新闻](https://www.minimax.io/news)、[字节 Seed](https://seed.bytedance.com/en/blog) 与 [Google DeepMind 新闻](https://deepmind.google/blog/)。DeepSeek 应用 API、Qwen4-Max 已收录；Kimi、智谱及 MiniMax 所见入口未确认窗口内实质新发布。Qwen 与 Seed 目录没有可读列表，未完成其全部发布范围核对。其他入口未获得符合本批条件的新增证据。扩大到开源软件与供应链安全后，Agent Framework 包事件入选。

## 入选事实与证据

- [BleepingComputer 原报道](https://www.bleepingcomputer.com/news/security/microsofts-agent-framework-pypi-package-compromised-to-steal-credentials/) 11 月 18 日刊出，与 [GitHub 安全公告](https://github.com/advisories/GHSA-764m-3ppc-5m73) 的 affected versions、description 及发布时间交叉核对。GitHub 列出 1.26.1 和 1.26.2，先前 1.26.0 为干净基线。现有目录未收录同一事件。
- 实际阅读 [StepSecurity 分析](https://www.stepsecurity.io/blog/microsoft-agent-framework-pypi-package-compromised) 的发布与隔离记录、启动机制、载荷能力及响应部分，并读 [Socket 分析](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer) 交叉核对行为。两家记录涉及正常依赖仍保留和 Python 启动执行。正文说明暴露取决于具体环境、权限和传出能力，没有复写恶意代码、敏感目录或收集端点。
- 两条受影响版本 [1.26.1](https://pypi.org/project/agent-framework/1.26.1/) 与 [1.26.2](https://pypi.org/project/agent-framework/1.26.2/) 的公开页面本次返回不可访问，与安全公告的停止分发状态一致。没有将缓存中的副本视为已消失，也未推定最初入侵方式或已证实的数据外传总量。
- 报道的 [原封面](https://www.bleepstatic.com/content/hl-images/2025/03/12/Microsoft-headpic.jpg) 已打开，实际为 Microsoft 标识背景图，地址含 2025 年日期。未确认再发布许可，且属于通用插图，本条以无封面形式呈现。正文流程图为有标注的解释性重绘。
- 五语言标题、摘要、正文、图注与链接逐项复核。公开文字只描述相关事件和通用风险，不包含个人本机身份、设备、路径、凭据、内部代码、终端指令或运行记录，符合广告、促销导购、色情、赌博、毒品及隐私筛选。
