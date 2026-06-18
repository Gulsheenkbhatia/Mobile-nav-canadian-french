import { SitePreviewConfig } from 'toro/helpers/sitePreview'

export type SitePreviewShareUrlModalProps = {
  isOpen: boolean
  onClose: () => void
  sitePreviewConfig: SitePreviewConfig
  isSitePreviewDataSet: boolean
}

export type SitePreviewShareUrlButtonProps = {
  onOpen: () => void
  isSitePreviewDataSet: boolean
}

export type SitePreviewShareUrlModalContentProps = {
  onClose: () => void
  sitePreviewConfig: SitePreviewConfig
}
