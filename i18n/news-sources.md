# 今日要闻来源核验

核验日期：2026-10-10（Asia/Shanghai）。以下为近期精选，不表示全部于当天发布。发布日期以原文为准；文章标题和概述为独立中文改写。

## 当前精选

### AI：GPT‑6 与 Intelligent UI

- 原文：[GPT‑6 and Intelligent UI for everyone](https://openai.com/index/gpt-6-for-everyone/)，OpenAI，2026-10-07。
- 正文核验：GPT‑6 在 ChatGPT 引入 Intelligent UI，可将文字、图形和交互元素组合成回答；10 月 7 日起面向 Plus、Pro、Business、Enterprise 推出，随后扩展至 Free、Go。此次发布不改变 Work 与 Codex 的模型。
- 封面：后台浏览器打开原文（跳转至官方简体中文版本）后读取 DOM 的 `meta[property="og:image"]` 与 `twitter:image`，两者一致。[官方封面](https://images.ctfassets.net/kftzwdyauwt9/5frqtUAWccstAbVrCFraH6/5ae9b6bfbc3f3dff8001ed249812f97d/Intelligent-UI_Art-Card_16x9.png?w=1600&h=900&fit=fill)。

### 半导体：台积电九月营收

- 原文：[TSMC September 2026 Revenue Report](https://pr.tsmc.com/english/news/3343)，TSMC，2026-10-08。[繁体中文原文](https://pr.tsmc.com/chinese/news/3343)。
- 正文核验：2026 年 9 月合并营收约新台币 5,118.6 亿元，环比下降 0.6%，同比增长 54.6%；前九个月营收同比增长 41.1%。不要由这些数字推断具体 AI 业务贡献。
- 原文直接附图：[九月营收表](https://pr.tsmc.com/system/files/news/e451a66f624a32c8bdbc19d216edbadee8b06e6d/Sep%202026%20%28E%29.jpg)。
- 可选视觉封面：[官方 Fab 18 图](https://pr.tsmc.com/sites/pr/multimedia-gallery/A_6747481_0.jpg)，来源为 [TSMC Fabs Inside 图库](https://pr.tsmc.com/english/gallery-fabs-inside)。属于厂房资料图，非本次营收发布的事件照片；标明图片来源 Taiwan Semiconductor Manufacturing Co., Ltd.。图库说明要求署名，编辑、修改需另行书面许可；直接按原图显示。

### 数码：SmartThings Now

- 原文：[三星原文](https://news.samsung.com/global/samsung-introduces-smartthings-now-in-new-platform-update-that-brings-more-intuitive-user-experiences)，Samsung，2026-10-06。
- 正文核验：SmartThings Now 在 Home 页顶部提供按场景推荐的信息和快捷操作；同时增强本地控制，手机与 Hub 在同一 Wi-Fi 时可直接通信，支持 Matter 1.6。约 30% 响应提升来自三星受控测试，实际环境表现可能不同；卡片概要无需使用该性能数字。
- 封面：后台浏览器打开原文后读取 DOM 的 `og:image` 与 `twitter:image`，两者一致。[官方封面](https://img.global.news.samsung.com/global/wp-content/uploads/2026/10/01154339/Samsung-Corporate-SmartThings-Now-New-Platform-Update_Thumb932.jpg)。

### 汽车：BMW iX3 M60 xDrive

- 原文：[The new BMW iX3 M60 xDrive.](https://www.press.bmwgroup.com/global/article/detail/T0461463EN?language=en)，BMW Group，2026-10-08。
- 正文核验：Neue Klasse 纯电 SUV 的 M Performance 版本使用双电机，官方暂定参数为 450 kW、0–100 km/h 3.9 秒、最高 400 kW 直流充电功率。2027 年 1 月底开放订购，2027 年春投产；不要写成已交付。标题车型为 BMW iX3 M60 xDrive。
- 封面：原文 HTML 的 `og:image`。[官方车型封面](https://mediapool.bmwgroup.com/cache/P9/202610/P90659795/P90659795-the-new-bmw-ix3-m60-xdrive-10-2026-2250px.jpg)。

## 当前精选候选数据

```json
[
  {
    "id": "openai-gpt6-intelligent-ui",
    "category": "ai",
    "date": "2026-10-07",
    "source": "OpenAI",
    "original_title": "GPT‑6 and Intelligent UI for everyone",
    "url": "https://openai.com/index/gpt-6-for-everyone/",
    "image_url": "https://images.ctfassets.net/kftzwdyauwt9/5frqtUAWccstAbVrCFraH6/5ae9b6bfbc3f3dff8001ed249812f97d/Intelligent-UI_Art-Card_16x9.png?w=1600&h=900&fit=fill",
    "image_credit": "OpenAI",
    "title": "GPT‑6 携 Intelligent UI 进入 ChatGPT",
    "summary": "OpenAI 开始向更多用户推出 GPT‑6，回答可组合文字、图形与交互工具，并在思考过程中逐步呈现。"
  },
  {
    "id": "tsmc-september-revenue",
    "category": "semiconductors",
    "date": "2026-10-08",
    "source": "TSMC",
    "original_title": "TSMC September 2026 Revenue Report",
    "url": "https://pr.tsmc.com/english/news/3343",
    "image_url": "https://pr.tsmc.com/sites/pr/multimedia-gallery/A_6747481_0.jpg",
    "article_image_url": "https://pr.tsmc.com/system/files/news/e451a66f624a32c8bdbc19d216edbadee8b06e6d/Sep%202026%20%28E%29.jpg",
    "image_credit": "Taiwan Semiconductor Manufacturing Co., Ltd. · Fab 18 资料图",
    "title": "台积电 9 月营收同比增长 54.6%",
    "summary": "台积电公布 9 月合并营收约新台币 5,118.6 亿元，环比微降 0.6%；前九个月营收同比增长 41.1%。"
  },
  {
    "id": "samsung-smartthings-now",
    "category": "digital",
    "date": "2026-10-06",
    "source": "Samsung Newsroom",
    "original_title": "Samsung Introduces ‘SmartThings Now’ in New Platform Update That Brings More Intuitive User Experiences",
    "url": "https://news.samsung.com/global/samsung-introduces-smartthings-now-in-new-platform-update-that-brings-more-intuitive-user-experiences",
    "image_url": "https://img.global.news.samsung.com/global/wp-content/uploads/2026/10/01154339/Samsung-Corporate-SmartThings-Now-New-Platform-Update_Thumb932.jpg",
    "image_credit": "Samsung Electronics",
    "title": "SmartThings Now 带来场景化家庭控制",
    "summary": "三星更新 SmartThings，通过首页卡片推荐适时的信息和操作，并增强本地设备控制、加入 Matter 1.6 支持。"
  },
  {
    "id": "bmw-ix3-m60-xdrive",
    "category": "automotive",
    "date": "2026-10-08",
    "source": "BMW Group",
    "original_title": "The new BMW iX3 M60 xDrive.",
    "url": "https://www.press.bmwgroup.com/global/article/detail/T0461463EN?language=en",
    "image_url": "https://mediapool.bmwgroup.com/cache/P9/202610/P90659795/P90659795-the-new-bmw-ix3-m60-xdrive-10-2026-2250px.jpg",
    "image_credit": "BMW Group",
    "title": "BMW 发布纯电 iX3 M60 xDrive",
    "summary": "Neue Klasse 迎来 M Performance 双电机版本，计划于 2027 年春投产。官方暂定百公里加速为 3.9 秒，支持最高 400 kW 直流充电。"
  }
]
```

## 备选

- AI：[Sharing AI progress in mathematics](https://openai.com/index/sharing-ai-progress-in-mathematics/)，OpenAI，2026-10-06。正文发布内部前沿模型获得的数学结果、部分 Lean 形式化证明与推理记录，封面未核验。
- 半导体/AI：[NVIDIA Commits $1 Billion to Advance US Science Over the Next Five Years](https://nvidianews.nvidia.com/news/nvidia-commits-1-billion-to-advance-us-science-over-the-next-five-years)，NVIDIA，2026-10-08。计划未来五年投入价值 10 亿美元的资源，支持科学与量子计算。原文 OG 使用 NVIDIA Voyager 资料图：[封面](https://iprsoftwaremedia.com/219/files/20224/6296531eb3aed3741918b6b5_DH1L4415-HDR-20220527-r5/DH1L4415-HDR-20220527-r5_dba29dde-5a9b-4ac8-bf58-a0b78da89547-prv.jpg?v=dba29dde-5a9b-4ac8-bf58-a0b78da89547)。
- 数码：[Samsung Introduces Galaxy Tab S12 Series: The Ultimate Productivity Powerhouse Built for Growth](https://news.samsung.com/global/samsung-introduces-galaxy-tab-s12-series-the-ultimate-productivity-powerhouse-built-for-growth)，Samsung，2026-09-30。发布 Tab S12 Ultra 和 Tab S12+，支持 Galaxy AI 与 S Pen。原文主图：[官方图](https://img.global.news.samsung.com/global/wp-content/uploads/2026/09/28100811/Samsung-Mobile-Galaxy-Tab-S12-Series_Main1.jpg)。此条已超过一周。
- 汽车：[Mercedes-Benz Group sold 491,700 cars and vans in Q3, with record global BEV sales](https://media.mercedes-benz.com/en/article/b747b5d0-3a9a-4b8a-9e5f-a2f26db33418)，Mercedes-Benz，2026-10-07。第三季度集团交付 491,700 辆乘用车与厢式车，乘用车纯电销量 68,400 辆，同比增长 61%；集团总销量同比下降 6%。原文 OG：[封面](https://api.media.mercedes-benz.com/jsonapi/image/deliver/7f873de5-6585-4b0d-8471-c19faa65f940/3_2_568)。

未下载远程媒体。封面通过官方原文元数据、正文图片或官方图库验证；网站显示仍需检查外链加载情况。
