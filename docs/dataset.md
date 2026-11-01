# 数据字段说明

源数据 `data/exercises.json` 是一个数组，共 1324 条动作记录。每条记录字段如下：

## 字段总览

| 字段 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `id` | string | 唯一数字标识 | `"0001"` |
| `name` | string | 动作名称 | `"3/4 sit-up"` |
| `category` | string | 类别（= 训练部位，10 种） | `"waist"` |
| `body_part` | string | 训练部位（10 种） | `"waist"` |
| `equipment` | string | 所需器械（28 种） | `"body weight"` |
| `target` | string | 目标肌肉（19 种） | `"abs"` |
| `muscle_group` | string | 主肌群 | `"hip flexors"` |
| `secondary_muscles` | string[] | 辅助肌群列表 | `["hip flexors","lower back"]` |
| `instructions` | object | 10 语言完整说明（键为语言代码） | `{"en": "...", "zh": "..."}` |
| `instruction_steps` | object | 10 语言分步说明（每语言为数组） | `{"en": ["步骤1", ...]}` |
| `image` | string | 缩略图路径（180×180） | `"images/0001-2gPfomN.jpg"` |
| `gif_url` | string | 演示 GIF 路径 | `"videos/0001-2gPfomN.gif"` |
| `media_id` | string | 媒体文件标识 | `"2gPfomN"` |
| `attribution` | string | 媒体署名 | `"© Gym visual — https://gymvisual.com/"` |
| `created_at` | string | 数据创建时间 | ISO 8601 |

## 取值枚举

- **训练部位 / 类别（10）**：back · cardio · chest · lower arms · lower legs · neck · shoulders · upper arms · upper legs · waist
- **器械（28）**：assisted · band · barbell · body weight · bosu ball · cable · dumbbell · elliptical machine · ez barbell · hammer · kettlebell · leverage machine · medicine ball · olympic barbell · resistance band · roller · rope · skierg machine · sled machine · smith machine · stability ball · stationary bike · stepmill machine · tire · trap bar · upper body ergometer · weighted · wheel roller
- **目标肌肉（19）**：abductors · abs · adductors · biceps · calves · cardiovascular system · delts · forearms · glutes · hamstrings · lats · levator scapulae · pectoralis · quads · serratus anterior · spine · traps · triceps · upper back
- **语言（10）**：en · es · it · tr · ru · zh · hi · pl · ko · fr

## 派生数据文件

`scripts/build_data.py` 从 `exercises.json` 生成以下文件：

- **exercises.csv**：每条一行，含中英说明与主/辅助肌群（辅助肌群以 `; ` 连接）
- **exercises.sqlite.sql / exercises.postgres.sql**：建表语句 + 1324 条 INSERT；`instructions` 与 `instruction_steps` 以 JSON 字符串存储，完整保留 10 种语言
- **stats.json**：总量、各维度分布、语言覆盖、媒体完整性校验结果

## 注意事项

- 媒体（缩略图与 GIF）版权归 Gym visual 所有，使用时必须保留每条记录中的 `attribution` 字段，详见 [NOTICE.md](../NOTICE.md)。
- 本数据集不包含难度、卡路里等运动科学字段（无权威来源，不虚构）。
