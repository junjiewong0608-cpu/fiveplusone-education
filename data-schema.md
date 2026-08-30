# 资料结构草稿

## 学生资料 `Students`

一位学生一行。正式 ID 可由系统批量生成，前端不直接读取整张表。

| 字段 | 说明 |
|---|---|
| studentId | 唯一学生 ID |
| studentName | 学生姓名 |
| branch | 分行 |
| classNameLegacy | 旧版班级/年级显示；正式班级请使用 `Classes` + `ClassStudents` |
| avatar | 学生头像或默认图标 |
| petName | 宠物名称 |
| petType | 宠物种类 |
| petRarity | 宠物稀有度：A / R / SR / SSR / LEGEND |
| petLevel | 宠物等级 |
| experience | 经验值 |
| coins | 金币 |
| totalStars | 累计星星 |
| streak | 连续打卡天数 |
| lastCheckinDate | 上次打卡日期 |
| ownedItems | 已拥有的装备 ID，可先用 JSON |
| equippedItems | 已装备的装备，可先用 JSON |
| status | active / inactive |

## 班级资料 `Classes`

一位老师可以有多个班。老师端会先用 `teacherId` 查这里。

| 字段 | 说明 |
|---|---|
| classId | 唯一班级 ID，例如 Y3-A |
| className | 班级显示名称 |
| teacherId | 负责老师 ID |
| branch | 分行 |
| status | active / archived |
| createdAt | 创建时间 |
| updatedAt | 更新时间 |

## 班级学生关系 `ClassStudents`

一个学生可以出现在多个班级，所以不要只把班级写死在 `Students`。

| 字段 | 说明 |
|---|---|
| membershipId | 唯一关系 ID |
| classId | 班级 ID |
| studentId | 学生 ID |
| status | active / removed |
| addedAt | 加入时间 |
| removedAt | 移除时间 |

## 打卡记录 `DailyCheckins`

一份已完成的打卡一行。逐题答案可以另建 `QuestionDetails`，不要把长 JSON 放在教师主表。

| 字段 | 说明 |
|---|---|
| recordId | 唯一记录 ID |
| studentId | 学生 ID |
| date | 打卡日期 |
| subject | 科目 |
| score | 答对数量 |
| total | 题目总数 |
| totalStars | 本次星星 |
| coinsEarned | 本次金币 |
| experienceEarned | 本次经验 |
| durationSeconds | 用时 |
| createdAt | 写入时间 |

后端写入新打卡记录时，会同步更新 `Students` 的 `petLevel`、`experience`、`coins`、`totalStars`、`streak` 和 `lastCheckinDate`。如果同一个 `recordId` 已经存在，后端不会重复加奖励。

## 题库 `QuestionBank`

正式版本建议让 Apps Script 从题库抽取题目，并在后端重新验证答案，避免学生直接查看前端答案。

```text
questionId, subject, grade, question, optionA, optionB, optionC, optionD, answer, explanation, points, active
```

## 装备目录 `EquipmentCatalog`

正式装备目录只保留角色专属装备素材，目录使用 `assets/equipment-items/exclusive/<petId>/`，每个角色对应 4 或 6 件独立装备图片。

```text
itemId, itemName, englishName, tier, slot, price, requiredPetRarity, imagePath, description, hp, attack, defense, speed, luck, active, exclusivePetId
```

- 角色专属套装：Shadow Wing、Flame Rex、Thunder Beetle、Frost Fang、Volt Cheetah、Shadow Stalker 各 6 件；其余 19 个角色各 4 件。
- `tier`：史诗 / 神话 / 传说
- `slot`：weapon / head / body / hands / feet / accessory
- `imagePath`：实际切片图片路径，不再使用 emoji 或通用装备占位图
- 属性字段由装备图鉴说明映射，装备后实时叠加到宠物最终属性

## 宠物属性与战斗值

```text
petId, petName, rarity, baseHp, baseAttack, baseDefense, baseSpeed, baseLuck, imagePath, active
```

学生当前战斗值由以下资料实时计算，不建议重复保存计算结果：

```text
宠物基础属性 + 宠物等级成长 + 左装备属性 + 右装备属性 = 最终属性
```


## 之后可以增加的表

- `QuestionDetails`：逐题答题、尝试次数、提示使用情况
- `PurchaseLedger`：每次购买记录
- `TeacherRewards`：教师课堂表现奖励、补发金币或备注
- `MessageWall`：学生分享角色卡、点赞和预设留言
- `DailyMissions`：每日特别任务

## 老师奖励 `TeacherRewards`

老师端或 Sheet 菜单每次加分，后端会写一行记录，并限制每位学生每天课堂奖励最高 100 金币。

| 字段 | 说明 |
|---|---|
| rewardId | 唯一奖励记录 ID |
| teacherId | 老师 ID |
| classId | 班级 ID |
| studentId | 学生 ID |
| amount | 本次增加金币，Sheet 快捷按钮支持 20 / 50 / 100 上限 |
| reason | 奖励原因，例如 课堂表现 |
| createdAt | 写入时间 |

## 留言墙 `MessageWall`

学生端只能从预设句子中选择发帖和留言，避免自由输入造成管理风险。

| 字段 | 说明 |
|---|---|
| postId | 唯一留言墙记录 ID |
| studentId | 分享学生 ID |
| studentName | 分享学生姓名 |
| message | 预设分享文字 |
| petType | 当前宠物种类 |
| petName | 当前宠物名字 |
| petRarity | 当前显示稀有度 |
| petLevel | 当前显示等级 |
| combatPower | 分享时战斗值 |
| petImage | 分享时角色卡图片路径 |
| petStats | 分享时五项属性快照，JSON：生命、攻击、防御、速度、幸运 |
| equipment | 分享时已装备物品快照，JSON：装备名称、部位、图片 |
| likedBy | 点赞学生 ID 列表，JSON |
| comments | 预设留言列表，JSON |
| createdAt | 分享时间 |
| updatedAt | 最近互动时间 |
