'use client';

import { useLanguage } from '@/lib/language-context';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLanguage('ko')}
        className={`px-2 py-1 rounded ${
          language === 'ko'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        KO
      </button>
      <button
        onClick={() => setLanguage('ja')}
        className={`px-2 py-1 rounded ${
          language === 'ja'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        JA
      </button>
    </div>
  );
}
