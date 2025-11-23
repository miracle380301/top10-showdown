# 한일톱텐 차트 조회수 트래커

트롯가왕 출연자들의 YouTube 조회수를 추적하는 웹 애플리케이션입니다.

## 기능

- 가수별 노래 조회수 표시
- 채널별 조회수 분리 (트롯가왕, MBN Music)
- 티어 배지 (Gold: 500만+, Silver: 100만+)
- 가수 필터링
- 한국어/일본어 언어 전환
- YouTube 썸네일 및 링크

## 기술 스택

- Next.js 16
- TypeScript
- Tailwind CSS v4
- GitHub Actions (크론잡)

## 데이터 업데이트

GitHub Actions를 통해 하루 2회 자동 업데이트됩니다:
- KST 00:00 (UTC 15:00)
- KST 12:00 (UTC 03:00)

## 설정

### 환경 변수

GitHub Repository Secrets에 추가:
- `YOUTUBE_API_KEY`: YouTube Data API v3 키

### 로컬 개발

```bash
npm install
npm run dev
```

### 수동 업데이트

```bash
node scripts/update-snapshots.js
```

## 프로젝트 구조

```
├── app/
│   ├── page.tsx              # 메인 페이지
│   └── layout.tsx
├── components/
│   ├── SongCard.tsx          # 노래 카드
│   ├── ArtistSection.tsx     # 가수 섹션
│   ├── TierBadge.tsx         # 티어 배지
│   └── LanguageSwitch.tsx    # 언어 전환
├── public/data/
│   ├── videos.json           # 비디오 목록
│   └── snapshots.json        # 조회수 스냅샷
├── scripts/
│   └── update-snapshots.js   # 조회수 업데이트 스크립트
└── .github/workflows/
    └── update-snapshots.yml  # GitHub Actions 워크플로우
```

## 라이선스

MIT
