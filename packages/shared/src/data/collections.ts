// 由 scripts/build_collections.py 生成，不要手改。视频来自 Wikimedia Commons（自由许可，署名见 source），
// 由 jsDelivr 从 media-NN 分支提供；字幕在 apps/web/public/subs，打开卡片时再加载。
import type { Video } from '../types';

export const COLLECTION_VIDEOS: Array<Omit<Video, 'ownerId' | 'createdAt' | 'subtitles'>> = [];
