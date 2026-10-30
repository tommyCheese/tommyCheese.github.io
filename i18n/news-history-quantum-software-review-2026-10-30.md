# 2026-10-30 历史新闻正文复核：量子纠错、计算框架与供应链安全

本批重新阅读原始材料后，为三条合格历史新闻补齐五语言正文。原有 ID、published_at 与 collected_at 不变，written_at 均为 2026-10-30；不计入本批新增新闻。三篇均保留，撤下 0 条。

## Quantinuum Helios 彩色码实验

- ID：`quantinuum-helios-color-code-memory`；原公告日 2026-10-19，原收录日 2026-10-21。
- 实际阅读 [Quantinuum 10 月 19 日公告](https://www.quantinuum.com/blog/quantinuum-closes-in-on-one-million-error-free-operations)、其链接的 [22 页论文](https://www.quantinuum.com/fault-tolerance-by-2029)，并比对 [arXiv v1 全文](https://arxiv.org/html/2610.24077v1)。论文元数据为 10 月 16 日，不改写新闻公告日期，也不宣称已获会议录用。另阅读 [Quantum Brief 独立报道](https://quantum-brief.com/blog/news-2026-10-20-quantinuum-color-code-threshold/)判断报道增量；性能事实以原论文为准，不采用其对其他硬件的概括比较。
- 方法定位：论文正文的 Leakage Reduction、Logical Memory Experiment Setup、Decoding。三角彩色码距离 3、5、7，分别占用 13、37、73 个含辅助位的量子比特。使用硬件 leakage repump 与电路 SWAP-LRU，不能把只有数据位的数量当作总资源。
- 表 I：每次 20 轮检查；距离 7、Tesseract 解码为 29,000 次实验、3 次读出逻辑失败。估计每轮 5(+4/-2)×10⁻⁶，置信区间为 68%。不是一次连续百万轮零错运行。三距离每轮误差为 5.5×10⁻⁴、3.8×10⁻⁵、5×10⁻⁶；拟合抑制因子约 12 是每距离增加 2 的趋势，不是已验证任意规模。
- Clifford Randomized Benchmarking：距离 3、5 的两逻辑量子比特测试，距离 5 约 7×10⁻⁵ 每逻辑 Clifford。逻辑门与存储检查轮分母不同，不混作同一精度。
- 全文明确所有解码离线进行。流式输入与神经解码速度测试仅说明实时接入可能，不称已实时闭环。实时控制、扩大硬件和通用运算其他资源仍需整合验证。公告的市场领先、Apollo 路线与资源节约外推没有转写成已实现新闻结论。
- 新闻价值是实际硬件实验和可检验误差随距离缩放；文章去除品牌夸张，保留统计不确定性，不属于广告或产品卖点稿。

## TorchNeuron 原生 PyTorch 后端

- ID：`torchneuron-native-pytorch-trainium-beta`；保留新闻公告日 2026-10-19、收录日 2026-10-20。
- 阅读 [PyTorch 原公告](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/)、[AWS 10 月 20 日公开测试发布](https://aws.amazon.com/about-aws/whats-new/2026/10/aws-announce-native-pytorch-support-trainium/)、[固定 2.33.0 发行说明](https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/release-notes/components/torchneuron.html)、[官方仓库](https://github.com/aws-neuron/torch-neuronx)的 Features 与 Known limitations，以及 [ITPro 独立报道](https://www.itpro.com/software/development/amazon-targets-trainium-gains-with-new-torchneuron-developer-tool)。另阅读 [官方概览](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/torch/about-pytorch-neuron.html)与 [On The Wire 报道](https://onthewire.ai/article/google-meta-and-aws-launch-native-pytorch-backends-for-tpus-and-trainium)，后者不作为额外性能事实证据。
- 日期区分：19 日介绍、20 日公开 beta 上线；发行说明组件日期为 19 日。官方仓库实际公开代码和 Apache 2.0，不把许可开放等同成熟度或全特性稳定。
- PyTorch 正文 Capabilities：使用正式外部设备扩展，支持 Trainium2/3、即时与编译执行、自动求导、性能与分布式接口。普通即时模式仍需编译操作；首次执行成本与缓存后稳定执行不同。自适应即时为实验功能且默认关闭，不称已普遍启用。
- 固定发行说明 Known issues：编译需要静态形状，新形状可能重新编译；部分稀疏、函数变换、嵌套张量、概率分布接口尚不支持，部分计算回退 CPU。仓库提示双精度可按单精度执行、可能改变高精度结果。正文要求分别核对可运行、数值一致与性能，不套用“一行迁移”宣传。
- 公开版本不包含 TorchAO 集成与组合 MXFP8 类型；公告中私测和下次发布计划不改写成已交付。分布式接口兼容不保证原 GPU 布局吞吐，采用案例不当成独立实验。
- 入选理由为实际公开后端与框架兼容进展，未纳入购买、成本承诺、客户推广或硬件采购引导。

## Rank Math PRO 安装包供应链事件

- ID：`rankmath-pro-supply-chain-incident`；原报道日 2026-10-19、收录日 2026-10-20。
- 实际阅读 [厂商告警与恢复说明](https://rankmath.com/kb/pro-3-0-123-security-incident/)、[Wordfence 安全告警](https://www.wordfence.com/blog/2026/10/rank-math-seo-pro-3-0-123-malware/)和 [BleepingComputer 10 月 19 日报道](https://www.bleepingcomputer.com/news/security/wordpress-seo-plugin-rank-math-compromised-to-backdoor-websites/)。页面顶端促销和安全产品推广均排除，不复制恶意代码、命令、攻击域名或可执行载荷。
- 范围定位：厂商首段、Check if your website is affected 与 Wordfence Who Is Affected。PRO 3.0.123 的特定下载/更新批次，UTC 10 月 15 日 20:02 至 16 日 07:12，共约 11 小时 10 分钟；不能只根据版本号判断全部感染。清洁替代版 3.0.124，WordPress.org 免费版不受本次包污染影响。
- 激活过受影响包的站点按已侵入处理；从未激活与只下载的情形按厂商分流，不夸大风险。当前已更新不证明过去运行留下的后门已清除。
- 持久化与恢复定位：厂商 Secure your website、Wordfence What Website Owners Should Do Now。可有额外文件、管理员和定时任务，访问网站时可能重建后门；仅停用或更新不足。干净备份恢复后仍需扫描和替换暴露凭据；无备份需有能力人员排查其他位置。
- 不确定性：报道时具体受影响数量和初始攻击入口没有厂商回复；免费版数百万安装量不当受害数。报道中的另一恶意样本只有相同指标、未确认经该插件分发，不当作证实的完整攻击链。
- 这是供应链安全事件与恢复边界说明，不是安全软件导购；无攻击操作指南或秘密值。

## 图片、语言与公开内容

三张既有图片均重新下载并目视检查，可访问且内容与条目相符：Quantinuum 为三种彩色码布局，PyTorch 为后端架构图，BleepingComputer 为 WordPress 装饰插画。论文 HTML 标明 CC BY 4.0，但原企业博客单独布局图的授权未另行证实；PyTorch 博客图与 BleepingComputer 插画没有核验到可广泛转载的明确许可。本批不沿用不明确授权的外部封面，统一替换为本站原创流程示意：`images/news/quantinuum-logical-memory.svg`、`images/news/torchneuron-native-backend.svg`、`images/news/rankmath-supply-chain-response.svg`。不复制实验图、图标或品牌插画，不把流程当实验数据。

三篇五语言正文均有独立导语、三节六段和解释性流程；逐项复核关键日期、分母、结果、归因与限制。繁体中文校正了编码扩展、算子、下载时段等上下文用词。所有内容排除广告、促销导购、色情、赌博、毒品及相关推广；不包含本机身份、设备、私密位置、内部地址、凭据、内部代码或执行记录。公开安全术语仅用于说明事件类别，不含真实秘密或可执行样例。原有摘要已保留必要范围，无需为本批补写改变其标题、摘要或日期。
