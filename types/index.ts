// types/index.ts

// اطلاعات هر کاربر برای نمایش در لیدربرد
export interface LeaderboardEntry {
  address: string;
  xp: number;
  level: number;
}

// نتیجه فیدینگ (خوراک دادن)
export interface FeedResultData {
  food: string;
  xp: number;
}

// ساختار اطلاعات NFT برای صفحه mint
export interface BunnyNFTMetadata {
  level: number;
  image: string;
  description: string;
}

// اطلاعات کاربران در پنل ادمین
export interface UserStats {
  address: string;
  xp: number;
  level: number;
  lastFed: number;
}
