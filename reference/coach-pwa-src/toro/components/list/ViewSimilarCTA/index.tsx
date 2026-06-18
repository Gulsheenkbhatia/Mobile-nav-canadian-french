import { useCallback } from 'react'
import Button from 'toro/components/Button'
import Link from 'toro/components/Link'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'
import get from 'lodash/get'
import { setAEDrawerConfigAtom } from 'store/ae-drawer.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import useLLMRecommendations from 'toro/hooks/useLLMRecommendations'
import { xgenClientAtom } from 'store/xgen.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import Box from 'toro/components/Box'
import { ListingProduct } from 'toro/types/productTypes'
import { SystemStyleObject } from '@chakra-ui/react'

interface ViewSimilarCTAProps {
  styles: Record<string, SystemStyleObject>
  icon?: React.ReactNode
  activeProduct: ListingProduct
  product: ListingProduct
  visuallySimilarProp?: string
}

const ViewSimilarCTA = ({
  styles,
  icon,
  activeProduct,
  product,
  visuallySimilarProp = '',
}: ViewSimilarCTAProps) => {
  const setAEDrawerConfig = useUpdateAtom(setAEDrawerConfigAtom)
  const xgenClient = useAtomValue(xgenClientAtom)
  const { recommendations } = useAtomValue(xgenFeaturesAtom)
  const { setVisuallySimilarProp } = useLLMRecommendations()
  const { formatMessage } = useIntl()

  const {
    toggleSiteFeatures: { similarOptionsCTAConfig = {} } = {},
    adaptiveExperience: { enableAEDrawerExp = {} } = {},
  } = usePreference({
    ToggleSiteFeatures: ['similarOptionsCTAConfig'],
    adaptiveExperience: ['enableAEDrawerExp'],
  })
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const { isDesktop } = useViewportType()
  const analytics = useAnalytics()
  const isAEDrawerEnabledOnPLP = get(enableAEDrawerExp, 'PLP.enable', false)
  const isAEDrawerExperienceEnabled =
    getPreferenceConfigValue(enableAEDrawerExp, isSubBrandActive, isDesktop) &&
    isAEDrawerEnabledOnPLP

  const similarOptionsLink = get(
    similarOptionsCTAConfig,
    'PLP.link',
    '/just-for-you.html?productID={productID}'
  )

  const onClickViewSimilarLink = useCallback(() => {
    analytics.send('listInteraction', {
      eventAction: 'view similar click',
      eventLocation: 'product tile',
      eventLabel: get(product, 'id'),
    })
  }, [product, analytics.send])

  const openAEDrawer = useCallback(() => {
    setVisuallySimilarProp(visuallySimilarProp)

    if (!visuallySimilarProp && recommendations) {
      const productId = get(product, 'id')
      xgenClient.recommendations.setPdpProduct(productId)
      xgenClient.recommendations.excludeProducts(productId)
    }

    setAEDrawerConfig({
      showDrawer: true,
      activeProduct,
      eventLocation: 'category module',
    })
  }, [activeProduct, visuallySimilarProp])

  return (
    <ConditionalWrapper
      condition={!isAEDrawerExperienceEnabled}
      Wrapper={Link}
      href={similarOptionsLink.replace('{productID}', activeProduct?.id)}
      onClick={onClickViewSimilarLink}
      sx={styles.viewSimilarLinkWrapper}
    >
      <Button
        sx={styles.viewSimilarButton}
        onClick={isAEDrawerExperienceEnabled ? openAEDrawer : undefined}
        data-qa={isDesktop ? 'd_plp_view_similar' : 'm_plp_view_similar'}
      >
        {icon}
        <Box as="span" sx={styles.viewSimilarButtonText}>
          {formatMessage({
            id: 'plp.similaroptionTextPLP',
            defaultMessage: 'View Similar',
          })}
        </Box>
      </Button>
    </ConditionalWrapper>
  )
}

export default ViewSimilarCTA
