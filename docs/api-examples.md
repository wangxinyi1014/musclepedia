# API 使用示例

以下示例均基于 `data/exercises.json`，演示常见的数据消费方式。

## Python

```python
import json
from pathlib import Path

exercises = json.loads(Path("data/exercises.json").read_text(encoding="utf-8"))

# 1. 按目标肌肉过滤
chest_exercises = [e for e in exercises if e["target"] == "pectoralis"]
print(f"胸部目标动作: {len(chest_exercises)}")

# 2. 组合筛选：哑铃 + 上臂 + 肱二头肌
result = [
    e for e in exercises
    if e["equipment"] == "dumbbell"
    and e["body_part"] == "upper arms"
    and e["target"] == "biceps"
]
for e in result[:5]:
    print(" -", e["name"])

# 3. 取中文分步说明
e = exercises[0]
steps_zh = e["instruction_steps"].get("zh", [])
for i, step in enumerate(steps_zh, 1):
    print(f"第{i}步: {step}")

# 4. 输出所有无器械动作
bodyweight = [e for e in exercises if e["equipment"] == "body weight"]
print(f"徒手动作: {len(bodyweight)}")
```

## JavaScript / TypeScript（浏览器或 Node）

```js
const exercises = await (await fetch('data/exercises.json')).json();

// 1. 搜索 + 筛选
const q = 'bench';
const hits = exercises.filter(e =>
  e.name.toLowerCase().includes(q) ||
  e.instructions.en.toLowerCase().includes(q)
);
console.log(`匹配 ${hits.length} 个动作`);

// 2. 按训练部位分组
const byPart = {};
for (const e of exercises) {
  (byPart[e.body_part] ??= []).push(e);
}
console.log(Object.keys(byPart));

// 3. 随机抽取 5 个动作
const rand = [...exercises].sort(() => Math.random() - 0.5).slice(0, 5);
rand.forEach(e => console.log(e.name, e.gif_url));
```

## SQL（SQLite / PostgreSQL）

导入生成好的 SQL 文件后：

```sql
-- 查询目标肌为 biceps 的动作
SELECT id, name, equipment
FROM exercises
WHERE target = 'biceps';

-- 查询无器械且训练部位为 waist 的动作
SELECT id, name
FROM exercises
WHERE equipment = 'body weight' AND body_part = 'waist';

-- 统计各器械数量
SELECT equipment, COUNT(*) AS n
FROM exercises
GROUP BY equipment
ORDER BY n DESC;

-- 读取中文说明（instructions 为 JSON 字符串）
SELECT name,
       json_extract(instructions, '$.zh') AS zh   -- SQLite
       -- instructions->>'zh' AS zh              -- PostgreSQL
FROM exercises
LIMIT 5;
```

## 用 LLM 生成后端 API

把下面的提示词粘贴给 ChatGPT / Claude / Gemini，即可生成一个完整的 REST API（选择你熟悉的框架）：

> 我有一份健身动作数据 `data/exercises.json`（1324 条，字段：id、name、category、body_part、equipment、target、muscle_group、secondary_muscles、instructions（10 语言 JSON）、instruction_steps（10 语言 JSON）、image、gif_url）。请用 [Express.js / FastAPI / ASP.NET Core / Spring Boot / Laravel / Gin] 生成一个 REST API：支持分页列表、按 body_part / equipment / target 组合筛选、关键词搜索 name，以及按 id 获取详情。数据库用 [SQLite / PostgreSQL]，表结构见 `data/exercises.sqlite.sql`。
