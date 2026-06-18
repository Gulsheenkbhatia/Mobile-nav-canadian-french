import { STORES_URL } from 'toro/constants/Urls'
import NavLink from 'toro/components/header/NavLink'
import React, { memo, useContext, useMemo } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'

const StoresButton = ({ onClick }) => {
  const { appData } = useContext(PWAContext)
  const { formatMessage } = useIntl()
  const { isDesktop } = useViewportType()
  const { StoresIcon } = useMultiStyleConfig('Icons')
  const qaStoreLink = 'm_hdr_link_storelocator'
  const qaStoreLabel = 'd_hdr_label_storelocation'
  const footerData = get(appData, 'footer')
  const footerContentSlotLinks = get(
    footerData,
    'contentSlots["nav-element-content-area"].content.links',
    []
  )
  const storeLocatorHref = footerContentSlotLinks?.find((item) => item?.id === qaStoreLink)?.href

  const currentLocale = useMemo(() => {
    const currentLocaleData = getCurrentLocale(appData?.locale)
    return currentLocaleData.locale.replace('-', '_')
  }, [appData?.locale])

  const { storeLocatorUrl } = usePreference({
    storeLocatorURL: ['store_url'],
  })

  const { [currentLocale]: yextUrl } = storeLocatorUrl?.store_url || {}

  const navLinkText = formatMessage({ id: 'header.navigation.stores', defaultMessage: 'Stores' })
  return (
    <NavLink
      ariaLabel="Stores"
      handleClick={onClick}
      icon={<StoresIcon pointerEvents="none" />}
      text={isDesktop && navLinkText}
      tooltipText={navLinkText}
      url={yextUrl || storeLocatorHref || STORES_URL}
      qaLink={qaStoreLink}
      qaLabel={qaStoreLabel}
      variant={!isDesktop ? 'mobileHeader' : undefined}
      sx={{ ml: isDesktop ? null : '40px' }}
    />
  )
}

export default memo(StoresButton)
