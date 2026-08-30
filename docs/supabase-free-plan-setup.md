# CY PETS LAND Supabase 免费方案设置

这份指南的目标是：游戏资料和学生名单都改用 Supabase 免费版。Google Sheet 只作为旧资料迁移参考，不再作为学生端备用资料来源。

## 1. 创建 Supabase Project

1. 打开 https://supabase.com
2. 登录后点击 `New project`
3. Project name 建议填 `your-cy-pets-project`
4. Region 选离马来西亚近的地区，例如 Singapore
5. Pricing plan 选择 Free
6. 等待 project 创建完成

## 2. 建立资料表

1. 进入 Supabase project
2. 左边打开 `SQL Editor`
3. 新建 query
4. 把项目里的 `supabase/schema.sql` 全部贴进去
5. 点击 `Run`

如果成功，会建立这些主要资料表：

- `students`
- `student_game_states`
- `daily_checkins`
- `purchase_ledger`
- `teacher_rewards`
- `wall_posts`
- `wall_likes`
- `wall_comments`

## 3. 部署 Edge Function

目前项目使用一个 Supabase Edge Function：

- `cy-pets-api`

它负责：

- 登录读取学生资料
- 保存金币、宠物、装备、经验和打卡状态
- 保存留言墙分享
- 点赞
- 留言

部署方式可以用 Supabase CLI：

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy cy-pets-api
supabase secrets set SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
```

注意：`SUPABASE_SERVICE_ROLE_KEY` / secret key 只能放在 Supabase secrets，不能写进前端 `app.js`。

## 4. 填入前端公开配置

在 `app.js` 的 `APP_CONFIG` 填：

```js
backendMode: 'supabase',
backendUrl: '',
supabaseFunctionUrl: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cy-pets-api',
supabaseAnonKey: 'YOUR_ANON_KEY',
```

`anon key` 或 publishable key 可以放前端，`service role key` / secret key 不可以。

## 5. 生产模式

`backendMode: 'supabase'` 的意思是：

1. 学生登录、保存、老师加分和社交功能都走 Supabase
2. 学生端不会再自动读取旧 Google Apps Script / Google Sheet
3. 本机 localStorage 只作为临时缓存，不作为权威资料

这样可以避免旧名单或旧宠物资料在后台同步时把 Supabase 新资料覆盖回去。

## 6. 免费版注意事项

- 图片继续放 Netlify，不放 Supabase。
- 留言墙同一个学生只保留一篇分享。
- 留言墙不用 realtime，避免占用免费版连接数。
- 每个学生游戏状态存成一条 JSON，减少资料表膨胀。
- 建议上线后每周从 Supabase 导出一次备份。
