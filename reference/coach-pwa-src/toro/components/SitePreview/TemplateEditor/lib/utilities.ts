import type { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { FlattenedItem, TreeItem, TreeItems } from './types'

export const iOS =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  // @ts-expect-error MSStream not in lib dom typings
  !window.MSStream

export function flattenTree(items: TreeItems, parentId: UniqueIdentifier | null = null, depth = 0) {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    acc.push({ ...item, parentId, depth, index })
    if (item.children?.length && !item.collapsed) {
      acc.push(...flattenTree(item.children, item.id, depth + 1))
    }
    return acc
  }, [])
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItems = []
  const nodes = new Map<UniqueIdentifier, TreeItem>()

  flattenedItems.forEach((item) => {
    const { parentId, depth: _depth, index: _index, ...rest } = item
    nodes.set(rest.id, { ...rest, children: [] })
  })

  flattenedItems.forEach((item) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const node = nodes.get(item.id)!
    if (item.parentId == null) {
      root.push(node)
    } else {
      const parent = nodes.get(item.parentId)
      if (parent) parent.children.push(node)
      else root.push(node)
    }
  })

  return root
}

export function removeItemById<T extends TreeItem>(
  items: TreeItems<T>,
  id: UniqueIdentifier
): TreeItems<T> {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children?.length
        ? (removeItemById(item.children as any, id) as any)
        : item.children,
    })) as TreeItems<T>
}

export function setTreeItemProperties<T extends TreeItem>(
  items: TreeItems<T>,
  id: UniqueIdentifier,
  setter: (value: T) => Partial<T>
): TreeItems<T> {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, ...setter(item) }
    }
    if (item.children?.length) {
      return { ...item, children: setTreeItemProperties(item.children as any, id, setter) as any }
    }
    return item
  }) as TreeItems<T>
}

export function getItemById<T extends TreeItem>(
  items: TreeItems<T>,
  id: UniqueIdentifier
): TreeItem<T> | undefined {
  for (const item of items) {
    if (item.id === id) return item as any
    if (item.children?.length) {
      const found = getItemById(item.children as any, id)
      if (found) return found as any
    }
  }
  return undefined
}

export function getChildCount(treeStructure: TreeItems, id: UniqueIdentifier): number {
  const item = getItemById(treeStructure as any, id) as any
  if (!item) return 0
  const countChildren = (node: TreeItem): number =>
    (node.children ?? []).reduce(
      (acc: number, child: TreeItem) => acc + 1 + countChildren(child),
      0
    )
  return countChildren(item)
}

export function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
  const excluded = new Set(ids)
  return items.filter((item) => {
    if (item.parentId && excluded.has(item.parentId)) {
      excluded.add(item.id)
      return false
    }
    return true
  })
}

export function findItemDeep(items: TreeItems, itemId: UniqueIdentifier): TreeItem | undefined {
  return getItemById(items as any, itemId) as any
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier): TreeItem | undefined {
  return items.find((i) => i.id === itemId)
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) {
  const overIndex = items.findIndex(({ id }) => id === overId)
  const activeIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeIndex]

  const newItems = arrayMove(items, activeIndex, overIndex)
  const previousItem = newItems[overIndex - 1]
  const nextItem = newItems[overIndex + 1]

  const dragDepth = Math.round(dragOffset / indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = previousItem ? previousItem.depth + 1 : 0
  const minDepth = nextItem ? nextItem.depth : 0

  let depth = projectedDepth
  if (depth > maxDepth) depth = maxDepth
  if (depth < minDepth) depth = minDepth

  let parentId: UniqueIdentifier | null = null

  if (depth === 0) {
    parentId = null
  } else if (previousItem && depth === previousItem.depth + 1) {
    parentId = previousItem.id
  } else if (previousItem && depth === previousItem.depth) {
    parentId = previousItem.parentId
  } else if (previousItem) {
    const parent = [...newItems]
      .slice(0, overIndex)
      .reverse()
      .find((item) => item.depth === depth - 1)
    parentId = parent ? parent.id : null
  }

  return { depth, maxDepth, minDepth, parentId }
}
