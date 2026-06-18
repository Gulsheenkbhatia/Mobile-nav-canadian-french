enum StickyBarStateClassName {
  Active = 'sticky-bar-active',
  Inactive = 'sticky-bar-inactive',
}

const getStickyBarStateClassName = (isMinimized: boolean): StickyBarStateClassName => {
  return isMinimized ? StickyBarStateClassName.Inactive : StickyBarStateClassName.Active
}

export { getStickyBarStateClassName, StickyBarStateClassName }
