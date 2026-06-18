import { type CSSProperties, type FC } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import TreeItemSlot from 'toro/components/SitePreview/TemplateEditor/TreeItemSlot'
import useStyles from 'toro/hooks/useStyles'
import { TemplateRenderMode, type ITemplateComponentsKeys } from 'toro/helpers/templating/types'
import {
  TreeItemStructure,
  type RenderItemProps,
  type TreeItem,
  type UniqueIdentifier,
} from 'toro/components/SitePreview/TemplateEditor/lib'

type TemplateTreeItemProps<T extends TreeItem = TreeItem> = RenderItemProps<T> & {
  availableComponents: ITemplateComponentsKeys[]
  baseComponents: ITemplateComponentsKeys[]
  renderMode: TemplateRenderMode
  isAddOpen: boolean
  onToggleAdd: () => void
  onAddAfter: (component: ITemplateComponentsKeys) => void
  onRemove: (id: UniqueIdentifier) => void
}

const TemplateTreeItem: FC<TemplateTreeItemProps> = ({
  availableComponents,
  baseComponents,
  renderMode,
  isAddOpen,
  onToggleAdd,
  onAddAfter,
  onRemove,
  ...props
}) => {
  const styles = useStyles()
  const treeItem = props.treeItem as TreeItem<{ component?: ITemplateComponentsKeys }>

  const draggableItemStyle: CSSProperties = {
    ...(styles.draggableItem as CSSProperties),
    ...(props.draggableItemStyle ?? {}),
  }

  const shouldShowRemoveButton = !(
    renderMode === TemplateRenderMode.MERGE &&
    !!treeItem.component &&
    baseComponents.includes(treeItem.component)
  )

  return (
    <TreeItemStructure
      {...props}
      asDropZone={Box}
      asDraggableItem={Box}
      draggableItemStyle={draggableItemStyle}
    >
      <Box sx={styles.itemBox}>
        <TreeItemStructure.DragHandler>
          <Box sx={styles.dragHandler}>⋮⋮</Box>
        </TreeItemStructure.DragHandler>

        <Box sx={styles.itemLabel}>{(treeItem.component ?? treeItem.label) as string}</Box>

        <Button
          disabled={!availableComponents.length}
          variant="outline"
          colorScheme="teal"
          sx={styles.addButton}
          onClick={onToggleAdd}
          aria-label="Add component"
        >
          {isAddOpen ? '-' : '+'}
        </Button>

        {shouldShowRemoveButton && (
          <Button
            variant="outline"
            colorScheme="red"
            sx={styles.removeButton}
            onClick={() => onRemove(treeItem.id)}
            aria-label="Remove component"
          >
            x
          </Button>
        )}
      </Box>

      {isAddOpen && !!availableComponents.length && (
        <TreeItemSlot
          components={availableComponents}
          onChange={(event) => onAddAfter(event.currentTarget.value as ITemplateComponentsKeys)}
        />
      )}
    </TreeItemStructure>
  )
}

export default TemplateTreeItem
