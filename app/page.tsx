'use client';

import { useState, useEffect } from 'react';
import ArtistSection from '@/components/ArtistSection';
import SongCard from '@/components/SongCard';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLanguage } from '@/lib/language-context';
import { VideoWithSnapshot, GroupedVideos } from '@/types';
import { formatDate } from '@/lib/utils';

export default function Home() {
  const [videos, setVideos] = useState<VideoWithSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<string>('마사야');
  const { language } = useLanguage();

  useEffect(() => {
    fetchVideos();
  }, []);

  // Update selectedArtist when language changes
  useEffect(() => {
    if (!selectedArtist || videos.length === 0) return;

    // Build artist name mapping (ko <-> ja)
    const koToJa: Record<string, string> = {};
    const jaToKo: Record<string, string> = {};

    videos.forEach(video => {
      const koNames = video.artist.split(/[,，]/).map(name => name.trim());
      const jaNames = video.artist_ja ? video.artist_ja.split(/[,，]/).map(name => name.trim()) : koNames;

      koNames.forEach((ko, i) => {
        const ja = jaNames[i] || ko;
        if (!koToJa[ko]) koToJa[ko] = ja;
        if (!jaToKo[ja]) jaToKo[ja] = ko;
      });
    });

    if (language === 'ja') {
      // Convert ko -> ja
      const jaName = koToJa[selectedArtist];
      if (jaName && jaName !== selectedArtist) {
        setSelectedArtist(jaName);
      }
    } else {
      // Convert ja -> ko
      const koName = jaToKo[selectedArtist];
      if (koName && koName !== selectedArtist) {
        setSelectedArtist(koName);
      }
    }
  }, [language, videos]);

  const fetchVideos = async () => {
    try {
      // Load videos and snapshots from JSON files
      const [videosRes, snapshotsRes] = await Promise.all([
        fetch('/data/videos.json'),
        fetch('/data/snapshots.json')
      ]);

      const videosData = await videosRes.json();
      const snapshotsData = await snapshotsRes.json();

      // Merge videos with their snapshots
      const videosWithSnapshots = videosData.map((video: { id: string }) => ({
        ...video,
        snapshots: snapshotsData.data[video.id] ? [snapshotsData.data[video.id]] : []
      }));

      setVideos(videosWithSnapshots);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique individual artist names for the select dropdown
  const excludedArtists = ['린', '조째즈', '김다현', '요요미', '윤미라', '마리아', '민은경', '민수현', '황민호', '성리', '신영숙', '윤수현', '환희', '김미령', '후타미소이치', '손승연', '서영은', '박민주', 'リン', 'ジョジェズ', 'キムダヒョン', 'ヨヨミ', 'ユンミラ', 'マリア', 'ミンウンギョン', 'ミンスヒョン', 'ファンミノ', 'ソンリ', 'シンヨンスク', 'ユンスヒョン', 'ファンヒ', 'キムミリョン', 'フタミソウイチ', 'ソンスンヨン', 'ソヨンウン', 'パクミンジュ'];
  const uniqueArtists = [...new Set(
    videos.flatMap(video => {
      const artistName = language === 'ja' && video.artist_ja ? video.artist_ja : video.artist;
      // Split by comma and various separators, then trim
      return artistName.split(/[,，]/).map(name => name.trim());
    })
  )].filter(artist => !excludedArtists.includes(artist)).sort();

  // Filter videos based on selected artist
  const filteredVideos = selectedArtist
    ? videos.filter(video => {
        const artistName = language === 'ja' && video.artist_ja ? video.artist_ja : video.artist;
        return artistName.includes(selectedArtist);
      })
    : videos;

  // Sort filtered videos by total views (descending) when artist is selected
  const sortedFilteredVideos = selectedArtist
    ? [...filteredVideos].sort((a, b) => {
        const aViews = a.snapshots[0]?.total_views || 0;
        const bViews = b.snapshots[0]?.total_views || 0;
        return bViews - aViews;
      })
    : filteredVideos;

  // Group by artist (only when no artist filter is selected)
  const groupedByArtist: GroupedVideos = selectedArtist
    ? {} // Empty when artist is selected, we'll show flat list instead
    : filteredVideos.reduce((acc, video) => {
        const artistName = language === 'ja' && video.artist_ja ? video.artist_ja : video.artist;
        if (!acc[artistName]) {
          acc[artistName] = [];
        }
        acc[artistName].push(video);
        return acc;
      }, {} as GroupedVideos);

  // Get latest update time
  const latestUpdate = videos
    .flatMap(v => v.snapshots)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-gray-500">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            {language === 'ja' ? '日韓トップテン再生数トラッカー' : '한일톱텐 조회수 트래커'}
          </h1>
          <LanguageSwitch />
        </div>
        {latestUpdate && (
          <p className="text-sm text-gray-500">
            {language === 'ja' ? '最終更新: ' : '마지막 업데이트: '}{formatDate(latestUpdate.created_at)}
          </p>
        )}
        <div className="text-xs text-gray-400 mt-1">
          <p>
            {language === 'ja'
              ? '🥈 100万回以上 = シルバー / 🥇 500万回以上 = ゴールド'
              : '🥈 100만회 이상 = 실버 / 🥇 500만회 이상 = 골드'}
          </p>
          <p className="text-[10px] sm:text-xs">
            {language === 'ja'
              ? '(トロット歌王 + MBN Music + ベネフィット)'
              : '(트롯가왕 + MBN Music + 베네핏)'}
          </p>
        </div>

        <div className="mt-4">
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">
              {language === 'ja' ? '全てのアーティスト' : '전체 가수'}
            </option>
            {uniqueArtists.map(artist => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </div>
      </header>

      {selectedArtist ? (
        // When artist is selected, show flat list sorted by views
        sortedFilteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === 'ja' ? '該当する動画がありません。' : '해당하는 영상이 없습니다.'}
            </p>
          </div>
        ) : (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
              {selectedArtist} ({sortedFilteredVideos.length}{language === 'ja' ? '曲' : '곡'})
            </h2>
            <div className="space-y-3">
              {sortedFilteredVideos.map((video, index) => (
                <SongCard key={video.id} video={video} rank={index + 1} language={language} />
              ))}
            </div>
          </section>
        )
      ) : Object.keys(groupedByArtist).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {language === 'ja' ? '登録された動画がありません。' : '등록된 영상이 없습니다.'}
          </p>
        </div>
      ) : (
        Object.entries(groupedByArtist).map(([artist, songs]) => (
          <ArtistSection key={artist} artist={artist} songs={songs} language={language} />
        ))
      )}
    </main>
  );
}
