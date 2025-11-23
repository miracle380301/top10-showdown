'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video } from '@/types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    artist: '',
    artist_ja: '',
    song: '',
    song_ja: '',
    url1: '',
    url1_channel: '',
    url2: '',
    url2_channel: '',
    benefit_points: 0
  });
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await fetch('/api/videos');
    const { data } = await res.json();
    setVideos(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('등록 완료!');
        setFormData({
          artist: '',
          artist_ja: '',
          song: '',
          song_ja: '',
          url1: '',
          url1_channel: '',
          url2: '',
          url2_channel: '',
          benefit_points: 0
        });
        fetchVideos();
      } else {
        const error = await res.json();
        setMessage(`오류: ${error.error}`);
      }
    } catch {
      setMessage('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchVideos();
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← 뒤로
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          새 영상 등록
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가수명 *
            </label>
            <input
              type="text"
              placeholder="NewJeans"
              value={formData.artist}
              onChange={e => setFormData({...formData, artist: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가수명 (일본어)
            </label>
            <input
              type="text"
              placeholder="ニュージーンズ"
              value={formData.artist_ja}
              onChange={e => setFormData({...formData, artist_ja: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              노래명 *
            </label>
            <input
              type="text"
              placeholder="Ditto"
              value={formData.song}
              onChange={e => setFormData({...formData, song: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              노래명 (일본어)
            </label>
            <input
              type="text"
              placeholder="ディット"
              value={formData.song_ja}
              onChange={e => setFormData({...formData, song_ja: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL 1 *
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=xxx"
              value={formData.url1}
              onChange={e => setFormData({...formData, url1: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 1 채널명 *
            </label>
            <input
              type="text"
              placeholder="HYBE LABELS"
              value={formData.url1_channel}
              onChange={e => setFormData({...formData, url1_channel: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL 2 *
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=yyy"
              value={formData.url2}
              onChange={e => setFormData({...formData, url2: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 2 채널명 *
            </label>
            <input
              type="text"
              placeholder="1theK"
              value={formData.url2_channel}
              onChange={e => setFormData({...formData, url2_channel: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              베네핏 포인트 (선택)
            </label>
            <input
              type="number"
              placeholder="50000"
              value={formData.benefit_points || ''}
              onChange={e => setFormData({...formData, benefit_points: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 px-4 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      </form>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          등록된 영상 목록
        </h2>
        {videos.length === 0 ? (
          <p className="text-gray-500 text-sm">등록된 영상이 없습니다.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y">
            {videos.map(video => (
              <div key={video.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {video.artist} - {video.song}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    베네핏: {video.benefit_points.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
