# Synology NAS 배포 가이드 — JH Lee Lab Website

## 1. 프론트엔드 코드 Export & 빌드

```bash
# GitHub에서 클론 (Lovable → Settings → GitHub 연결 후)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 의존성 설치 & 빌드
npm install
npm run build
# → dist/ 폴더에 정적 파일 생성
```

## 2. Synology NAS에 배포

### 2-1. Web Station 설치
1. **패키지 센터** → **Web Station** 설치
2. **Nginx** 또는 **Apache** 웹 서버 활성화

### 2-2. 정적 사이트 업로드
```bash
# dist/ 폴더 내용을 NAS로 복사
scp -r dist/* admin@NAS_IP:/volume1/web/lab-website/
```

### 2-3. Web Station 가상 호스트 설정
1. Web Station → **가상 호스트** → 생성
2. 호스트명: `jeonghyunlee.cnu.ac.kr` (또는 원하는 도메인)
3. 문서 루트: `/volume1/web/lab-website`
4. **SPA 지원**: 모든 경로를 `index.html`로 리다이렉트하려면:

**Nginx 추가 설정** (`/etc/nginx/conf.d/lab-website.conf`):
```nginx
server {
    listen 443 ssl;
    server_name jeonghyunlee.cnu.ac.kr;

    root /volume1/web/lab-website;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 논문 PDF 제공 (/papers → /volume1/papers)
    location /papers/ {
        alias /volume1/papers/;
        autoindex off;
        
        # 비공개 PDF 접근 제한 (IP 기반)
        # location /papers/private/ {
        #     allow 168.188.0.0/16;  # 학교 내부 IP 대역
        #     deny all;
        # }
    }

    # 캐시 설정
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

## 3. 논문 PDF 관리

### 3-1. 폴더 구조
```
/volume1/papers/
├── public/                    # 공개용 PDF
│   ├── Lee2026_Sedimentology.pdf
│   ├── Jeon2025_PNAS_reefs.pdf
│   └── ...
└── private/                   # 비공개 (교내/랩 전용)
    ├── Lee2023_draft.pdf
    └── ...
```

### 3-2. publications.ts에서 PDF 경로 설정
```typescript
{
  title: "Facies control on provenance shift...",
  pdfUrl: "/papers/public/Lee2026_Sedimentology.pdf",
  visibility: "public",
  // ...
}
```

### 3-3. 비공개 PDF 접근 제한
Nginx에서 `/papers/private/` 경로에 IP 기반 또는 Basic Auth 적용:

```nginx
location /papers/private/ {
    alias /volume1/papers/private/;
    
    # 방법 1: IP 기반 제한
    allow 168.188.0.0/16;    # CNU 네트워크
    allow 192.168.0.0/16;    # 내부 네트워크
    deny all;
    
    # 방법 2: Basic Auth
    # auth_basic "Lab Members Only";
    # auth_basic_user_file /volume1/papers/.htpasswd;
}
```

## 4. HTTPS + 역방향 프록시

### 4-1. Let's Encrypt 인증서
1. **제어판** → **보안** → **인증서** → **추가**
2. **Let's Encrypt** 선택
3. 도메인명 입력: `jeonghyunlee.cnu.ac.kr`
4. 인증서를 가상 호스트에 할당

### 4-2. 역방향 프록시 설정
**제어판** → **로그인 포털** → **고급** → **역방향 프록시**:

| 설정 | 값 |
|------|-----|
| 소스 프로토콜 | HTTPS |
| 소스 호스트명 | jeonghyunlee.cnu.ac.kr |
| 소스 포트 | 443 |
| 목적지 프로토콜 | HTTP |
| 목적지 호스트명 | localhost |
| 목적지 포트 | 80 |

### 4-3. HTTP → HTTPS 리다이렉트
```nginx
server {
    listen 80;
    server_name jeonghyunlee.cnu.ac.kr;
    return 301 https://$host$request_uri;
}
```

## 5. 검색 기능

논문 검색은 프론트엔드에서 메타데이터 기반으로 구현되어 있습니다:
- **검색 대상**: 제목, 저자, 학술지, 연도, 키워드
- **실시간 필터링**: 입력 즉시 결과 갱신
- **추가 키워드**: `publications.ts`에서 `keywords` 배열에 추가 가능

```typescript
{
  title: "Marine oxygenation...",
  keywords: ["reef", "sponge", "Paleozoic", "oxygenation"],
  // ...
}
```

## 6. 뉴스 업데이트

`src/components/NewsSection.tsx`의 `staticNews` 배열을 직접 편집:
```typescript
const staticNews: NewsItem[] = [
  {
    id: "1",
    title: "새 논문 제목",
    content: "설명...",
    category: "paper",
    published_at: "2025-08-01",
    image_url: "/images/news/photo.jpg",  // /volume1/web/lab-website/images/에 저장
  },
  // ...
];
```
변경 후 `npm run build` → `dist/` 다시 업로드.

## 7. 자동 배포 (선택)

GitHub Actions + Synology SSH로 자동화:
```yaml
# .github/workflows/deploy.yml
name: Deploy to NAS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - name: Deploy via rsync
        uses: burnett01/rsync-deployments@6.0.0
        with:
          switches: -avzr --delete
          path: dist/
          remote_path: /volume1/web/lab-website/
          remote_host: ${{ secrets.NAS_HOST }}
          remote_user: ${{ secrets.NAS_USER }}
          remote_key: ${{ secrets.NAS_SSH_KEY }}
```
# Last deployed: Sun Mar 15 05:52:54 UTC 2026
