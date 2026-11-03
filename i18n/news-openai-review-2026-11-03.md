# 2026-11-03 OpenAI 官方入口与四项新公告复核

实际复核时间为上海时间 2026 年 11 月 3 日约 08:58—09:01。主批先完成 Anthropic、OpenAI 官方新闻入口优先检查后，本专项再次直接读取 [OpenAI 新闻目录](https://openai.com/news/)，逐项打开 11 月 2 日全部四篇新公告，覆盖至 10 月 29 日并衔接前次巡检；没有用搜索结果代替目录检查。已与既有新闻 ID、外链去重。

## 四项公告的处理

| 官方公告（均为 2026-11-02） | 全文核验与处理 |
| --- | --- |
| [Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/) | 已读动机、架构、分支一致性、缓存、压缩合并、生产部署、Git 上游贡献与后续计划。实际生产应用及设计取舍具有工程增量；近 80% 中位延迟下降、日级数据量为厂商自报，页面交互演示明确为教学模拟而非生产基准。继续检查[公开 Git 分支仓库](https://github.com/openai/git)及[公开补丁追踪](https://oai-git.openai.chatgpt.site/)，确认公开的是 Git 改进，不据此称整个 Pando 已开源或对外可用。多轮精确检索尚未取得可靠独立报道，结果含大量无关同名项目；本轮暂缓，不将其伪装为独立验证，下次继续核验。任何后续正文只解释公开方法，不带入命令、内部例子或代码片段。 |
| [Introducing the Grid Protectors Program](https://openai.com/index/grid-protectors-program/) | 已读全部正文，并跟进 Georgia Power 原始协议公告，结合 Axios 与 The Next Web 独立报道。收录全国性未来需求响应安排的新计划，明确已有协议、未投运园区及预期效果的边界。 |
| [LifeVal](https://openai.com/index/lifeval/) | 已读背景、3,995 人调查、任务示例、结果表及说明。选题是日常任务评估，但当前页未给出足以核验的完整任务集、评分规则、试验次数与独立复现材料；选例高分不能当作日常任务成功率。已查看独立介绍，其仍主要依赖同一公告，不补足方法缺口。暂缓，不把产品示例与自报高分写成可靠性结论，也不将旧的同名 LIFEval 研究混入。 |
| [Dan Driscoll joins OpenAI](https://openai.com/index/dan-driscoll-joins-openai/) | 已读任命、职责、履历及引述。属于新管理职位与政策合作表述，未提供具体技术交付或服务变化；本轮不将人事背书和品牌陈述作为科技新增稿。 |

另外直接阅读[官方产品发布目录](https://openai.com/products/release-notes/)、[ChatGPT 发布记录](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)及[模型发布记录](https://help.openai.com/en/articles/9624314-model-release-notes)的近期部分。最新日期仍至 10-30；Rosalind、Terra 与额度规则已收录，不重复。API 促销额度排除；移动端账户切换属于较小体验更新，本轮不单独发稿。没有将未显示新日期外推为所有 OpenAI 渠道都没有新消息。

## 新增与事实依据

新增 ID：`openai-grid-protectors-demand-response-plan`。原始发表日期 **2026-11-02**（官方目录及公告页一致），真实收录与正文日期 **2026-11-03**。本专项新增 1 条、完整五语言正文 1 篇、历史补写 0 篇、撤下 0 条；主批另行统计其他机构新闻。

1. [OpenAI 11 月 2 日完整公告](https://openai.com/index/grid-protectors-program/)：开头说明全国性计划针对未来计算园区，各地约定减少多少用电、多快、持续多久；发电、储能和平滑控制是按当地条件选择的手段，不是已普遍部署的设备。Georgia 部分明确园区仍在开发，已有协议是试点基础。末尾承认灵活用电不能替代供电、输电投资。没有把其品牌承诺写成已实现效果。
2. [Georgia Power 原始公告](https://www.georgiapower.com/news-hub/press-releases/georgia-power-to-serve-openai-project-in-effingham-county.html)：页首日期 **07/22/2026 09:30 AM**；正文明确约 **3,200 MW** 预期需求、**25 年**协议、最多 **1,000 MW** 灵活需求响应、电力公司在特定时段减少供电的权利，以及 OpenAI 承担项目基础设施和服务成本、长期合同与财务保障。7 月已披露的协议不能包装成 11 月新签。兆瓦是功率，不能写成全年节电量。
3. [The Next Web 11 月 2 日报道](https://thenextweb.com/news/openai-grid-protectors-program-demand-response-georgia)：已读完整相关正文，确认全国计划、逐站条件不同、佐治亚案例仍待建设运行及尚未列出其他具体园区。采用其独立新闻判断，不据媒体简写把计划写成已运行项目。它引述的节费预测并非本项目单独贡献，本稿不采用该数字。
4. [Axios 11 月 2 日报道](https://www.axios.com/2026/11/02/openai-data-center-power-cuts)：已读可见正文，用于独立确认新增是扩大既有需求响应承诺的框架。没有复用报道长段文字、独家引述或未经原文核验的法规内容。

正文将用电机制、协议事实、厂商承诺和本站解释分开。成本承担与居民降费不是同一结论；不声称已经保障任意数量家庭不断电。未加入购买号召、客户背书、招聘或优惠。LifeVal 的额外阅读记录为 [AI Affairs 简介](https://www.aiaffairs.com/technology/openai-lifeval-everyday-tasks-benchmark/)及[AB 通信介绍](https://markenote.jp/article/7348)，仅辅助评估公开方法缺口，未作为新增事实发布。

## 图片与内容复核

封面 `images/news/openai-grid-demand-response-plan.svg` 为本站原创解释图，展示电网紧张、按协议减少负荷、后续核验的关系，脚注明确是计划而非运行记录。没有使用官方摄影、品牌插画或未经核实授权的第三方图表。已渲染并目视检查：标题、三步流程、单位与边界说明清楚，无重叠或裁切。生产链接随主批发布生效。

五语言均有独立导语、三节六段、对应解释图，保留 11 月 2 日新计划与 7 月既有合同、未来与当前、功率与电量的区别。已人工复核全部语言、参考外链、图注与本记录，排除广告、促销导购和色情、赌博、毒品及相关引流。无本机身份、私密信息、绝对路径、内网地址、凭据、内部代码、终端命令或运行日志。结构与公开内容额外检查通过；全站构建检查由主批统一执行。
