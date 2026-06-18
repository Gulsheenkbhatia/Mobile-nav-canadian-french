import { useIntl } from 'react-intl'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import { isSubBrandActiveAtom } from 'store/global.atom'
import useViewportType from 'toro/hooks/useViewportType'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { aeDrawerConfigAtom, setAEDrawerConfigAtom } from 'store/ae-drawer.atom'
import useDisclosure from 'toro/hooks/useDisclosure'
import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'
import Drawer from 'toro/components/Drawer'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useEffect, useMemo } from 'react'
import usePageType from 'toro/hooks/usePageType'
import { useRouter } from 'next/router'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { drawerAtom } from 'store/addToCartDrawer.atom'

const AEDrawerContent = dynamic(() => import('toro/components/AEDrawer/AEDrawerContent'), {
  ssr: false,
})

const AEDrawerBody = dynamic(() => import('toro/components/AEDrawer/AEDrawerBody'), {
  ssr: false,
})

export default function AEDrawer() {
  const { formatMessage } = useIntl()
  const { isDesktop, viewport } = useViewportType()
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const resetAEDrawerConfig = useResetAtom(setAEDrawerConfigAtom)
  const aeDrawerConfig = useAtomValue(aeDrawerConfigAtom)
  const analytics = useAnalytics()
  const router = useRouter()
  const styles = useMultiStyleConfig('AEDrawer')
  const atbDrawerState = useAtomValue(drawerAtom)

  const {
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreferenceNew({
    adaptiveExperience: ['enableAEDrawerExp'],
  })

  const { isPDP } = usePageType()
  const pageType = isPDP ? 'PDP' : 'PLP'

  const variant = useMemo(() => {
    const displayVariant = get(
      enableAEDrawerExp,
      [pageType, 'variant', isDesktop ? 'desktop' : 'mobile'],
      'carousel'
    )
    return displayVariant === 'grid' ? 'aeDrawerGrid' : 'aeDrawer'
  }, [enableAEDrawerExp, pageType, isDesktop])

  const isAEDrawerExperienceEnabled = getPreferenceConfigValue(
    enableAEDrawerExp,
    isSubBrandActive,
    isDesktop
  )

  const isDisplayTitleEnabled = get(enableAEDrawerExp, `${pageType}.displayTitle`, false)

  const title = isDisplayTitleEnabled
    ? formatMessage({
        id: isPDP ? 'header.drawerTitlePDP' : 'header.drawerTitlePLP',
        defaultMessage: 'Similar To',
      })
    : ''

  const onDrawerInteraction = (drawerState) => {
    analytics.send(
      'openRecommendDrawer',
      {
        eventLocation: aeDrawerConfig.eventLocation || 'category',
        eventAction: `recommendation drawer ${drawerState}`,
        eventLabel: `Similar to ${aeDrawerConfig.activeProduct?.name}`,
      },
      true
    )
  }
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      resetAEDrawerConfig()
      if (isOpen) {
        onDrawerInteraction('close')
      }
    },
    onOpen: () => {
      onDrawerInteraction('open')
    },
  })
  useEffect(() => {
    if (isAEDrawerExperienceEnabled && aeDrawerConfig.showDrawer) {
      onOpen()
    }
  }, [isAEDrawerExperienceEnabled, aeDrawerConfig.showDrawer])

  useEffect(() => {
    router.events.on('routeChangeStart', onClose)

    return () => {
      router.events.off('routeChangeStart', onClose)
    }
  }, [])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isDesktop ? 'right' : 'bottom'}
      variant="flyout"
      size="lg"
      blockScrollOnMount={!atbDrawerState.drawerVisible}
    >
      <AEDrawerContent
        title={title}
        viewport={viewport}
        productData={aeDrawerConfig.activeProduct}
        styles={styles}
      >
        <AEDrawerBody
          closeOnItemClick={onClose}
          variant={variant}
          styles={styles}
          pageType={pageType}
        />
      </AEDrawerContent>
    </Drawer>
  )
}
