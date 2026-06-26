import type {
  MenuCategoryDetail,
  MenuLinkSection,
  MenuSubCategorySection,
} from './mobileMenuData'

/** Vertical gap between drill sections (eyebrow + link groups). */
export const NAV_DRILL_SECTION_GAP_PX = 32

/** Vertical gap between links within one drill section. */
export const NAV_DRILL_LINK_GAP_PX = 16

export type NavDrillFlatTemplate = {
  kind: 'flat-sections'
  sections: MenuLinkSection[]
}

export type NavDrillSubCategoryTemplate = {
  kind: 'sub-category-sections'
  sections: MenuSubCategorySection[]
}

/** Resolved L2 body layout — flat terminal links or chevron sub-category rows. */
export type NavDrillL2Body = NavDrillFlatTemplate | NavDrillSubCategoryTemplate

export function resolveSubCategorySections(
  detail: MenuCategoryDetail,
): MenuSubCategorySection[] {
  if (detail.subCategorySections?.length) {
    return detail.subCategorySections
  }

  if (detail.subCategories?.length) {
    return [{ id: 'default', subCategories: detail.subCategories }]
  }

  return []
}

/** Pick the L2 drill body template from category detail. */
export function resolveNavDrillL2Body(detail: MenuCategoryDetail): NavDrillL2Body | null {
  const subSections = resolveSubCategorySections(detail)
  if (subSections.length > 0) {
    return { kind: 'sub-category-sections', sections: subSections }
  }

  if (detail.sections?.length) {
    return { kind: 'flat-sections', sections: detail.sections }
  }

  return null
}

/** Flatten sub-category sections for stagger row counting. */
export function countSubCategorySectionRows(
  sections: MenuSubCategorySection[],
  options?: { leadingEyebrow?: string },
): number {
  let total = 0

  sections.forEach((section, index) => {
    const hasEyebrow =
      Boolean(section.eyebrow?.trim()) ||
      (index === 0 && Boolean(options?.leadingEyebrow?.trim()))
    if (hasEyebrow) total += 1
    total += section.subCategories.length
  })

  return total
}
