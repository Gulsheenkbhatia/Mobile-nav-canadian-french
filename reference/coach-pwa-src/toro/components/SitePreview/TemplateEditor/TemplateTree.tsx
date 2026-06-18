import { type FC, useCallback, useMemo, useState } from 'react'
import Box from 'toro/components/Box'
import Radio from 'toro/components/Radio'
import RadioGroup from 'toro/components/RadioGroup'
import type {
  EditorTreeItem,
  TemplateTree as TemplateTreeType,
} from 'toro/components/SitePreview/TemplateEditor/types'
import TemplateTreeItem from 'toro/components/SitePreview/TemplateEditor/TemplateTreeItem'
import useStyles from 'toro/hooks/useStyles'
import { TemplateRenderMode, type ITemplateComponentsKeys } from 'toro/helpers/templating/types'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  pdpTemplateEditorAtom,
  removeTreeItemAtom,
  updateRenderModeAtom,
  updateTreeAtom,
  addNewTreeItemAtom,
  updateUniqueIdsAtom,
} from 'store/pdp-template-editor.atom'
import {
  SortableTree,
  type RenderItemProps,
  type UniqueIdentifier,
  type DropResult,
} from 'toro/components/SitePreview/TemplateEditor/lib'
import { toSortableItems } from 'toro/components/SitePreview/TemplateEditor/utils'

const findParentAndIndex = (
  tree: TemplateTreeType,
  targetId: UniqueIdentifier,
  parentId: UniqueIdentifier | null = null
): { parentId: UniqueIdentifier | null; index: number } | null => {
  const index = tree.findIndex((node) => node.id === targetId)

  if (index !== -1) {
    return { parentId, index }
  }

  for (const node of tree) {
    if (node.children?.length) {
      const result = findParentAndIndex(node.children, targetId, node.id)
      if (result) return result
    }
  }

  return null
}

const TemplateTree: FC = () => {
  const styles = useStyles()
  const { tree, renderMode, availableComponents, baseComponents } =
    useAtomValue(pdpTemplateEditorAtom)

  const updateTree = useUpdateAtom(updateTreeAtom)
  const updateRenderMode = useUpdateAtom(updateRenderModeAtom)
  const removeItem = useUpdateAtom(removeTreeItemAtom)
  const addNewItem = useUpdateAtom(addNewTreeItemAtom)
  const updateUniqueIds = useUpdateAtom(updateUniqueIdsAtom)

  const [openAddForId, setOpenAddForId] = useState<UniqueIdentifier | null>(null)

  const items = useMemo(() => toSortableItems(tree), [tree])

  const onAddAfter = useCallback(
    (targetId: UniqueIdentifier, component: ITemplateComponentsKeys) => {
      const location = findParentAndIndex(tree, targetId)
      if (!location) return

      addNewItem({
        component,
        index: location.index + 1,
        isNested: location.parentId !== null,
        parentId: location.parentId ?? targetId,
      })
    },
    [addNewItem, tree]
  )

  const onDragEnd = useCallback(
    (item: DropResult) => {
      updateUniqueIds(item.movedItem.id)
    },
    [updateUniqueIds]
  )

  const renderItem = useCallback(
    (props: RenderItemProps<EditorTreeItem>) => {
      const treeItem = props.treeItem
      const isAddOpen = openAddForId === treeItem.id

      return (
        <TemplateTreeItem
          {...props}
          availableComponents={availableComponents}
          baseComponents={baseComponents}
          renderMode={renderMode}
          isAddOpen={isAddOpen}
          onToggleAdd={() => setOpenAddForId((prev) => (prev === treeItem.id ? null : treeItem.id))}
          onAddAfter={(component) => {
            onAddAfter(treeItem.id, component)
            setOpenAddForId(null)
          }}
          onRemove={removeItem}
        />
      )
    },
    [availableComponents, baseComponents, onAddAfter, removeItem, openAddForId, renderMode, items]
  )

  return (
    <>
      <Box sx={styles.radioGroupBox}>
        <Box as="label" sx={styles.radioLabel}>
          Render mode
        </Box>
        <RadioGroup sx={styles.radioGroup} value={renderMode} onChange={updateRenderMode}>
          <Radio value={TemplateRenderMode.MERGE}>Merge</Radio>
          <Radio value={TemplateRenderMode.REPLACE}>Replace</Radio>
        </RadioGroup>
      </Box>
      <Box sx={styles.sortableTree}>
        <SortableTree<EditorTreeItem>
          items={items}
          setItems={updateTree}
          onDragEnd={onDragEnd}
          renderItem={renderItem}
          indentationWidth={24}
          showDropIndicator
          hideDragOverlayContent
        />
      </Box>
    </>
  )
}

export default TemplateTree
