# SAP 덤프 분석기 (SAP Dump Analyzer)

이 프로젝트는 React, TypeScript, Vite를 사용하여 개발된 SAP ABAP 덤프 로그 분석용 웹 애플리케이션입니다. Gemini 3.0 Pro를 활용하여 로그를 심층 분석합니다.

## 주요 기능

- **엑셀 업로드**: 클라이언트 측에서 ABAP Dump 엑셀 파일을 파싱합니다.
- **AI 분석**: Google Gemini 3.0 Pro를 사용하여 덤프 패턴을 분석하고 해결책을 제안합니다.
- **전문가 휴리스틱**: SAP BC(Basis Consultant) 전문가의 관점에서 원인을 추론하는 로직이 적용되어 있습니다.
- **보안**: API Key는 사용자가 직접 입력하며, 브라우저 메모리에만 일시적으로 저장됩니다.

## 기술 스택 (Tech Stack)

- **프레임워크**: React 18, Vite
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **AI 모델**: Google Gemini 3.0 Pro (`gemini-3-pro-preview`)
- **라이브러리**:
  - `xlsx`: 클라이언트 측 엑셀 파일 처리
  - `@google/generative-ai`: Google AI Studio API 연동
  - `lucide-react`: 아이콘 컴포넌트

## 개발 환경 설정

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   npm run dev
   ```

3. 프로덕션 빌드:
   ```bash
   npm run build
   ```

## 배포 (GitHub Pages)

이 프로젝트는 GitHub Pages에 배포할 준비가 되어 있습니다.

1. **`vite.config.ts` 설정 (선택 사항):**
   만약 프로젝트 저장소 주소가 `https://username.github.io/repo-name/` 형태라면, `vite.config.ts` 파일에 `base` 속성을 추가해야 합니다:

   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/repo-name/', // 저장소 이름으로 변경하세요
   })
   ```

2. **GitHub Actions를 통한 배포:**
   GitHub Actions를 설정하여 `dist` 폴더를 `gh-pages` 브랜치로 자동 배포할 수 있습니다.

   또는 수동으로 배포하려면:
   ```bash
   npm run build
   # dist 폴더의 내용을 gh-pages 브랜치에 푸시하세요.
   ```
