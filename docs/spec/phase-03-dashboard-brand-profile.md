# Phase 03: 대시보드 + Brand Profile CRUD

## 목표

대시보드 레이아웃(사이드바 + 반응형), Brand Profile CRUD(생성/조회/수정/삭제), Zustand 스토어, Zod 유효성 검증을 구현한다. Free 플랜 1개, Pro 플랜 5개 제한이 트리거에 의해 적용되며, UI에서도 이를 반영한다.

---

## 생성/수정 파일 목록

| 파일 경로 | 작업 | 설명 |
|-----------|------|------|
| `app/(dashboard)/layout.tsx` | 생성 | 대시보드 레이아웃 (AuthGuard + Sidebar) |
| `app/(dashboard)/dashboard/page.tsx` | 생성 | 대시보드 홈 |
| `app/(dashboard)/brand-profiles/page.tsx` | 생성 | Brand Profile 목록 |
| `app/(dashboard)/brand-profiles/actions.ts` | 생성 | Brand Profile Server Actions |
| `app/(dashboard)/projects/page.tsx` | 생성 | 프로젝트 목록 |
| `app/(dashboard)/settings/page.tsx` | 생성 | 설정 페이지 |
| `components/brand-profile/profile-card.tsx` | 생성 | 프로필 카드 컴포넌트 |
| `components/brand-profile/profile-form.tsx` | 생성 | 프로필 생성/수정 폼 |
| `components/brand-profile/color-picker.tsx` | 생성 | 컬러 피커 |
| `components/brand-profile/style-selector.tsx` | 생성 | 스타일 방향 선택기 |
| `components/brand-profile/delete-dialog.tsx` | 생성 | 삭제 확인 다이얼로그 |
| `store/brand-profile-store.ts` | 생성 | Zustand 스토어 |
| `store/auth-store.ts` | 생성 | 인증 상태 스토어 |

---

## 1. 대시보드 레이아웃

### 1.1 `app/(dashboard)/layout.tsx`

```typescript
import AuthGuard from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* 데스크톱 사이드바 (lg:block) */}
        <Sidebar className="hidden lg:flex" />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col">
          {/* 모바일 상단 바 (lg:hidden) */}
          <header className="flex h-14 items-center border-b border-border px-4 lg:hidden">
            <MobileNav />
            <span className="ml-4 text-sm font-semibold">BrandKit</span>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
```

**반응형 동작:**
- `lg` (1024px+): 좌측 고정 사이드바 (w-64)
- `< lg`: 상단 바 + 햄버거 메뉴 (Sheet/Drawer 형태)

### 1.2 사이드바 네비게이션 항목

```typescript
const navItems = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: '프로젝트', icon: FolderOpen },
  { href: '/dashboard/brand-profiles', label: '브랜드 프로필', icon: Palette },
  { href: '/dashboard/settings', label: '설정', icon: Settings },
  { href: '/dashboard/settings/billing', label: '빌링', icon: CreditCard },
]
```

---

## 2. 대시보드 홈

### 2.1 `app/(dashboard)/dashboard/page.tsx`

**Server Component**

```typescript
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 사용자 정보 + 최근 프로젝트 + Brand Profile 수 조회
  const [userData, recentProjects, profileCount] = await Promise.all([
    supabase.from('users').select('*').eq('id', user!.id).single(),
    supabase.from('projects').select('*').eq('user_id', user!.id)
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('brand_profiles').select('id', { count: 'exact' })
      .eq('user_id', user!.id),
  ])

  return (/* ... */)
}
```

**UI 구성:**
- 환영 메시지 + 플랜 배지 (Free/Pro)
- 이번 달 사용량 카드 (프로젝트 / AI 헤드라인 / AI 아이콘)
- "새 프로젝트 시작" CTA 버튼
- 최근 프로젝트 목록 (최대 5개)
- Brand Profile 수 표시

---

## 3. Brand Profile CRUD

### 3.1 Zod 유효성 스키마

```typescript
import { z } from 'zod'

export const brandProfileSchema = z.object({
  name: z.string()
    .min(1, '브랜드 이름을 입력하세요')
    .max(50, '50자 이내로 입력하세요'),

  style_direction: z.enum(
    ['minimal', 'playful', 'corporate', 'tech', 'custom'],
    { required_error: '스타일 방향을 선택하세요' }
  ),

  primary_color: z.string()
    .regex(/^#([0-9a-fA-F]{6})$/, '유효한 HEX 색상을 입력하세요')
    .default('#000000'),

  secondary_colors: z.array(
    z.string().regex(/^#([0-9a-fA-F]{6})$/)
  ).max(3, '서브 컬러는 최대 3개입니다')
   .default([]),

  color_mode: z.enum(['mono', 'duotone', 'gradient', 'vibrant'])
    .default('mono'),

  icon_style: z.enum(['outline', 'filled', '3d_soft', 'flat'])
    .default('outline'),

  corner_style: z.enum(['sharp', 'rounded', 'pill'])
    .default('rounded'),

  typography_mood: z.string().max(100).optional().nullable(),

  keywords: z.array(z.string()).max(10).default([]),

  is_default: z.boolean().default(false),
})

export type BrandProfileFormValues = z.infer<typeof brandProfileSchema>
```

### 3.2 Server Actions (`app/(dashboard)/brand-profiles/actions.ts`)

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { brandProfileSchema } from '@/types/wizard'
import { revalidatePath } from 'next/cache'

// ── CREATE ──
export async function createBrandProfile(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = brandProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) {
    // check_brand_profile_limit 트리거 에러 처리
    if (error.message.includes('Brand profile limit reached')) {
      return { error: '브랜드 프로필 개수 제한에 도달했습니다. Pro 플랜으로 업그레이드하세요.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/brand-profiles')
  return { data }
}

// ── READ (목록) ──
export async function getBrandProfiles() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { data: data ?? [], error: error?.message }
}

// ── UPDATE ──
export async function updateBrandProfile(id: string, formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = brandProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)  // RLS + 추가 보호
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/brand-profiles')
  return { data }
}

// ── DELETE ──
export async function deleteBrandProfile(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('brand_profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/brand-profiles')
  return { success: true }
}
```

### 3.3 `components/brand-profile/profile-form.tsx`

```typescript
'use client'

interface ProfileFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<BrandProfileFormValues>
  onSubmit: (data: BrandProfileFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}
```

**폼 필드 구성:**

| 필드 | 컴포넌트 | 설명 |
|------|----------|------|
| `name` | Input | 브랜드 이름 (필수) |
| `style_direction` | StyleSelector | 5개 옵션 카드 (minimal/playful/corporate/tech/custom) |
| `primary_color` | ColorPicker | HEX 컬러 입력 + 프리뷰 |
| `secondary_colors` | ColorPicker[] | 최대 3개, 추가/삭제 버튼 |
| `color_mode` | RadioGroup | mono/duotone/gradient/vibrant |
| `icon_style` | RadioGroup | outline/filled/3d_soft/flat |
| `corner_style` | RadioGroup | sharp/rounded/pill |
| `typography_mood` | Input | 자유 입력 (선택) |
| `keywords` | TagInput | 쉼표 구분 입력, 태그 형태 표시 |

**react-hook-form 연동:**
```typescript
const form = useForm<BrandProfileFormValues>({
  resolver: zodResolver(brandProfileSchema),
  defaultValues: {
    name: '',
    style_direction: 'minimal',
    primary_color: '#000000',
    secondary_colors: [],
    color_mode: 'mono',
    icon_style: 'outline',
    corner_style: 'rounded',
    keywords: [],
    is_default: false,
    ...defaultValues,
  },
})
```

### 3.4 `components/brand-profile/profile-card.tsx`

```typescript
interface ProfileCardProps {
  profile: BrandProfile
  isDefault?: boolean
  onEdit: (profile: BrandProfile) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}
```

**UI:**
- 프로필 이름 + 기본 배지
- Primary Color 원형 프리뷰
- Style Direction 텍스트
- Color Mode 텍스트
- 수정/삭제/기본 설정 드롭다운 메뉴

### 3.5 `components/brand-profile/color-picker.tsx`

```typescript
interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  presets?: string[]  // 빠른 선택 프리셋 컬러
}
```

**동작:**
- HEX 입력 필드 (# 자동 추가)
- 컬러 프리뷰 원형
- 클릭 시 네이티브 `<input type="color">` 또는 커스텀 팔레트
- 프리셋 컬러 8개 (검정, 흰색, 빨강, 파랑, 초록, 보라, 주황, 분홍)

### 3.6 `components/brand-profile/style-selector.tsx`

```typescript
interface StyleSelectorProps {
  value: StyleDirection
  onChange: (value: StyleDirection) => void
}
```

**UI:** 5개 카드 형태
- Minimal: 미니멀 아이콘 + "Minimal" + 설명
- Playful: 플레이풀 아이콘 + "Playful" + 설명
- Corporate: 코퍼릿 아이콘 + "Corporate" + 설명
- Tech: 테크 아이콘 + "Tech" + 설명
- Custom: 커스텀 아이콘 + "Custom" + 설명

선택된 카드: `ring-2 ring-brand` 스타일

---

## 4. Zustand 스토어

### 4.1 `store/brand-profile-store.ts`

```typescript
import { create } from 'zustand'
import type { BrandProfile } from '@/types/database'

interface BrandProfileState {
  // 상태
  profiles: BrandProfile[]
  selectedProfile: BrandProfile | null
  isLoading: boolean
  isFormOpen: boolean
  editingProfile: BrandProfile | null

  // 액션
  setProfiles: (profiles: BrandProfile[]) => void
  selectProfile: (profile: BrandProfile | null) => void
  openCreateForm: () => void
  openEditForm: (profile: BrandProfile) => void
  closeForm: () => void
  addProfile: (profile: BrandProfile) => void
  updateProfile: (id: string, profile: BrandProfile) => void
  removeProfile: (id: string) => void
}

export const useBrandProfileStore = create<BrandProfileState>((set) => ({
  profiles: [],
  selectedProfile: null,
  isLoading: false,
  isFormOpen: false,
  editingProfile: null,

  setProfiles: (profiles) => set({ profiles }),
  selectProfile: (profile) => set({ selectedProfile: profile }),
  openCreateForm: () => set({ isFormOpen: true, editingProfile: null }),
  openEditForm: (profile) => set({ isFormOpen: true, editingProfile: profile }),
  closeForm: () => set({ isFormOpen: false, editingProfile: null }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [profile, ...state.profiles] })),
  updateProfile: (id, profile) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? profile : p)),
    })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
}))
```

### 4.2 `store/auth-store.ts`

```typescript
import { create } from 'zustand'
import type { User } from '@/types/database'

interface AuthState {
  user: User | null
  isLoading: boolean

  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

---

## 5. Brand Profile 목록 페이지

### 5.1 `app/(dashboard)/brand-profiles/page.tsx`

**Server Component (데이터 fetch) + Client Component (상호작용)**

```typescript
// page.tsx (Server Component)
export default async function BrandProfilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profiles }, { data: userData }] = await Promise.all([
    supabase.from('brand_profiles').select('*')
      .eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('users').select('plan').eq('id', user!.id).single(),
  ])

  return (
    <BrandProfilesClient
      initialProfiles={profiles ?? []}
      plan={userData?.plan ?? 'free'}
    />
  )
}
```

```typescript
// BrandProfilesClient (Client Component)
interface BrandProfilesClientProps {
  initialProfiles: BrandProfile[]
  plan: Plan
}
```

**UI:**
- 페이지 제목 + "새 브랜드 만들기" 버튼
- 플랜별 제한 표시 (`1/1` 또는 `3/5`)
- 프로필 카드 그리드 (반응형: 1→2→3열)
- 빈 상태: "첫 번째 브랜드 프로필을 만들어보세요" CTA
- 제한 도달 시: "새 브랜드 만들기" 버튼 비활성화 + Pro 업그레이드 안내

---

## 기술적 주의사항

### 1. Server/Client 컴포넌트 분리
- 페이지: Server Component (데이터 fetch)
- 상호작용 UI: Client Component (상태, 이벤트)
- Server Action으로 mutation → `revalidatePath`로 캐시 무효화

### 2. 낙관적 업데이트 (Optional)
- 삭제 시: 즉시 UI에서 제거 → Server Action 호출 → 실패 시 롤백
- 생성/수정: Server Action 응답 후 UI 업데이트 (안전 우선)

### 3. Brand Profile is_default 처리
- 새 프로필을 기본으로 설정 시 기존 기본 프로필의 is_default를 false로 변경
- 트랜잭션 또는 두 번의 update로 처리

### 4. 색상 입력 유효성
- HEX만 허용 (#000000 형식)
- 실시간 프리뷰 제공
- 잘못된 형식 입력 시 즉시 피드백

---

## 검증 방법

### 검증 1: CRUD 전체 동작

```
1. Brand Profile 생성 → 목록에 표시
2. 수정 → 변경사항 반영
3. 삭제 → 확인 다이얼로그 → 목록에서 제거
4. 새로고침 → 데이터 유지
```

### 검증 2: Free 플랜 1개 제한

```
1. Free 사용자: 첫 번째 프로필 생성 (성공)
2. "새 브랜드 만들기" 버튼 비활성화 + Pro 안내 표시
3. 서버 사이드에서도 트리거가 차단 확인
```

### 검증 3: 반응형 레이아웃

```
1. 데스크톱 (1024px+): 좌측 사이드바 고정
2. 태블릿/모바일 (< 1024px): 상단 바 + 햄버거 메뉴
3. 프로필 카드 그리드: 모바일 1열 → 태블릿 2열 → 데스크톱 3열
```

### 검증 4: 컬러 피커 동작

```
1. HEX 입력 → 실시간 프리뷰 변경
2. 네이티브 컬러 피커에서 선택 → HEX 값 자동 입력
3. 프리셋 컬러 클릭 → 값 적용
4. 잘못된 HEX → 유효성 에러
```
