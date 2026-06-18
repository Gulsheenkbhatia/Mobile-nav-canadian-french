import { useCallback } from 'react'
import { useAtomValue, useUpdateAtom, useResetAtom } from 'jotai/utils'
import Tabs from 'toro/components/Tabs'
import TabList from 'toro/components/TabList'
import Tab from 'toro/components/Tab'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withOneSite from 'toro/hocs/withOneSite'
import { activeMobileMenuBrandAtom, activeMobileMenuBrandBaseAtom } from 'store/menu-data.atom'
import ImageRetail from '@tapestry-inc/design-tokens/coach/logo/primary-black.svg'
import ImageOutlet from '@tapestry-inc/design-tokens/coach-outlet/logo/primary-black.svg'
import CloseMenuIcon from '@tapestry-inc/design-tokens/coach/icon/utility/m-close-white.svg'
import { BRANDS } from 'lib/oneSite/config'

type MobileMenuTabsProps = {
  onClose: () => void
}

const MobileMenuTabs = ({ onClose }: MobileMenuTabsProps) => {
  const analytics = useAnalytics()
  const activeMobileMenuBrand = useAtomValue(activeMobileMenuBrandAtom)
  const setActiveMobileMenuBrand = useUpdateAtom(activeMobileMenuBrandAtom)
  const resetActiveMobileMenuBrand = useResetAtom(activeMobileMenuBrandBaseAtom)

  const handleCloseMenu = () => {
    onClose()
    resetActiveMobileMenuBrand()
  }

  const styles = useMultiStyleConfig('MobileMenuTabs')

  const handleTabClick = useCallback(
    (index: number) => {
      const brand = index === 0 ? BRANDS.COACH : BRANDS.OUTLET
      const analyticsText = index === 0 ? BRANDS.COACH : `coach ${BRANDS.OUTLET}`

      setActiveMobileMenuBrand(brand)

      analytics.send('navClick', {
        eventLocation: 'hamburger menu tab',
        text: analyticsText,
      })
    },
    [setActiveMobileMenuBrand, analytics]
  )

  const isCoachTabActive = activeMobileMenuBrand === BRANDS.COACH
  const isOutletTabActive = activeMobileMenuBrand === BRANDS.OUTLET
  const tabIndex = isCoachTabActive ? 0 : isOutletTabActive ? 1 : -1

  return (
    <Flex sx={styles.container}>
      <Tabs index={tabIndex} onChange={handleTabClick} data-qa="mobile_menu_tabs">
        <TabList sx={styles.tabs}>
          <Tab
            sx={styles.buttonProps}
            data-qa="mobile_menu_tab_retail"
            className={isCoachTabActive ? 'active' : ''}
          >
            <ImageRetail {...styles.logoPropsRetail} />
          </Tab>
          <Tab
            sx={styles.buttonProps}
            data-qa="mobile_menu_tab_outlet"
            className={isOutletTabActive ? 'active' : ''}
          >
            <ImageOutlet {...styles.logoPropsOutlet} />
          </Tab>
        </TabList>
      </Tabs>
      <Button
        variant="unstyled"
        onClick={handleCloseMenu}
        data-qa="m_btn_hamburger_close_x"
        sx={styles.closeButton}
      >
        <CloseMenuIcon aria-hidden width="24px" height="24px" />
      </Button>
    </Flex>
  )
}

export default withOneSite(MobileMenuTabs)
