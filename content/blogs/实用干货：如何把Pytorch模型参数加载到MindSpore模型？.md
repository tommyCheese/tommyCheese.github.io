---
title: "实用干货：如何把Pytorch模型参数加载到MindSpore模型？"
date: 2023-09-01T22:53:58+05:30
draft: false
author: "Tommy Cheese"
tags:
  - 深度学习
  - 昇腾
image: /blogimages/p2m.png
description: "本文描述了Pytorch模型及参数与MindSpore模型、参数转换执行时的问题，同时给出了一种可行的解决方案完成Pytorch->MindSpore的转换。"
toc: 
---

### 问题简述

在日常的模型开发、训练过程中我们经常会遇到这样的现象：在现有的开源项目或者论文复现中，多数模型使用Pytorch设计、开发和训练推理，当我们需要使用MindSpore框架进行模型开发时，会遇到以下两个问题：

- 模型使用Pytorch编码；
- Pytorch模型训练后保存的参数无法被MindSpore模型直接加载。

对于第一个问题，我们可以根据昇思官方提供的文档：[与Pytorch典型区别](https://www.mindspore.cn/docs/zh-CN/r2.1/migration_guide/typical_api_comparision.html#%E4%B8%8Epytorch%E5%85%B8%E5%9E%8B%E6%8E%A5%E5%8F%A3%E5%8C%BA%E5%88%AB)和[PyTorch与MindSpore API映射表](https://www.mindspore.cn/docs/zh-CN/r2.1/note/api_mapping/pytorch_api_mapping.html#pytorch%E4%B8%8Emindspore-api%E6%98%A0%E5%B0%84%E8%A1%A8)来完成模型的迁移；

对于模型参数的转换，在最新的MindSpore版本中MindConverter不再支持，因此可以考虑针对模型参数，我们进行**手动的转换**，将Pytorch模型参数转换为MindSpore能识别的格式后，再进行加载。

### 解决方案

模型的编码转换不再赘述。

参数转换主要思路如下：

- 使用Pytorch加载Pytorch模型，并取得模型参数prams_torch；
- 使用MindSpore加载MindSpore模型，并取得模型参数prams_ms；
- 将Pytorch模型的参数名和MindSpore模型参数名一一对应（有的话）；
- 建立torch_2_ms键名映射表，使用键名映射表将Pytorch模型参数值加载到MindSpore参数名对应的位置上；
- 使用MindSpore加载参数。

### 案例分析

不同模型的模块不相同，参数类型也不尽相同，此处我们以一个网络举例，说明转换的基本思路，不同的模型其转换思路是类似的。

[EfficientNet](https://arxiv.org/abs/1905.11946)是谷歌于2019年发表的文章，详细网络架构可查看文章描述，此处我们以**EfficientNet+FC**全连接层的模型为例，探讨如何进行网络模型参数的转换。

#### 使用Pytorch加载Pytorch模型，并取得模型参数prams_torch

```python
import torch
from test.efficientnet_pytorch.model import EfficientNet as EN_pytorch
import pandas as pd

pytorch_model = EN_pytorch.from_name(cfg['model'], override_params={'num_classes': 3})
pytorch_model.cuda()
pytorch_weights_dict = pytorch_model.state_dict()
param_torch = pytorch_weights_dict.keys()
param_torch_lst = pd.DataFrame(param_torch)
param_torch_lst.to_csv('param_torch.csv')
```

步骤结束后，我们就将pytorch的模型参数存到了param_torch.csv下，观察数据：

|      | keys                             |
| ---- | -------------------------------- |
| 0    | _conv_stem.weight                |
| 1    | _bn0.weight                      |
| 2    | _bn0.bias                        |
| 3    | _bn0.running_mean                |
| 4    | _bn0.running_var                 |
| 5    | _bn0.num_batches_tracked         |
| 6    | _blocks.0._depthwise_conv.weight |
| 7    | _blocks.0._bn1.weight            |
| 8    | _blocks.0._bn1.bias              |
| 9    | _blocks.0._bn1.running_mean      |
| 10   | _blocks.0._bn1.running_var       |

#### 使用MindSpore加载MindSpore模型，并取得模型参数prams_ms

```python
import mindspore as ms
from test.efficientnet_mindspore.model import EfficientNet as EN_ms
import pandas as pd

mindspore_model = EN_ms.from_name(cfg['model'], override_params={'num_classes': 3})
prams_ms = mindspore_model.parameters_dict().keys()
prams_ms_lst = pd.DataFrame(prams_ms)
prams_ms_lst.to_csv('prams_ms.csv')
```

步骤结束后，我们就将MindSpore的模型参数存到了prams_ms.csv下，观察数据：

|      | keys                     |      |
| ---- | ------------------------ | ---- |
| 0    | _conv_stem.weight        |      |
| 1    | _bn0.moving_mean         |      |
| 2    | _bn0.moving_variance     |      |
| 3    | _bn0.gamma               |      |
| 4    | _bn0.beta                |      |
| 5    | 0._depthwise_conv.weight |      |
| 6    | 0._bn1.moving_mean       |      |
| 7    | 0._bn1.moving_variance   |      |
| 8    | 0._bn1.gamma             |      |
| 9    | 0._bn1.beta              |      |
| 10   | 0._se_reduce.weight      |      |

#### 将Pytorch模型的参数名和MindSpore模型参数名一一对应

自此我们就得到了MindSpore和Pytorch各自的参数键名表（附在附件区域），随后观察二者参数命名上的差异，可以发现固定的规律，以下述几个方面为例：

- Batch Normalization：
  - 权重：weight|bias——gamma|beta；
  - 移动加权和方差：running_mean|running_var——moving_mean|moving_variance；
- 自定义blocks：pytorch带前置的_blocks.；
- 其他

#### 键名映射表

这样就可以根据规律写出一个Python脚本来完成键名的转化，并生成键名映射表：

| Pytorch                          | mindspore                |
| -------------------------------- | ------------------------ |
| _conv_stem.weight                | _conv_stem.weight        |
| _bn0.weight                      | _bn0.gamma               |
| _bn0.bias                        | _bn0.beta                |
| _bn0.running_mean                | _bn0.moving_mean         |
| _bn0.running_var                 | _bn0.moving_variance     |
| _blocks.0._depthwise_conv.weight | 0._depthwise_conv.weight |
| _blocks.0._bn1.weight            | 0._bn1.gamma             |
| _blocks.0._bn1.bias              | 0._bn1.beta              |
| _blocks.0._bn1.running_mean      | 0._bn1.moving_mean       |
| _blocks.0._bn1.running_var       | 0._bn1.moving_variance   |
| _blocks.0._se_reduce.weight      | 0._se_reduce.weight      |

随后在Pytorch的权重字典中，按照对应文件的Pytorch_key取出权重值，随后使用mindspore.Parameter进行封装，添加到mindspore.key对应的权值中去：

```python
for i in ms_param_lst.values:
    ms_key = i
    pt_key = param_mapping[ms_key]
    pt_val = pt_values_dict[pt_key]
    if not isinstance(pt_val, np.ndarray):
        pt_val = pt_val.cpu().numpy()
    ms_val = Parameter(pt_val, ms_key)
    print(ms_val)
    ms_values_dict[ms_key] = ms_val
```

#### 使用MindSpore加载参数

```python
load_param_into_net(mindspore_model, ms_values_dict)
```

此时，参数应该就可以被MindSpore接受了。

### What's more

- 在参数值的存储过程中，要注意Pytorch和MindSpore参数精度的差异；

（完）