import SongCard from './SongCard';
import { VideoWithSnapshot, Language } from '@/types';

interface ArtistSectionProps {
  artist: string;
  songs: VideoWithSnapshot[];
  language: Language;
}

export default function ArtistSection({ artist, songs, language }: ArtistSectionProps) {
  // Sort songs by total views (descending)
  const sortedSongs = [...songs].sort((a, b) => {
    const aViews = a.snapshots[0]?.total_views || 0;
    const bViews = b.snapshots[0]?.total_views || 0;
    return bViews - aViews;
  });

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
        {artist}
      </h2>
      <div className="space-y-3">
        {sortedSongs.map((song, index) => (
          <SongCard key={song.id} video={song} rank={index + 1} language={language} />
        ))}
      </div>
    </section>
  );
}
