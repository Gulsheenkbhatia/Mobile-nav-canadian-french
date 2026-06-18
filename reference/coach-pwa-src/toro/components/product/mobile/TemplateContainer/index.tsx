import TemplateThemeProvider from 'toro/components/TemplateThemeProvider'
import pdpV6Theme from 'pdpv6-theme'
import pdpV6SubTheme from 'pdpv6-sub-theme'
import usePdpAnalytics from 'toro/hooks/usePdpAnalytics'
import useTangibleeColorSwatches from 'toro/hooks/useTangibleeColorSwatches'
import useProductData from 'toro/hooks/useProductData'
import { getComponent } from 'toro/components/product/mobile/ProductDetails/componentsMapping'
import { useMemo } from 'react'
import { type ITemplateComponentConfigItem } from 'toro/helpers/templating/types'
import Box from 'toro/components/Box'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'
import { templatePreviewAtom } from 'store/pdp-template-editor.atom'
import { useAtomValue } from 'jotai/utils'
import { isSubBrandActiveAtom } from 'store/global.atom'

const renderItem = (item: ITemplateComponentConfigItem) => {
  const Component = getComponent(item.component)

  if (!Component) {
    return null
  }

  if (item.children?.length > 0) {
    const children = item.children.map((item) => renderItem(item))
    return <Component key={item.component}>{children}</Component>
  }

  return <Component key={item.component} />
}

const TemplateContainer = () => {
  usePdpAnalytics()
  useTangibleeColorSwatches()
  const headerHeight = useHeaderHeight()
  const isKateSpade = useIsKS()
  const templateConfig = useProductData('templateConfig')
  const templatePreview = useAtomValue(templatePreviewAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const marginTop = isKateSpade ? `${-headerHeight}px` : `0px`
  const backgroundColor = isKateSpade
    ? 'var(--color-neutral-light-1, #F0F0F0)'
    : 'var(--color-neutral-light)'

  const template = useMemo(() => {
    if (templatePreview) {
      return Object.values(templatePreview).map(renderItem)
    }

    if (!templateConfig) return
    return Object.values(templateConfig).map(renderItem)
  }, [templateConfig, templatePreview])

  return (
    <TemplateThemeProvider id="pdpv6" theme={isSubBrandActive ? pdpV6SubTheme : pdpV6Theme}>
      <Box marginTop={marginTop} backgroundColor={backgroundColor} pb="var(--spacing-1)">
        {template}
      </Box>
    </TemplateThemeProvider>
  )
}

export default TemplateContainer
