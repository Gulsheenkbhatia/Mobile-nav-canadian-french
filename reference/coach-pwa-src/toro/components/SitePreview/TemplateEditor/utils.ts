import { v4 as uuidv4 } from 'uuid'
import {
  type ITemplateComponentConfig,
  type ITemplateComponentConfigItem,
  ITemplateComponentsKeys,
} from 'toro/helpers/templating/types'
import type {
  EditorTreeItem,
  TemplateTree as TemplateTreeType,
  TemplateTree,
  TemplateTreeNode,
} from 'toro/components/SitePreview/TemplateEditor/types'
import type { ComponentType } from 'react'
import type { TreeItems, UniqueIdentifier } from 'toro/components/SitePreview/TemplateEditor/lib'
import _isEqual from 'lodash/isEqual'

const mapConfigChildrenToTree = (children: ITemplateComponentConfigItem[]): TemplateTreeNode[] =>
  children.map((child) => ({
    id: uuidv4(),
    component: child.component,
    ...(child.children?.length ? { children: mapConfigChildrenToTree(child.children) } : {}),
  }))

export const convertTemplateConfigToTree = (
  templateConfig: ITemplateComponentConfig['slots']
): TemplateTree => {
  return Object.entries(templateConfig).map(([_, item]) => {
    const children = item.children?.length ? mapConfigChildrenToTree(item.children) : undefined

    return {
      id: uuidv4(),
      component: item.component,
      ...(children?.length ? { children } : {}),
    }
  })
}

const mapTreeNodeChildrenToConfig = (nodes: TemplateTreeNode[]): ITemplateComponentConfigItem[] =>
  nodes.map((node) => ({
    component: node.component,
    ...(node.children?.length ? { children: mapTreeNodeChildrenToConfig(node.children) } : {}),
  }))

export const convertTreeToConfig = (tree: TemplateTree): ITemplateComponentConfig['slots'] =>
  tree.reduce<Record<string, ITemplateComponentConfigItem>>((acc, node, index) => {
    const slotKey = `SLOT_${index + 1}`
    acc[slotKey] = {
      component: node.component,
      ...(node.children?.length
        ? {
            children: mapTreeNodeChildrenToConfig(node.children),
          }
        : {}),
    }
    return acc
  }, {})

export const convertComponentsMapToList = (
  componentsMap: Record<ITemplateComponentsKeys, ComponentType>
): ITemplateComponentsKeys[] =>
  Array.from(new Set(Object.keys(componentsMap) as ITemplateComponentsKeys[]))

export const collectComponentsFromTree = (tree: TemplateTree): ITemplateComponentsKeys[] => {
  return tree.flatMap((node) => {
    return [
      node.component,
      ...(node.children?.length ? collectComponentsFromTree(node.children) : []),
    ]
  })
}

export const getAvailableComponents = (
  components: ITemplateComponentsKeys[],
  tree: TemplateTree
): ITemplateComponentsKeys[] => {
  const usedComponents = new Set(collectComponentsFromTree(tree))
  return components.filter((component) => !usedComponents.has(component))
}

type InsertAt<T> = (params: { array: T[]; index: number; item: T }) => T[]
export const insertAt: InsertAt<TemplateTreeNode> = ({ array, index, item }) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
]

type InsertChildAt<T> = (params: {
  array: T[]
  index: number
  parentId: UniqueIdentifier
  item: T
}) => T[]
export const insertChildAt: InsertChildAt<TemplateTreeNode> = ({
  array,
  index,
  parentId,
  item,
}) => {
  return array.map((node) => {
    if (node.id === parentId) {
      const children = node.children ?? []
      return { ...node, children: insertAt({ array: children, item, index }) }
    }

    if (node.children?.length) {
      return {
        ...node,
        children: insertChildAt({
          array: node.children,
          index,
          parentId,
          item,
        }),
      }
    }

    return node
  })
}

type RemoveById = (params: { array: TemplateTree; id: UniqueIdentifier }) => TemplateTree
export const removeById: RemoveById = ({ array, id }) => {
  return array
    .filter((node) => node.id !== id)
    .map((node) => {
      if (!node.children?.length) return node
      const newChildren = removeById({ array: node.children as TemplateTree, id })
      return {
        ...node,
        children: newChildren.length ? newChildren : undefined,
      }
    })
}

const treeHasAnyId = (node: TemplateTreeNode, ids: TemplateTreeNode['id'][]): boolean => {
  if (ids.includes(node.id)) return true
  return (node.children ?? []).some((child) => treeHasAnyId(child, ids))
}

export const getTemplateConfigChanges = (
  baseConfig: ITemplateComponentConfig['slots'],
  currentTree: TemplateTree,
  uniqueIds: TemplateTreeNode['id'][]
): ITemplateComponentConfig['slots'] => {
  const currentConfig = convertTreeToConfig(currentTree)
  const touchedSlots: Array<{ slotKey: string; rootId: TemplateTreeNode['id'] }> = []

  currentTree.forEach((slotRootNode, index) => {
    if (!slotRootNode) return
    if (!uniqueIds.length) return
    if (!treeHasAnyId(slotRootNode, uniqueIds)) return
    touchedSlots.push({ slotKey: `SLOT_${index + 1}`, rootId: slotRootNode.id })
  })

  return touchedSlots
    .map((t) => t.slotKey)
    .sort((a, b) => parseInt(a.replace('SLOT_', '')) - parseInt(b.replace('SLOT_', '')))
    .reduce<Record<string, ITemplateComponentConfigItem>>((result, slotKey) => {
      const currentSlot = currentConfig[slotKey]
      if (!currentSlot) return result

      const touchedSlot = touchedSlots.find((t) => t.slotKey === slotKey)
      const baseSlot = (baseConfig as Record<string, ITemplateComponentConfigItem | undefined>)[
        slotKey
      ]
      const isChanged = !baseSlot || !_isEqual(baseSlot, currentSlot)
      const isDirectRootTouch = Boolean(touchedSlot && uniqueIds.includes(touchedSlot.rootId))

      if (isChanged || isDirectRootTouch) result[slotKey] = currentSlot
      return result
    }, {})
}

export const toSortableItems = (tree: TemplateTreeType): TreeItems<EditorTreeItem> => {
  return tree.map((node) => ({
    id: node.id,
    label: node.component,
    component: node.component,
    children: toSortableItems(node.children ?? []),
  }))
}

type SortableTreeUnknownItem = {
  id: UniqueIdentifier
  label: string
  children: SortableTreeUnknownItem[]
  component?: ITemplateComponentsKeys
}
export const fromSortableItems = (items: SortableTreeUnknownItem[]): TemplateTreeType => {
  return items.map((item) => ({
    id: item.id,
    component: item.component ?? (item.label as ITemplateComponentsKeys),
    children: item.children?.length ? fromSortableItems(item.children) : undefined,
  }))
}
