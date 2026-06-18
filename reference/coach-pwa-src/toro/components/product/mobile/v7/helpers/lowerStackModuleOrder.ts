import {
  lowerStackModuleIdSet,
  type LowerStackCategory,
  type PdpV7StackModuleId,
} from 'toro/components/product/mobile/v7/constants'

export function resolveLowerStackCategory(
  isBagCategory: boolean,
  isShoeCategory: boolean
): LowerStackCategory {
  if (isBagCategory) return 'bag'
  if (isShoeCategory) return 'shoe'
  return 'bag'
}

/** SFCC sends a full ordered list; drop ids we do not implement (e.g. typo). */
export function narrowPreferenceLowerStackOrder(
  preferenceModuleIds: readonly string[]
): PdpV7StackModuleId[] {
  return preferenceModuleIds.filter((id): id is PdpV7StackModuleId => lowerStackModuleIdSet.has(id))
}
