import { v4 as uuidv4 } from 'uuid'
import type {
  EditorTreeItem,
  TemplateTree,
  TemplateTreeNode,
} from 'toro/components/SitePreview/TemplateEditor/types'
import { atomWithReset, selectAtom } from 'jotai/utils'
import {
  collectComponentsFromTree,
  convertComponentsMapToList,
  convertTemplateConfigToTree,
  convertTreeToConfig,
  fromSortableItems,
  getAvailableComponents,
  insertAt,
  insertChildAt,
  removeById,
} from 'toro/components/SitePreview/TemplateEditor/utils'
import BASE_CONFIG from 'toro/helpers/templating/baseConfig'
import { componentsMap } from 'toro/components/product/mobile/ProductDetails/componentsMapping'
import {
  type ITemplateComponentConfig,
  type ITemplateComponentsKeys,
  TemplateRenderMode,
} from 'toro/helpers/templating/types'
import { atom } from 'jotai'
import type { TreeItems, UniqueIdentifier } from 'toro/components/SitePreview/TemplateEditor/lib'
import _uniq from 'lodash/uniq'

type AtomInitialState = {
  tree: TemplateTree
  baseComponents: ITemplateComponentsKeys[]
  availableComponents: ITemplateComponentsKeys[]
  templatePreview: ITemplateComponentConfig['slots'] | null
  renderMode: TemplateRenderMode
  uniqueIds: TemplateTreeNode['id'][]
}

const initialTree = convertTemplateConfigToTree(BASE_CONFIG)
const components = convertComponentsMapToList(componentsMap)

const INITIAL_STATE: AtomInitialState = {
  tree: initialTree,
  baseComponents: collectComponentsFromTree(initialTree),
  availableComponents: getAvailableComponents(components, initialTree),
  templatePreview: null,
  renderMode: TemplateRenderMode.MERGE,
  uniqueIds: [],
}

export const pdpTemplateEditorAtom = atomWithReset<AtomInitialState>(INITIAL_STATE)

type AddNewTreeItemPayload = {
  component: ITemplateComponentsKeys
  index: number
  isNested: boolean
  parentId: UniqueIdentifier
}
export const addNewTreeItemAtom = atom(
  null,
  (get, set, { component, index, isNested, parentId }: AddNewTreeItemPayload) => {
    const state = get(pdpTemplateEditorAtom)
    const item = { id: uuidv4(), component }
    const tree = isNested
      ? insertChildAt({ array: state.tree, item, index, parentId })
      : insertAt({ array: state.tree, item, index })

    set(pdpTemplateEditorAtom, {
      ...state,
      tree,
      availableComponents: getAvailableComponents(components, tree),
      uniqueIds: [...state.uniqueIds, item.id],
    })
  }
)

export const removeTreeItemAtom = atom(null, (get, set, id: UniqueIdentifier) => {
  const state = get(pdpTemplateEditorAtom)
  const tree = removeById({ array: state.tree, id })

  set(pdpTemplateEditorAtom, {
    ...state,
    tree,
    availableComponents: getAvailableComponents(components, tree),
    uniqueIds: state.uniqueIds.filter((nodeId) => nodeId !== id),
  })
})

export const updateTreeAtom = atom(null, (get, set, reorderedTree: TreeItems<EditorTreeItem>) => {
  const state = get(pdpTemplateEditorAtom)
  const tree = fromSortableItems(reorderedTree)

  set(pdpTemplateEditorAtom, {
    ...state,
    tree,
    availableComponents: getAvailableComponents(components, tree),
  })
})

export const templatePreviewAtom = selectAtom(
  pdpTemplateEditorAtom,
  (state) => state.templatePreview
)

export const applyTemplatePreviewAtom = atom(null, (get, set) => {
  const state = get(pdpTemplateEditorAtom)
  set(pdpTemplateEditorAtom, {
    ...state,
    templatePreview: convertTreeToConfig(state.tree),
  })
})

export const updateRenderModeAtom = atom(null, (get, set, renderMode: TemplateRenderMode) => {
  const state = get(pdpTemplateEditorAtom)
  set(pdpTemplateEditorAtom, {
    ...state,
    renderMode,
    tree: initialTree,
    availableComponents: getAvailableComponents(components, initialTree),
    templatePreview: null,
    uniqueIds: [],
  })
})

export const updateUniqueIdsAtom = atom(null, (get, set, id: TemplateTreeNode['id']) => {
  const state = get(pdpTemplateEditorAtom)
  set(pdpTemplateEditorAtom, {
    ...state,
    uniqueIds: _uniq([...state.uniqueIds, id]),
  })
})
