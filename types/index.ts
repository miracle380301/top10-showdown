export interface Video {
  id: string;
  artist: string;
  artist_ja?: string;
  song: string;
  song_ja?: string;
  url1: string;
  url1_channel: string;
  url2: string;
  url2_channel: string;
  benefit_points: number;
  created_at: string;
}

export type Language = 'ko' | 'ja';

export interface Snapshot {
  id: string;
  video_id: string;
  url1_views: number;
  url2_views: number;
  total_views: number;
  tier: 'gold' | 'silver' | '';
  created_at: string;
}

export interface VideoWithSnapshot extends Video {
  snapshots: Snapshot[];
}

export interface GroupedVideos {
  [artist: string]: VideoWithSnapshot[];
}
