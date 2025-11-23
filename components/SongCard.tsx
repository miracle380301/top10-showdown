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
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 sm:gap-4">
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
              className="w-24 sm:w-32 h-auto object-cover rounded hover:opacity-80 transition-opacity"
            />
          </a>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-gray-500">{rank}.</span>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{songName}</h3>
            {snapshot?.tier && <TierBadge tier={snapshot.tier} />}
          </div>

          {snapshot ? (
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {formatNumber(snapshot.total_views)} {language === 'ja' ? '再生' : '조회수'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {video.url1_channel}: {formatNumber(snapshot.url1_views)}{video.url2_channel && ` | ${video.url2_channel}: ${formatNumber(snapshot.url2_views)}`}
              </p>
              {video.benefit_points > 0 && (
                <p className="text-xs sm:text-sm text-green-600">
                  {language === 'ja' ? 'ベネフィット' : '베네핏'}: +{formatNumber(video.benefit_points)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm">
              {language === 'ja' ? 'データがありません' : '아직 데이터가 없습니다'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
