const fs = require('fs');
const path = require('path');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('YOUTUBE_API_KEY is required');
  process.exit(1);
}

// Extract video ID from YouTube URL
function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get YouTube views
async function getYouTubeViews(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return 0;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return parseInt(data.items[0].statistics.viewCount, 10);
    }
    return 0;
  } catch (error) {
    console.error(`Error fetching views for ${videoId}:`, error.message);
    return 0;
  }
}

// Calculate tier
function calculateTier(totalViews) {
  if (totalViews >= 5_000_000) return 'gold';
  if (totalViews >= 1_000_000) return 'silver';
  return '';
}

async function main() {
  // Read videos
  const videosPath = path.join(__dirname, '..', 'public', 'data', 'videos.json');
  const videos = JSON.parse(fs.readFileSync(videosPath, 'utf-8'));

  console.log(`Processing ${videos.length} videos...`);

  // Build new snapshots
  const newSnapshots = {
    updated_at: new Date().toISOString(),
    data: {}
  };

  let successCount = 0;
  let errorCount = 0;

  for (const video of videos) {
    try {
      const url1Views = await getYouTubeViews(video.url1);
      const url2Views = await getYouTubeViews(video.url2);
      const totalViews = url1Views + url2Views + (video.benefit_points || 0);
      const tier = calculateTier(totalViews);

      newSnapshots.data[video.id] = {
        id: `snapshot-${video.id}-${Date.now()}`,
        video_id: video.id,
        url1_views: url1Views,
        url2_views: url2Views,
        total_views: totalViews,
        tier: tier,
        created_at: new Date().toISOString()
      };

      console.log(`${video.artist} - ${video.song}: ${totalViews.toLocaleString()} (${tier || 'none'})`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing ${video.artist} - ${video.song}:`, error.message);
      errorCount++;
    }
  }

  // Write snapshots
  const snapshotsPath = path.join(__dirname, '..', 'public', 'data', 'snapshots.json');
  fs.writeFileSync(snapshotsPath, JSON.stringify(newSnapshots, null, 2));

  console.log(`\nCompleted: ${successCount} success, ${errorCount} errors`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
