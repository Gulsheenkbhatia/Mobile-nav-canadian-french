import { useMemo } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { NavChevronUpIcon, NavChevronDownIcon } from 'toro/icons'
import useAnalytics from 'toro/analytics/useAnalytics'

interface MobilePromoBannerNotchProps {
  promoBannerIsHidden: boolean
  setPromoBannerIsHidden: (hidden: boolean) => void
  bannerRef: HTMLElement
}

function MobilePromoBannerNotch({
  promoBannerIsHidden,
  setPromoBannerIsHidden,
  bannerRef,
}: MobilePromoBannerNotchProps) {
  const styles = useMultiStyleConfig('HeaderPage')
  const analytics = useAnalytics()

  const stylesPromoBannerNotchLine = useMemo(
    () => ({
      ...styles?.promoBannerNotchLine,
      ...{ height: promoBannerIsHidden ? '8px' : 0 },
    }),
    [promoBannerIsHidden]
  )

  const onClickHandler = () => {
    analytics.send('mobilePromoBannerNotchInteraction', {
      eventAction: `global banner ${promoBannerIsHidden ? 'open' : 'close'}`,
      eventLabel: bannerRef.querySelector<HTMLElement>('.header-promo-banner li.is-active a')
        ?.textContent,
    })
    setPromoBannerIsHidden(!promoBannerIsHidden)
  }

  return (
    <Box sx={styles.promoBannerNotch}>
      <Box sx={stylesPromoBannerNotchLine}></Box>
      <Button data-qa="mb_btn_chevron_arrow" onClick={onClickHandler}>
        {promoBannerIsHidden ? <NavChevronDownIcon /> : <NavChevronUpIcon />}
      </Button>
    </Box>
  )
}
export default MobilePromoBannerNotch
