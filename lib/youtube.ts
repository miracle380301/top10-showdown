export async function getYouTubeViews(url: string): Promise<number> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    console.error('Invalid YouTube URL:', url);
    return 0;
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    console.error('YouTube API error:', response.statusText);
    return 0;
  }

  const data = await response.json();
  return parseInt(data.items?.[0]?.statistics?.viewCount || '0');
}

export function extractVideoId(url: string): string {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/v\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '';
}

export function calculateTier(totalViews: number): 'gold' | 'silver' | '' {
  if (totalViews >= 5_000_000) return 'gold';
  if (totalViews >= 1_000_000) return 'silver';
  return '';
}
