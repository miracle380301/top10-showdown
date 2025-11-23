import TierBadge from './TierBadge';
import { formatNumber } from '@/lib/utils';
import { extractVideoId } from '@/lib/youtube';
import { VideoWithSnapshot, Language } from '@/types';

interface SongCardProps {
  video: VideoWithSnapshot;
  rank: number;
  language: Language;
}

export default function SongCard({ video, rank, language }: SongCardProps) {
  const snapshot = video.snapshots[0];
  const songName = language === 'ja' && video.song_ja ? video.song_ja : video.song;
  const videoId = extractVideoId(video.url2 || video.url1);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {thumbnailUrl && (
          <a
            href={video.url2 || video.url1}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src={thumbnailUrl}
              alt={songName}
              className="w-32 h-18 object-cover rounded hover:opacity-80 transition-opacity"
            />
          </a>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-500">{rank}.</span>
            <h3 className="text-lg font-semibold text-gray-900">{songName}</h3>
            {snapshot?.tier && <TierBadge tier={snapshot.tier} />}
          </div>

          {snapshot ? (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(snapshot.total_views)} {language === 'ja' ? '再生' : '조회수'}
              </p>
              <p className="text-sm text-gray-500">
                {video.url1_channel}: {formatNumber(snapshot.url1_views)}{video.url2_channel && ` | ${video.url2_channel}: ${formatNumber(snapshot.url2_views)}`}
              </p>
              {video.benefit_points > 0 && (
                <p className="text-sm text-green-600">
                  {language === 'ja' ? 'ベネフィット' : '베네핏'}: +{formatNumber(video.benefit_points)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              {language === 'ja' ? 'データがありません' : '아직 데이터가 없습니다'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
