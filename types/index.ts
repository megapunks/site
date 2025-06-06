// types/index.ts


export interface LeaderboardEntry {
  address: string;
  xp: number;
  level: number;
}


export interface FeedResultData {
  food: string;
  xp: number;
}


export interface BunnyNFTMetadata {
  level: number;
  image: string;
  description: string;
}


export interface UserStats {
  address: string;
  xp: number;
  level: number;
  lastFed: number;
}
