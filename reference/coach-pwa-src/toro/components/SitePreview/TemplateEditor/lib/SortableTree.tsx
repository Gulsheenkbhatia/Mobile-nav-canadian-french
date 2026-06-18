import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import React, { useMemo, useRef, useState } from 'react'
import type {
  DropResult,
  FlattenedItem,
  RenderItemProps,
  SortableTreeProps,
  TreeItem,
  TreeItems,
  UniqueIdentifier,
} from './types'
import {
  buildTree,
  findItemDeep,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
} from './utilities'
import useStyles from 'toro/hooks/useStyles'
import Box from 'toro/components/Box'

function SortableRow<T extends TreeItem>({
  item,
  depth,
  indentationWidth,
  showDropIndicator,
  isOver,
  indicatorPosition,
  renderItem,
}: {
  item: FlattenedItem & T
  depth: number
  indentationWidth: number
  showDropIndicator: boolean
  isOver: boolean
  indicatorPosition: 'top' | 'bottom'
  renderItem?: (props: RenderItemProps<T>) => React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: Boolean(item.disableDragging) })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: depth * indentationWidth,
    position: 'relative',
  }

  const draggableItemStyle: CSSProperties = isDragging ? { opacity: 0.6 } : undefined

  const indicator = showDropIndicator && isOver

  const props: RenderItemProps<T> = {
    treeItem: item as any,
    dragListeners: listeners,
    childCount: 0,
    clone: false,
    ghost: isDragging,
    indicator,
    disableInteraction: false,
    disableSelection: false,
    collapsed: Boolean(item.collapsed),
    dropZoneRef: setNodeRef as any,
    draggableItemRef: setActivatorNodeRef as any,
    dropZoneStyle: style,
    draggableItemStyle,
    classNames: {},
    dataSlots: {
      dropZone: {
        role: 'treeitem',
        'aria-roledescription': 'draggable tree item',
        'data-indicator': indicator ? 'true' : undefined,
        'data-indicator-position': indicator ? indicatorPosition : undefined,
      } as any,
      draggableItem: {
        ...attributes,
      } as any,
    },
  }

  return (
    <>
      {renderItem ? (
        renderItem(props)
      ) : (
        <Box as="li" ref={setNodeRef} sx={style}>
          <Box ref={setActivatorNodeRef} {...attributes} {...listeners}>
            {item.label}
          </Box>
        </Box>
      )}
    </>
  )
}

export function SortableTree<T extends TreeItem = TreeItem>({
  indentationWidth = 24,
  items,
  setItems,
  showDropIndicator = false,
  hideDragOverlayContent = false,
  onDragEnd,
  renderItem,
}: SortableTreeProps<T>) {
  const styles = useStyles()
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const flattenedItems = useMemo(() => flattenTree(items as any) as FlattenedItem[], [items])

  const projectedItems = useMemo(
    () => (activeId ? removeChildrenOf(flattenedItems, [activeId]) : flattenedItems),
    [activeId, flattenedItems]
  )

  const activeItem = useMemo(
    () => (activeId != null ? (findItemDeep(items as any, activeId) as any) : undefined),
    [activeId, items]
  )

  const projected = useMemo(() => {
    if (!activeId || !overId) return null
    return getProjection(projectedItems, activeId, overId, offset, indentationWidth)
  }, [activeId, indentationWidth, offset, overId, projectedItems])

  const visibleItems = projectedItems

  const ids = useMemo(() => visibleItems.map((i) => i.id), [visibleItems])

  const sensorContext = useRef({ items: visibleItems, offset: 0 })
  sensorContext.current.items = visibleItems
  sensorContext.current.offset = offset

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id)
    setOverId(active.id)
    setOffset(0)
    offsetRef.current = 0
  }

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffset(delta.x)
    offsetRef.current = delta.x
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeKey = active.id
    const overKey = over?.id ?? activeKey

    try {
      if (!overKey) return

      const projectionItems = removeChildrenOf(flattenedItems, [activeKey])
      const projection = getProjection(
        projectionItems,
        activeKey,
        overKey,
        offsetRef.current,
        indentationWidth
      )

      const activeIndex = flattenedItems.findIndex((i) => i.id === activeKey)
      const overIndex = flattenedItems.findIndex((i) => i.id === overKey)
      if (activeIndex === -1 || overIndex === -1) return

      // Allow pure horizontal moves (indent/outdent) without changing vertical position.
      if (activeKey === overKey) {
        const current = flattenedItems[activeIndex]
        const isNoop =
          current.depth === projection.depth &&
          (current.parentId ?? null) === (projection.parentId ?? null)
        if (isNoop) return
      }

      const newItems = arrayMove(flattenedItems, activeIndex, overIndex).map((item) =>
        item.id === activeKey
          ? { ...item, depth: projection.depth, parentId: projection.parentId }
          : item
      )

      const nextTree = buildTree(newItems) as TreeItems<T>
      setItems(nextTree)

      const movedItem = findItemDeep(nextTree as any, activeKey) as any
      const siblings = newItems.filter((i) => i.parentId === projection.parentId)
      const index = siblings.findIndex((i) => i.id === activeKey)
      const result: DropResult = movedItem
        ? { movedItem, parent: projection.parentId, index: Math.max(0, index) }
        : null
      onDragEnd?.(result)
    } finally {
      setActiveId(null)
      setOverId(null)
      setOffset(0)
      offsetRef.current = 0
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={({ over }) => setOverId(over?.id ?? null)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {visibleItems.map((item) => {
            const depth = item.id === activeId && projected ? projected.depth : item.depth
            const isOver = item.id === overId
            const activeIndex = activeId ? visibleItems.findIndex((i) => i.id === activeId) : -1
            const overIndex = visibleItems.findIndex((i) => i.id === item.id)
            const indicatorPosition =
              activeIndex !== -1 && overIndex !== -1 && activeIndex < overIndex ? 'bottom' : 'top'
            const childCount = getChildCount(items as any, item.id)
            return (
              <SortableRow
                key={String(item.id)}
                item={item as any}
                depth={depth}
                indentationWidth={indentationWidth}
                showDropIndicator={showDropIndicator}
                isOver={isOver}
                indicatorPosition={indicatorPosition}
                renderItem={(props) =>
                  renderItem ? renderItem({ ...props, childCount } as any) : null
                }
              />
            )
          })}
        </ul>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {hideDragOverlayContent || !activeItem ? null : (
          <Box sx={styles.dragOverlay}>
            {renderItem ? (
              renderItem({
                treeItem: activeItem as any,
                dropZoneRef: () => {},
                draggableItemRef: () => {},
                dataSlots: { dropZone: {}, draggableItem: {} },
                clone: true,
                ghost: false,
                indicator: false,
              } as any)
            ) : (
              <Box>{activeItem.label}</Box>
            )}
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  )
}
