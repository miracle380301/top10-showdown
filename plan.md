# 차트 누적 조회수 트래커 - GitHub 정적 파일 버전

## 🎯 단일 페이지 앱

**메인 페이지**: 가수별 노래 리스트 + 실버/골드 현황 + 가수 필터

---

## 📊 데이터 저장

### 정적 JSON 파일 (public/data/)
- `videos.json` - 전체 비디오 목록
- `snapshots.json` - 최신 조회수 스냅샷

### 데이터 업데이트 흐름
1. Vercel 크론잡 실행 (00시, 12시)
2. YouTube API로 조회수 수집
3. GitHub API로 snapshots.json 커밋
4. 커밋으로 Vercel 자동 재배포 트리거

---

## 📁 프로젝트 구조
```
top10-showdown/
├── app/
│   ├── page.tsx                    # 메인: 가수별 노래 리스트
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── cron/
│           └── route.ts            # 크론잡 (GitHub 커밋)
│
├── components/
│   ├── ArtistSection.tsx           # 가수별 섹션
│   ├── SongCard.tsx                # 노래 카드 (썸네일 포함)
│   ├── TierBadge.tsx               # 티어 배지 (Gold/Silver)
│   └── LanguageSwitch.tsx          # 언어 전환 (KO/JA)
│
├── lib/
│   ├── youtube.ts                  # YouTube API
│   ├── utils.ts                    # 유틸리티
│   └── language-context.tsx        # 언어 상태 관리
│
├── public/
│   └── data/
│       ├── videos.json             # 비디오 데이터
│       └── snapshots.json          # 조회수 스냅샷
│
├── types/
│   └── index.ts                    # 타입 정의
│
├── .env.local
├── .env.local.example
├── next.config.js
├── vercel.json                     # 크론잡 설정
└── package.json
```

---

## 🎨 UI 디자인

### 메인 페이지 (/)
```
┌─────────────────────────────────────────────────────┐
│  🎵 차트 누적 조회수 트래커            [KO] [JA]    │
│  🔄 마지막 업데이트: 2024-11-24 12:00              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [ 가수 선택 ▼ ]  (기본: 마사야)                    │
│                                                      │
│  👤 마사야 (15곡)                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                      │
│  ┌──────┬─────────────────────────────────────┐    │
│  │ 썸네일 │ 1. TSUNAMI                   🥇 Gold │    │
│  │      │    5,234,567 조회수                   │    │
│  │      │    트롯가왕: 2,500,000 | MBN: 2,700,000│    │
│  │      │    베네핏: +34,567                    │    │
│  └──────┴─────────────────────────────────────┘    │
│                                                      │
│  ┌──────┬─────────────────────────────────────┐    │
│  │ 썸네일 │ 2. 파도                     🥈 Silver│    │
│  │      │    1,456,789 조회수                   │    │
│  │      │    트롯가왕: 800,000 | MBN: 626,789   │    │
│  │      │    베네핏: +30,000                    │    │
│  └──────┴─────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 크론잡 API

### GET /api/cron
```typescript
// 동작
1. GitHub에서 videos.json 가져오기
2. 각 비디오의 YouTube 조회수 수집
3. total_views = url1_views + url2_views + benefit_points
4. tier 계산 (Gold: 5M+, Silver: 1M+)
5. snapshots.json 업데이트
6. GitHub에 커밋 (Vercel 재배포 트리거)
```

---

## ⚙️ 크론잡 설정

### vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron",
      "schedule": "0 12 * * *"
    }
  ]
}
```

**실행 시간**:
- 자정 00시 (UTC)
- 낮 12시 (UTC)

---

## 🔐 환경 변수

### .env.local
```bash
# YouTube
YOUTUBE_API_KEY=your-youtube-api-key

# Cron Secret
CRON_SECRET=your-cron-secret

# GitHub (for committing snapshot updates)
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_REPO=owner/repo-name
```

### GitHub Token 권한
- `repo` (Contents 읽기/쓰기)

---

## 📊 데이터 구조

### videos.json
```json
[
  {
    "id": "uuid",
    "artist": "마사야",
    "artist_ja": "マサヤ",
    "song": "TSUNAMI",
    "song_ja": "TSUNAMI",
    "url1": "https://youtube.com/watch?v=xxx",
    "url1_channel": "트롯가왕",
    "url2": "https://youtube.com/watch?v=yyy",
    "url2_channel": "MBN Music",
    "benefit_points": 50000,
    "created_at": "2024-11-24T00:00:00Z"
  }
]
```

### snapshots.json
```json
{
  "updated_at": "2024-11-24T12:00:00Z",
  "data": {
    "video-id-1": {
      "id": "snapshot-id",
      "video_id": "video-id-1",
      "url1_views": 2500000,
      "url2_views": 2700000,
      "total_views": 5234567,
      "tier": "gold",
      "created_at": "2024-11-24T12:00:00Z"
    }
  }
}
```

---

## 🚀 구현 완료

### 기능
- [x] Next.js 프로젝트 생성
- [x] YouTube API 키 발급
- [x] 크론잡 API (GitHub 커밋 방식)
- [x] 메인 페이지 UI
- [x] 가수 필터 (기본: 마사야)
- [x] 조회수 순 정렬
- [x] 언어 전환 (KO/JA)
- [x] YouTube 썸네일 + 링크
- [x] 티어 배지 (Gold/Silver)
- [x] 채널별 조회수 표시

### 데이터
- [x] 76개 비디오 데이터 (videos.json)
- [x] 스냅샷 구조 (snapshots.json)

### 배포
- [ ] Vercel 배포
- [ ] GitHub Token 설정
- [ ] 크론잡 테스트

---

## ✅ 체크리스트

### 배포 전
- [x] videos.json 데이터 완성
- [x] 환경 변수 설정
- [ ] GitHub Token 발급 (repo 권한)

### 배포 후
- [ ] 크론잡 수동 테스트
- [ ] GitHub 커밋 확인
- [ ] 자동 재배포 확인

---

**작성일**: 2024-11-24
**업데이트**: 2024-11-24
**버전**: 4.0 (GitHub 정적 파일 버전)
**핵심**: 정적 JSON + GitHub 커밋 + Vercel 자동 배포
