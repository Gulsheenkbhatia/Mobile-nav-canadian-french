import useProductData from 'toro/hooks/useProductData'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'

export const useExpandableAccordionLogic = () => {
  const [featuredContentData, longDescription, editorNotes, accordionItems] = useProductData([
    'featuredContentData',
    'custom.c_longDescription2',
    'custom.c_editorsNoteDescription',
    'pdpAccordionItems',
  ])
  const { hasStructuredCopy } = useStructuredCopy()
  const isCollapsibleEnabled = useExperiment(EXPERIMENTS.SHOW_COLLAPSIBLE_PRODUCT_INFO_V6)
  const hasFeaturedContent = Boolean(featuredContentData)
  const hasProductDetails = Boolean(longDescription || editorNotes || hasStructuredCopy)
  const dynamicAccordionCount = accordionItems?.length || 0

  const totalAccordions = Number(hasProductDetails) + dynamicAccordionCount
  const shouldShowCollapsible = isCollapsibleEnabled && (hasFeaturedContent || totalAccordions > 1)

  return {
    hasFeaturedContent,
    shouldShowCollapsible,
  }
}
