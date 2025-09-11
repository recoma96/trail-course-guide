# Custom Trail Course Guide
 
<!-- [![Vercel](https://vercel.com/button)](https://trail-course-guide-printer.vercel.app/) Vercel 배포 후 URL을 여기에 추가하세요 -->

[Trailine Prototype Project] GPX 파일과 코스 설명을 입력받아 맞춤형 등산/트레일 코스 가이드 페이지를 생성하고, PNG 파일로 저장 및 인쇄할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능 (Features)

- **GPX 파일 분석**: GPX 트랙 데이터를 파싱하여 코스 경로를 분석합니다.
- **동적 가이드 생성**: 코스 제목, 설명, 난이도, 구간별 정보를 포함한 상세 가이드 페이지를 동적으로 생성합니다.
- **인터랙티브 지도**: Naver Maps API를 활용하여 전체 코스 경로와 주요 구간 시작점을 시각적으로 표시합니다.
- **구간별 상세 정보**: 각 구간의 이름, 난이도, 상세 설명을 카드 형태로 명확하게 제공합니다.
- **내보내기 및 인쇄**: 생성된 가이드 페이지를 PDF, 이미지 파일 등으로 저장하거나 직접 인쇄할 수 있습니다. (구현 예정)

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Mapping**: Naver Maps API
- **Deployment**: Vercel

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하기 위한 안내입니다.

### 전제 조건 (Prerequisites)

- [Node.js](https://nodejs.org/en/) (v18.x 이상 권장)
- [Yarn](https://yarnpkg.com/) 또는 npm/pnpm

### 설치 및 실행 (Installation)

1.  **저장소 복제 (Clone the repository):**
    ```bash
    git clone https://github.com/<your-username>/custom-trail-course-guide.git
    cd custom-trail-course-guide
    ```

2.  **의존성 설치 (Install dependencies):**
    ```bash
    yarn install
    # 또는 npm install
    ```

3.  **환경 변수 설정 (Environment Variables):**
    프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 아래 내용을 복사하여 붙여넣으세요. `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`는 Naver Cloud Platform에서 발급받은 Client ID를 입력해야 합니다.

    ```env
    # .env.local
    NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="여기에_네이버_맵_클라이언트_ID를_입력하세요"
    ```

4.  **개발 서버 실행 (Run the development server):**
    ```bash
    yarn dev
    # 또는 npm run dev
    ```

5.  브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인합니다.
