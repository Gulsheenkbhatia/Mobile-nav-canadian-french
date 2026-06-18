import { useMemo, FC, useContext, memo } from 'react'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import Flex from 'toro/components/Flex'
import OriginalHidden from 'toro/components/Hidden'
import PWAContext from 'components/common/PWAContext'
import HeaderTabs from 'toro/components/header/Tabs'
import Logo from 'toro/components/header/Logo/Logo'
import { HeaderLeftContentProps } from 'toro/components/header/HeaderMainContent/types'

import MobileMenuButton from 'toro/components/header/MobileMenuButton'
import LanguageSelector from 'toro/components/LanguageSelector/LanguageSelector'
import LiveStreamBadge from 'toro/components/LiveStreamBadge/LiveStreamBadge'
import AccountButton from 'toro/components/header/AccountButton'
import StoresButton from 'toro/components/header/StoresButton'
import Skeleton from 'toro/components/Skeleton'
import { useAtomValue } from 'jotai/utils'
import { countrySelectorAtom } from 'store/menu-data.atom'

const CountrySelectorLoader = () => <Skeleton height="24px" width="68px"></Skeleton>
const ModalBasedCountrySelector = dynamic(
  () => import('toro/components/LanguageSelector/ModalBasedCountrySelector'),
  { ssr: false, loading: CountrySelectorLoader }
)

const Hidden = (props) => <OriginalHidden isFragment {...props} />

const HeaderLeftContent: FC<HeaderLeftContentProps> = ({
  styles,
  isOutlet,
  onClick,
  onStoresClick,
  isStoreReplace,
  enableNewGlobalHeader,
  exposeMobileSearchBar,
  initializeSearchState,
}) => {
  const { viewport } = useViewportType()
  const { appData } = useContext(PWAContext)

  const {
    storefrontConfigs: {
      configurableHeader = {},
      localeBasedCountrySelectorEnabled: isLanguageSelectorDisabled = false,
      countrySelectorPopUpROW: {
        enable: popupBasedCountrySelectorEnabled = false,
        showPopupToNewVistorOnLanding = false,
      } = {},
    },
  } = usePreference({
    'Storefront Configs': [
      'localeBasedCountrySelectorEnabled',
      'configurableHeader',
      'countrySelectorPopUpROW',
    ],
  })

  const countrySelector = useAtomValue(countrySelectorAtom)
  const liveEventConfig = get(appData, 'liveStreamingData', {})
  const showAccountMobileHeader = get(appData, 'showAccountMobileHeader')
  const isTabHeaderVisible = get(appData, 'isTabHeaderVisible', false)

  const { showHeaderCountrySelector, showHeaderStoreLocator } = useMemo(() => {
    const viewPortSets = get(configurableHeader, `left.${viewport}`, [])

    const showHeaderCountrySelector =
      Array.isArray(viewPortSets) &&
      viewPortSets.some((item) => item.id === 'header-country-selector')

    const showHeaderStoreLocator =
      Array.isArray(viewPortSets) && viewPortSets.some((item) => item?.id === 'store-locator')

    return { showHeaderCountrySelector, showHeaderStoreLocator }
  }, [viewport, configurableHeader])

  const classicMobileMenu = useMemo(
    () => (
      <>
        <MobileMenuButton onMenuButtonClick={initializeSearchState} />

        {(isOutlet && showAccountMobileHeader) || isStoreReplace
          ? !exposeMobileSearchBar && <AccountButton onClick={onClick} />
          : showHeaderStoreLocator && <StoresButton onClick={onStoresClick} />}
      </>
    ),
    [isOutlet, isStoreReplace, showHeaderStoreLocator, initializeSearchState, exposeMobileSearchBar]
  )

  return (
    <Flex
      flex="1"
      justifyContent="flex-start"
      height="32px"
      className="storelocator"
      alignItems="center"
      position="relative"
    >
      <Hidden onNonMobile>
        {!enableNewGlobalHeader ? (
          classicMobileMenu
        ) : (
          <>{isTabHeaderVisible ? <HeaderTabs /> : <Logo sx={styles.logoContainer} />}</>
        )}
      </Hidden>

      <Hidden onMobile>
        {!isLanguageSelectorDisabled &&
          showHeaderCountrySelector &&
          (popupBasedCountrySelectorEnabled ? (
            <ModalBasedCountrySelector
              content={countrySelector}
              showPopupToNewVistorOnLanding={showPopupToNewVistorOnLanding}
            />
          ) : (
            <LanguageSelector content={countrySelector} />
          ))}
        {showHeaderStoreLocator && <StoresButton onClick={onStoresClick} />}
        <LiveStreamBadge config={liveEventConfig} />
      </Hidden>
    </Flex>
  )
}

export default memo(HeaderLeftContent)
