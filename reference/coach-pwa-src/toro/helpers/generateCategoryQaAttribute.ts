type ParentCategoryTreeItem = {
  cgid: string
  name: string
}

const generateCategoryQaAttribute = (parentCategoryTree: ParentCategoryTreeItem[] = []): string => {
  if (!parentCategoryTree.length) {
    return ''
  }
  const level = parentCategoryTree.length
  const attribute = parentCategoryTree.reduce((str, currentTreeLevel) => {
    if (!currentTreeLevel.cgid) {
      return str
    }
    return str + `_${currentTreeLevel.cgid}`
  }, `l${level}_nav`)

  return attribute
}

export default generateCategoryQaAttribute
