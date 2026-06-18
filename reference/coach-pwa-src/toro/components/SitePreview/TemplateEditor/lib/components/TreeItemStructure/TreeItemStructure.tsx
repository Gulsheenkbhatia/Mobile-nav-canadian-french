import type { CSSProperties, ElementType, ReactNode } from 'react'
import React, { createContext, useContext } from 'react'
import type { TreeItem } from '../../types'
import Box from 'toro/components/Box'
import useStyles from 'toro/hooks/useStyles'

type AriaProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

type DragListeners = Record<string, unknown> | undefined

const DragListenersContext = createContext<DragListeners>(undefined)

export type TreeItemStructureProps = {
  treeItem: TreeItem & { parentId?: string }
  dropZoneRef: (element: HTMLElement | null) => void
  draggableItemRef: React.Ref<any>
  dropZoneStyle?: CSSProperties
  draggableItemStyle?: CSSProperties
  classNames?: {
    dropZone?: string
    draggableItem?: string
  }
  asDropZone?: ElementType
  asDraggableItem?: ElementType
  children?: ReactNode
  clone?: boolean
  dataSlots: {
    dropZone?: AriaProps & Record<string, string | boolean | number | undefined>
    draggableItem?: AriaProps & Record<string, string>
  }
  dragListeners?: any
}

function DragHandler({
  children,
  as: Component = 'span',
  className,
  style,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
}) {
  const dragListeners = useContext(DragListenersContext)
  return (
    <Component className={className} style={style} {...(dragListeners ?? {})}>
      {children}
    </Component>
  )
}

export const TreeItemStructure = Object.assign(
  function TreeItemStructure({
    dropZoneRef,
    draggableItemRef,
    dropZoneStyle,
    draggableItemStyle,
    classNames,
    asDropZone: DropZoneComponent = 'li',
    asDraggableItem: DraggableComponent = 'div',
    children,
    dataSlots,
    treeItem,
    clone,
    dragListeners,
  }: TreeItemStructureProps) {
    const styles = useStyles()
    return (
      <DragListenersContext.Provider value={dragListeners}>
        <DropZoneComponent
          ref={dropZoneRef as any}
          style={dropZoneStyle}
          className={classNames?.dropZone}
          {...(dataSlots.dropZone ?? {})}
          data-tree-item-id={String(treeItem.id)}
          data-clone={clone ? 'true' : undefined}
        >
          <DraggableComponent
            ref={draggableItemRef as any}
            style={draggableItemStyle}
            className={classNames?.draggableItem}
            {...(dataSlots.draggableItem ?? {})}
          >
            {children}
          </DraggableComponent>
          {(() => {
            const indicator = (dataSlots.dropZone as any)?.['data-indicator'] === 'true'
            if (!indicator) return null
            const pos = (dataSlots.dropZone as any)?.['data-indicator-position']
            const isBottom = pos === 'bottom'
            return (
              <Box
                sx={{
                  ...styles.indicator,
                  top: isBottom ? 'auto' : 0,
                  bottom: isBottom ? 0 : 'auto',
                }}
              />
            )
          })()}
        </DropZoneComponent>
      </DragListenersContext.Provider>
    )
  },
  { DragHandler }
)
