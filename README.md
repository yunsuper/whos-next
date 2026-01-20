# 🎰 WHO'S NEXT? | 럭키 제비뽑기 머신

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Matter.js](https://img.shields.io/badge/Matter.js-Physics-red)
![License](https://img.shields.io/badge/License-MIT-green)

**"클릭 한 번으로 결정되는 운명!"** 세련된 물리 엔진 기반의 제비뽑기 추첨기입니다. 팀 나누기, 술래 정기, 메뉴 결정 등 공정한 선택이 필요한 모든 순간에 사용하세요.

[🚀 서비스 바로가기](당신의_배포_URL)

---

## 📸 Screenshots

| 메인 추첨 화면 | 당첨자 발표 모달 |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/0265fcc0-3764-4584-931c-566ac8ab5122" width="400"> | <img src="https://github.com/user-attachments/assets/a7979aad-af43-4d53-939e-167f562f5f6d" width="200">  |
---

## ✨ 주요 기능
- **물리 엔진 기반 추첨**: Matter.js를 이용한 실제 로또 머신 같은 역동적인 공의 움직임.
- **몰입감 넘치는 사운드**: Web Audio API를 활용하여 공이 부딪히고 섞이는 소리를 실시간으로 구현.
- **당첨 축하 시각 효과**: Canvas Confetti를 사용하여 당첨자 발표 순간의 화려한 연출.
- **실시간 참가자 관리**: 참가자 이름을 입력하고 즉시 추첨 리스트에 반영.
- **당첨 내역 저장 (History)**: 브라우저 로컬 스토리지를 이용해 새로고침 후에도 기록 유지. (개별 삭제 불가로 공정성 확보)
- **고해상도 파비콘 & SEO**: Next.js App Router의 동적 아이콘 및 메타데이터 최적화.
- **모바일 최적화 & 홈 화면 아이콘**: 반응형 디자인과 스마트폰 전용 아이콘(`apple-icon`) 지원.
- **개발자 응원 (Support)**: 카카오페이 QR 코드를 통한 따뜻한 커피 한 잔의 후원 기능.

## 🛠 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Physics Engine**: Matter.js
- **Animation**: Framer Motion & **Canvas Confetti**
- **Audio Logic**: **Web Audio API**
- **Styling**: Tailwind CSS

## 🛠️ Troubleshooting
### 1. Canvas 리사이징 시 물리 엔진 좌표 불일치
- **문제**: 브라우저 창 크기가 변할 때 캔버스 크기는 조절되지만, 내부 물리 엔진(`Matter.World`)의 경계(Boundary) 좌표가 갱신되지 않아 공이 화면 밖으로 탈출하는 현상 발생.
- **해결**: `useEffect` 내에서 리사이즈 이벤트를 감지하고, `Matter.Body.setPosition`을 통해 바닥과 벽면 객체의 위치를 동적으로 재계산하도록 로직 수정.
### 2. Client-Side Hydration Error (Local Storage)
- **문제**: 서버 사이드 렌더링(SSR) 결과물과 클라이언트의 로컬스토리지 데이터를 포함한 UI가 일치하지 않아 `Hydration failed` 에러 발생.
- **원인**: Next.js는 서버에서 먼저 HTML을 생성하는데, 이때 서버는 브라우저의 `localStorage`에 접근할 수 없어 데이터가 비어있는 상태로 렌더링함. 반면 클라이언트는 데이터를 불러와 화면에 그리려 하면서 충돌 발생.
- **해결**: 
  1. `useState`와 `useEffect`를 조합하여 컴포넌트 마운트 이후에만 로컬스토리지 데이터를 렌더링하도록 제어.
  2. Zustand의 `persist` 미들웨어를 사용할 때 `skipHydration: true` 옵션을 적용하거나, `hasHydrated` 상태 변수를 도입하여 하이드레이션 완료 전까지 렌더링을 유예(Suppress)하는 방식으로 해결.

## 🚀 시작하기
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 **yunsuper**