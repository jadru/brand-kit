# AAR: 접근성(Accessibility) 개선

**날짜**: 2026-02-06
**작업자**: Claude (Opus 4.5)
**카테고리**: UX/UI, 접근성, WCAG 2.1

---

## 개요

사용자 요청에 따라 UI/UX를 꼼꼼히 점검하여 놓칠 수 있는 접근성 항목을 찾아 개선했습니다. 이번 작업은 WCAG 2.1 가이드라인을 기반으로 스크린 리더 지원, 키보드 네비게이션, 포커스 관리, 터치 타겟 크기 등을 중점적으로 개선했습니다.

---

## 변경된 파일 목록

| 파일 | 변경 유형 | 주요 개선 사항 |
|------|----------|---------------|
| `components/feedback/nps-modal.tsx` | 수정 | ARIA 속성, Focus trap, 키보드 지원 |
| `components/feedback/feedback-widget.tsx` | 수정 | ARIA 속성, Focus trap, 키보드 지원 |
| `components/ui/cookie-consent.tsx` | 수정 | ARIA 속성, 버튼 레이블 |
| `components/ui/notification-center.tsx` | 수정 | ARIA 속성, Focus trap, 키보드 지원 |
| `components/ui/theme-toggle.tsx` | 수정 | 마운트 전 상태 처리 |
| `components/landing/hero.tsx` | 수정 | 네비게이션 레이블, 장식 요소 처리, 번역 키 |
| `components/landing/footer.tsx` | 수정 | role 속성, 장식 요소 처리 |
| `components/layout/mobile-nav.tsx` | 수정 | Focus trap, 터치 타겟, aria-current |
| `components/layout/sidebar.tsx` | 수정 | ARIA 레이블, aria-current |
| `messages/en.json` | 수정 | 번역 키 추가 |
| `messages/ko.json` | 수정 | 번역 키 추가 |

---

## 상세 변경 내용

### 1. NPS Modal (`components/feedback/nps-modal.tsx`)

#### 추가된 기능
- `role="dialog"`, `aria-modal="true"` 모달 역할 명시
- `aria-labelledby="nps-modal-title"` 제목 연결
- 11개 점수 버튼에 `aria-label` 및 `aria-pressed` 추가
- Focus trap 구현 (Tab 키 순환)
- Escape 키로 닫기 지원
- 닫을 때 이전 포커스 위치로 복원

#### 코드 변경
```tsx
// Focus trap handler 추가
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleDismiss()
  }
  if (e.key === 'Tab') {
    // Tab 키 순환 로직
  }
}, [isOpen])

// 점수 버튼 접근성
<button
  aria-label={locale === 'ko' ? `${i}점 (10점 만점)` : `Score ${i} out of 10`}
  aria-pressed={selectedScore === i}
>
```

---

### 2. Feedback Widget (`components/feedback/feedback-widget.tsx`)

#### 추가된 기능
- `role="dialog"`, `aria-modal="true"` 패널 역할 명시
- `aria-labelledby="feedback-widget-title"` 제목 연결
- 감정 선택 버튼에 `aria-pressed`, `aria-label` 추가
- 트리거 버튼에 `aria-expanded`, `aria-haspopup` 추가
- Focus trap 및 Escape 키 지원
- 포커스 관리 (열림/닫힘 시)

#### 코드 변경
```tsx
// 트리거 버튼
<button
  ref={triggerRef}
  aria-expanded={isOpen}
  aria-haspopup="dialog"
>

// 감정 버튼 그룹
<div role="group" aria-label={t.sentimentLabel}>
  <button aria-pressed={sentiment === type} aria-label={label}>
```

---

### 3. Cookie Consent (`components/ui/cookie-consent.tsx`)

#### 추가된 기능
- `role="dialog"` (모달이 아니므로 `aria-modal="false"`)
- `aria-labelledby`, `aria-describedby` 연결
- 버튼에 상세한 `aria-label` 추가
- 장식용 아이콘에 `aria-hidden` 추가

#### 코드 변경
```tsx
<div
  role="dialog"
  aria-modal="false"
  aria-labelledby="cookie-consent-title"
  aria-describedby="cookie-consent-description"
>

<button aria-label={locale === 'ko' ? '필수 쿠키만 허용' : 'Accept essential cookies only'}>
<button aria-label={locale === 'ko' ? '모든 쿠키 허용' : 'Accept all cookies'}>
```

---

### 4. Notification Center (`components/ui/notification-center.tsx`)

#### 추가된 기능
- 트리거 버튼에 읽지 않은 알림 수 포함한 `aria-label`
- `aria-expanded`, `aria-haspopup` 추가
- 패널에 `role="dialog"`, `aria-modal="true"` 추가
- Focus trap 및 Escape 키 지원
- 액션 버튼에 알림 제목을 포함한 상세 `aria-label`
- 로딩/빈 상태에 `aria-live`, `role="status"` 추가
- `group-focus-within:opacity-100`으로 키보드 포커스 시에도 액션 버튼 표시

#### 코드 변경
```tsx
// 트리거 버튼 - 동적 aria-label
aria-label={`알림${unreadCount > 0 ? `, ${unreadCount}개 읽지 않음` : ''}`}

// 컨텐츠 영역 - 라이브 리전
<div aria-live="polite" aria-busy={isLoading}>

// 개별 알림 액션 버튼
aria-label={`"${notification.title}" 읽음 표시`}
aria-label={`"${notification.title}" 삭제`}
```

---

### 5. Mobile Nav (`components/layout/mobile-nav.tsx`)

#### 추가된 기능
- 터치 타겟 크기 44px로 증가 (`touch-target` 클래스)
- Focus trap 및 Escape 키 지원
- `aria-current="page"` 활성 항목에 추가
- 장식용 아이콘에 `aria-hidden` 추가
- 플랜 카드에 적절한 `role="status"`, `aria-label` 추가

#### 코드 변경
```tsx
// 터치 타겟 증가
className="touch-target flex items-center justify-center rounded-lg p-2.5"

// 활성 링크
aria-current={isActive ? 'page' : undefined}

// 플랜 상태
<div role="status" aria-label="Pro Plan 사용 중">
<Link aria-label="Pro Plan으로 업그레이드">
```

---

### 6. Sidebar (`components/layout/sidebar.tsx`)

#### 추가된 기능
- `aria-label` 추가 (aside, nav)
- `aria-current="page"` 활성 항목에 추가
- 장식용 아이콘에 `aria-hidden` 추가
- 플랜 카드에 `role="status"`, `aria-label` 추가

---

### 7. Hero (`components/landing/hero.tsx`)

#### 추가된 기능
- 네비게이션에 `aria-label={tc('mainNavigation')}` 추가
- 장식용 SVG 아이콘에 `aria-hidden` 추가
- 플로팅 타일(장식 요소)에 `aria-hidden` 추가
- 신뢰 지표 텍스트 하드코딩 → 번역 키로 변경

#### 코드 변경
```tsx
<nav aria-label={tc('mainNavigation')}>

// 장식용 플로팅 타일
<div aria-hidden="true">

// 신뢰 지표 - 번역 키 사용
<span>{t('trustNoCreditCard')}</span>
<span>{t('trustFreePlan')}</span>
```

---

### 8. Footer (`components/landing/footer.tsx`)

#### 추가된 기능
- `role="contentinfo"` 추가
- 상태 표시 점에 `aria-hidden` 추가

---

### 9. 번역 파일 업데이트

#### `messages/en.json`
```json
{
  "common": {
    "mainNavigation": "Main navigation"
  },
  "landing": {
    "hero": {
      "trustNoCreditCard": "No credit card required",
      "trustFreePlan": "Free forever plan"
    }
  }
}
```

#### `messages/ko.json`
```json
{
  "common": {
    "mainNavigation": "메인 네비게이션"
  },
  "landing": {
    "hero": {
      "trustNoCreditCard": "신용카드 불필요",
      "trustFreePlan": "무료 플랜 영구 제공"
    }
  }
}
```

---

## 이전 세션에서 완료된 관련 작업

| 파일 | 변경 내용 |
|------|----------|
| `app/[locale]/layout.tsx` | 스킵 링크 추가 |
| `app/globals.css` | `.sr-only`, `.touch-target`, `.focus-visible-ring` 유틸리티 추가 |

---

## 접근성 패턴 가이드

### Focus Trap 패턴
모달/다이얼로그에서 Tab 키가 모달 내부에서만 순환하도록 구현:

```tsx
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}, [])
```

### 포커스 복원 패턴
모달이 닫힐 때 이전 포커스 위치로 복원:

```tsx
// 열릴 때 현재 포커스 저장
triggerRef.current = document.activeElement as HTMLElement

// 닫힐 때 복원
const handleClose = () => {
  setTimeout(() => {
    triggerRef.current?.focus()
  }, animationDuration)
}
```

### 동적 aria-label 패턴
상태에 따라 aria-label 업데이트:

```tsx
aria-label={`알림${unreadCount > 0 ? `, ${unreadCount}개 읽지 않음` : ''}`}
```

---

## 테스트 결과

- TypeScript 컴파일: 성공
- Next.js 빌드: 성공 (37 페이지 생성)
- 정적 페이지 생성: en/ko 로케일 모두 정상

---

## 향후 개선 사항

1. **Color Picker**: 색상 스와치에 aria-label 추가 필요
2. **Dialog 컴포넌트**: shadcn/ui 기본 Dialog에 focus trap 확인
3. **Select 컴포넌트**: `aria-invalid`, `aria-describedby` 폼 에러 연동
4. **폼 검증**: `aria-live` 리전으로 실시간 에러 메시지 전달

---

## 참고 자료

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Focus Trap Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
