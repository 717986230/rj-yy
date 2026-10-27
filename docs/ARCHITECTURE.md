# Vido 架构说明

## 总览

```mermaid
flowchart LR
  subgraph Browser["浏览器（GitHub Pages）"]
    Pages["pages/*\n登录 · 播放 · 片库"] --> Services
    Services["services/\napi · player"] --> Shared
    Pages --> Components["components/\n字幕层 · 欢迎卡 · 吉祥物"]
  end
  Services -- "VITE_API_BASE 为空" --> Local[(localStorage\nLocalApi)]
  Services -- "VITE_API_BASE 已配置" --> Server["apps/server\nExpress + SQLite"]
  Server --> Shared["packages/shared\n类型 · 契约 · 字幕 · 播放队列"]
  Services -. "video 外链播放" .-> CDN["外部视频站点"]
```

三层：

1. **packages/shared**：前后端共用的纯 TypeScript 代码，不依赖 DOM 或 Node。
   - `types.ts`：`Video`、`SubtitleTracks`、`PlayMode`，以及前后端唯一契约 `ApiClient`。
   - `subtitles.ts`：WebVTT / SRT 解析、二分查找当前字幕、按时间取「中文 + 第二语言」。
   - `playlist.ts`：三种播放模式的队列逻辑（顺序循环、洗牌袋随机、手动抽卡）与历史回退。
   - `seed.ts`：内置外链片库与三语示例字幕。
2. **apps/web**：无框架的 TypeScript + Tailwind 前端，按 `app / services / components / pages` 分层。
3. **apps/server**：可选后端，实现与 `ApiClient` 一一对应的 REST 接口。

## 数据来源可切换

`apps/web/src/services/api/index.ts` 在构建时决定使用哪个实现：

| 实现 | 何时使用 | 存储 |
| --- | --- | --- |
| `LocalApi` | `VITE_API_BASE` 为空（GitHub Pages 默认） | 浏览器 localStorage；密码用 PBKDF2-SHA256 + 随机盐哈希 |
| `HttpApi` | 配置了 `VITE_API_BASE` | 后端 SQLite；密码 bcrypt；会话 JWT（7 天） |

两者实现同一个 `ApiClient` 接口，并复用 shared 里的校验规则，因此页面代码不关心数据在哪里。

## 播放与字幕同步

`services/player.ts` 中的 `VideoEngine` 封装 `<video>`：

- 加载外链、播放 / 暂停、跳转、音量；有声自动播放被拦截时自动静音重试。
- **时钟**：播放时用 `requestVideoFrameCallback` 获取每一帧对应的 `mediaTime`（帧级精度），不支持的浏览器退回 `requestAnimationFrame` 读取 `currentTime`；暂停、拖动时由 `seeked` / `timeupdate` 补发。
- 每次时钟触发，`SubtitleOverlay` 用二分查找分别取中文轨和所选第二语言轨的当前句，仅在文字变化时更新 DOM。

中文与德语 / 英语是**独立的字幕轨**，各自有时间轴，因此可以导入时间轴不同的字幕文件；切换「中·德 / 中·英」只换下方那一轨，立即生效。

## 卡牌翻转

`.card` 使用 CSS 3D（`preserve-3d` + `backface-visibility`）。抽卡流程：

1. 如已翻开，先翻回背面（0.64s）；
2. 卡堆洗牌动画（0.46s），同时并行请求视频详情；
3. 填充正面信息并翻到正面，翻转过半时开始加载并播放外链。

## 路由

Hash 路由（`#/login`、`#/play`、`#/library`、`#/reset/<token>`），GitHub Pages 无需服务端重写，刷新与分享链接都可用。`auth` 路由未登录时跳转登录页，`guestOnly` 路由已登录时跳到播放页。

## 测试

| 范围 | 文件 |
| --- | --- |
| 字幕解析、时间查找、双语对齐 | `packages/shared/test/subtitles.test.ts` |
| 三种播放模式、历史回退、示例片库校验 | `packages/shared/test/playlist.test.ts` |
| 本地模式账号与片库 | `apps/web/test/local-api.test.ts` |
| 字幕层渲染、语言切换、偏移 | `apps/web/test/subtitle-overlay.test.ts` |
| 后端接口（注册登录、重置密码、片库权限、字幕导出） | `apps/server/test/api.test.ts` |

`npm run check` 运行类型检查与全部测试；CI 在每次推送和 PR 上执行。
