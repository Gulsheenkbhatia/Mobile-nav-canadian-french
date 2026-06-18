import type { TreeItem, UniqueIdentifier } from 'toro/components/SitePreview/TemplateEditor/lib'
import type { ITemplateComponentsKeys } from 'toro/helpers/templating/types'

export type TemplateTreeNode = {
  id: UniqueIdentifier
  component: ITemplateComponentsKeys
  children?: TemplateTreeNode[]
}

export type TemplateTree = TemplateTreeNode[]

export type EditorTreeItem = TreeItem<{
  component: ITemplateComponentsKeys
}>
