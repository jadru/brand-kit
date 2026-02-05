import type { PromptCategory } from './types'

export interface ConflictResult {
  resolved: PromptCategory[]
  warnings: string[]
}

/**
 * 선택된 카테고리들의 충돌을 해결합니다.
 * weight가 높은 카테고리가 우선권을 가집니다.
 */
export function resolveConflicts(categories: PromptCategory[]): ConflictResult {
  const warnings: string[] = []
  const resolved: PromptCategory[] = []
  const selectedIds = new Set(categories.map((c) => c.id))
  const removedIds = new Set<string>()

  for (const category of categories) {
    // 이미 제거된 카테고리는 건너뜀
    if (removedIds.has(category.id)) {
      continue
    }

    const conflicts = category.incompatibleWith?.filter((id) => selectedIds.has(id)) || []

    if (conflicts.length === 0) {
      resolved.push(category)
      continue
    }

    // 충돌하는 카테고리들 찾기
    const conflictingCategories = categories.filter(
      (c) => conflicts.includes(c.id) && !removedIds.has(c.id)
    )

    if (conflictingCategories.length === 0) {
      resolved.push(category)
      continue
    }

    // weight로 해결 (높은 weight가 우선)
    const categoryWeight = category.weight || 0
    const maxConflictWeight = Math.max(...conflictingCategories.map((c) => c.weight || 0))

    if (categoryWeight >= maxConflictWeight) {
      resolved.push(category)
      // 낮은 weight의 충돌 항목 제거
      for (const conflict of conflictingCategories) {
        const conflictWeight = conflict.weight || 0
        if (conflictWeight < categoryWeight) {
          removedIds.add(conflict.id)
          const idx = resolved.findIndex((c) => c.id === conflict.id)
          if (idx !== -1) {
            resolved.splice(idx, 1)
          }
          warnings.push(
            `"${conflict.label}" removed due to conflict with "${category.label}"`
          )
        }
      }
    } else {
      removedIds.add(category.id)
      warnings.push(
        `"${category.label}" removed due to conflict with higher-priority options`
      )
    }
  }

  return { resolved, warnings }
}

/**
 * 카테고리 선택의 유효성을 검증합니다.
 */
export function validateCategorySelection(
  categories: PromptCategory[],
  selectedIds: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const selectedSet = new Set(selectedIds)

  for (const category of categories) {
    if (!selectedSet.has(category.id)) continue

    // 비호환성 체크
    const conflicts = category.incompatibleWith?.filter((id) => selectedSet.has(id)) || []
    if (conflicts.length > 0) {
      errors.push(`"${category.label}" is incompatible with: ${conflicts.join(', ')}`)
    }

    // 필수 그룹 체크
    if (category.requiresOne) {
      for (const group of category.requiresOne) {
        const hasAny = group.some((id) => selectedSet.has(id))
        if (!hasAny) {
          errors.push(`"${category.label}" requires at least one of: ${group.join(', ')}`)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * 두 카테고리가 호환되는지 확인합니다.
 */
export function areCategoriesCompatible(
  categoryA: PromptCategory,
  categoryB: PromptCategory
): boolean {
  const aIncompatible = categoryA.incompatibleWith?.includes(categoryB.id) || false
  const bIncompatible = categoryB.incompatibleWith?.includes(categoryA.id) || false
  return !aIncompatible && !bIncompatible
}

/**
 * 주어진 카테고리와 호환되지 않는 카테고리 ID 목록을 반환합니다.
 */
export function getIncompatibleIds(
  category: PromptCategory,
  allCategories: PromptCategory[]
): string[] {
  const incompatible = new Set<string>()

  // 해당 카테고리의 incompatibleWith
  if (category.incompatibleWith) {
    category.incompatibleWith.forEach((id) => incompatible.add(id))
  }

  // 다른 카테고리들의 incompatibleWith에서 이 카테고리를 참조하는 것들
  for (const other of allCategories) {
    if (other.incompatibleWith?.includes(category.id)) {
      incompatible.add(other.id)
    }
  }

  return Array.from(incompatible)
}
