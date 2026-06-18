import type React from 'react'
import type { UniqueIdentifier } from '@dnd-kit/core'

export type { UniqueIdentifier } from '@dnd-kit/core'

export type TreeItem<ExtraProps = unknown> = BaseTreeItem & ExtraProps

/**
 * Represents an item in the tree structure.
 */
export type BaseTreeItem<ExtraProps = unknown> = {
  /**
   * Unique identifier for the item. Can be a string or number.
   */
  id: UniqueIdentifier
  /**
   * The text label displayed for the item in the tree.
   */
  label: string
  /**
   * An array of child TreeItems. If empty, the item is a leaf node.
   */
  children: TreeItem<ExtraProps>[]
  /**
   * Determines whether the item's children are initially collapsed.
   * @default false
   */
  collapsed?: boolean
  /**
   * Indicates whether this item can lazy-load its children.
   * @default false
   */
  canFetchChildren?: boolean
  /**
   * When true, prevents this item from being dragged.
   * @default false
   */
  disableDragging?: boolean
}

export type TreeItems<ExtraProps = unknown> = TreeItem<ExtraProps>[]

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null
  depth: number
  index: number
}

export type SensorContext = React.MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>

/**
 * Represents the result of a drag operation in the tree.
 */
export type DropResult = {
  movedItem: TreeItem
  parent: UniqueIdentifier | null
  index: number
} | null

export type SortableTreeProps<T extends TreeItem = TreeItem> = {
  indentationWidth?: number
  items: TreeItems<T>
  setItems: React.Dispatch<React.SetStateAction<TreeItems<T>>>
  isCollapsible?: boolean
  onLazyLoadChildren?: (id: UniqueIdentifier, isExpanding: boolean) => void
  showDropIndicator?: boolean
  hideDragOverlayContent?: boolean
  isRemovable?: boolean
  onRemoveItem?: (id: UniqueIdentifier) => void
  allowNestedItemAddition?: boolean
  onAddItem?: (parentId: UniqueIdentifier | null) => void
  onDragEnd?: (result: DropResult) => void
  onItemClick?: (id: UniqueIdentifier) => void
  renderItem?: (props: RenderItemProps<T>) => React.ReactNode
}

export type RenderItemProps<T extends TreeItem = TreeItem> = {
  treeItem: T
  dragListeners?: any
  childCount?: number
  clone?: boolean
  ghost?: boolean
  indicator?: boolean
  disableSelection?: boolean
  disableInteraction?: boolean
  collapsed?: boolean
  dropZoneRef: (element: HTMLElement | null) => void
  draggableItemRef: React.Ref<any>
  dropZoneStyle?: React.CSSProperties
  draggableItemStyle?: React.CSSProperties
  classNames?: {
    dropZone?: string
    draggableItem?: string
  }
  dataSlots: {
    dropZone: Record<string, string | boolean | undefined>
    draggableItem: Record<string, string>
  }
}
