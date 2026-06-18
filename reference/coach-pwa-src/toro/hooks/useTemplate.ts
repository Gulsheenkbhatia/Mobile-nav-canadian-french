import { TemplateName, TemplateNames } from 'toro/constants/templates'
import { useMemo } from 'react'
import useProductData from 'toro/hooks/useProductData'
import useViewportType from 'toro/hooks/useViewportType'

export const USE_TEMPLATE_VALIDATION_MESSAGES = {
  EMPTY_TEMPLATE: '[useTemplate] Empty template list provided.',
  INVALID_TEMPLATE: '[useTemplate] Invalid template provided.',
}

const useTemplate = (templates: TemplateNames) => {
  const currentTemplates = useProductData('templates') || {
    mobile: TemplateName.default,
    desktop: TemplateName.default,
  }
  const { isMobile } = useViewportType() || {}
  const currentTemplate = isMobile ? currentTemplates.mobile : currentTemplates.desktop

  return useMemo(() => {
    if (!templates?.length) {
      console.error(USE_TEMPLATE_VALIDATION_MESSAGES.EMPTY_TEMPLATE)
      return false
    }

    if (typeof currentTemplate !== 'string') {
      console.error(USE_TEMPLATE_VALIDATION_MESSAGES.INVALID_TEMPLATE)
      return false
    }

    return templates.some((template) => currentTemplate.includes(template))
  }, [templates?.join(), currentTemplate])
}

export default useTemplate
