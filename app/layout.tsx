import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  title: '한일톱텐 차트 조회수 트래커',
  description: '가수별 노래 조회수를 추적하는 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
