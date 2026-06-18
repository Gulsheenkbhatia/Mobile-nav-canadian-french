import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ACCOUNT_LOGIN_URL, MY_ACCOUNT } from 'toro/constants/Urls'
import PWAContext from 'components/common/PWAContext'
import Box from 'toro/components/Box'
import NavLink from 'toro/components/header/NavLink'
import ChatIcon from '@tapestry-inc/design-tokens/coach/icon/object/chat.svg'
import get from 'lodash/get'
import { LANGUAGE_FLAG_ICONS } from 'toro/constants/ContentFlag'
import SessionContext from 'toro/components/SessionContext'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import isArray from 'lodash/isArray'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useIntl } from 'react-intl'
import { useMultiStyleConfig } from '@chakra-ui/react'
import modifyMedalliaLink from 'toro/helpers/modifyMedalliaLink'
import Cookies from 'js-cookie'
import { QUANTUM_METRIC_SESSION_ID } from 'toro/constants/cookies'

const CountrySelectorMobileNavLink = dynamic(
  () =>
    import(
      'toro/components/LanguageSelector/ModalBasedCountrySelector/CountrySelectorMobileNavLink'
    ),
  { ssr: false }
)

const ICONS_ATTRS_OBJ = (selectedFlag) => {
  const { WishlistIcon, StoresIcon } = useMultiStyleConfig('Icons')
  return {
    m_hdr_txt_cs_label: {
      icon: LANGUAGE_FLAG_ICONS[selectedFlag],
      qaAttr: 'm_hdr_txt_cs_label',
    },
    Chat: {
      icon: <ChatIcon />,
    },
    m_ftr_link_feedback: {
      icon: <ChatIcon />,
    },
    m_hdr_icon_sfl: {
      icon: <WishlistIcon />,
      qaAttr: 'm_hdr_icon_sfl',
    },
    m_hdr_link_storelocator: {
      icon: <StoresIcon />,
      qaAttr: 'm_hdr_link_storelocator',
    },
  }
}

const MobileMenuNavLink = ({ children, order }) => {
  return (
    <Box py="mar" sx={order ? { order } : {}}>
      {children}
    </Box>
  )
}

const MobileMenuNavLinks = ({ links, dataQA }) => {
  const { viewport } = useViewportType()
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const [showHeaderCountrySelector, setHeaderCountrySelector] = useState()
  const { appData } = useContext(PWAContext)
  const { session } = useContext(SessionContext)
  const qaSignInLink = 'm_hdr_link_signin'
  const isCustomer = get(session, 'user.authType') === 'registered'
  const siteId = get(appData, 'siteId')
  const countrySelector = get(appData, 'header.countrySelector')
  const selectedFlag = get(appData, 'header.countrySelector.selector.flag', '')
  const linkIconAttrObj = ICONS_ATTRS_OBJ(selectedFlag)
  const { AccountIcon } = useMultiStyleConfig('Icons')

  const configurableHeader = usePreference({
    groupId: 'Storefront Configs',
    preferenceId: 'configurableHeader',
  })
  const {
    storefrontConfigs: {
      countrySelectorPopUpROW: {
        enable: popupBasedCountrySelectorEnabled = false,
        showPopupToNewVistorOnLanding = false,
      } = {},
    },
  } = usePreferenceNew({
    'Storefront Configs': ['countrySelectorPopUpROW'],
  })
  const changeNavDrawerContentLinkPositionPref = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'changeNavDrawerContentLinkPosition',
  })
  const changeNavDrawerContentLinkPositionPrefValue = getSiteValueFromPref(
    changeNavDrawerContentLinkPositionPref,
    siteId,
    false
  )

  const onNavClick = useCallback(
    ({ text }) =>
      () => {
        analytics.send('navClick', {
          eventLocation: 'utility',
          text: text,
        })
      },
    [analytics]
  )

  const onAccountClick = useCallback(
    () =>
      onNavClick({
        text: isCustomer
          ? formatMessage({ id: 'header.navigation.myAccount', defaultMessage: 'My account' })
          : formatMessage({ id: 'header.navigation.login', defaultMessage: 'Log In' }),
      }),
    [isCustomer]
  )

  const configurableHeaderValue = getSiteValueFromPref(
    configurableHeader,
    siteId,
    get(configurableHeader, 'value')
  )

  const viewPortSets = useMemo(() => configurableHeaderValue?.left[viewport], [viewport])

  useEffect(() => {
    if (viewPortSets) {
      setHeaderCountrySelector(viewPortSets.some((item) => item?.id === 'header-country-selector'))
    }
  }, [viewport, viewPortSets])

  const regex = /CountrySelector-InternationalCountrySelector/g

  const showHeaderStoreLocator = viewPortSets?.find((item) => item?.id === 'store-locator')

  const handleMedalliaClick =
    ({ text, href }) =>
    (event) => {
      event.stopPropagation()
      event.preventDefault()
      try {
        const quantumMetricSessionId = Cookies.get(QUANTUM_METRIC_SESSION_ID)
        const medalliaUrl = new URL(href)
        if (quantumMetricSessionId) {
          medalliaUrl.searchParams.set('QMID', quantumMetricSessionId)
        }
        window.open(medalliaUrl.href, '_blank')
      } catch (e) {
        console.error('Cant edit medallia url', e?.message)
      } finally {
        onNavClick({ text })
      }
    }
  const filteredLinks = useMemo(() => {
    if (!isArray(links)) {
      return []
    }
    if (!showHeaderCountrySelector) {
      return links.filter((link) => !regex.test(link?.href))
    }
    return modifyMedalliaLink(handleMedalliaClick, links)
  }, [links, showHeaderCountrySelector])

  const filteredNavLinksElements = useMemo(() => {
    if (!filteredLinks) return null

    return filteredLinks?.map((item, idx) => {
      if (item?.id === 'm_hdr_link_storelocator' && !showHeaderStoreLocator) return null
      const navLinkKey = `nav-links-${idx}`
      const navLinkProps = {
        variant: 'mobileMenu',
        text: item.text,
        icon: get(linkIconAttrObj, `[${item?.id}].icon`),
        qaLink: linkIconAttrObj[item?.id]?.qaAttr,
        dataQA: dataQA,
      }

      if (popupBasedCountrySelectorEnabled && item?.id === 'm_hdr_txt_cs_label') {
        return (
          <MobileMenuNavLink key={navLinkKey} order={item?.order}>
            <CountrySelectorMobileNavLink
              {...navLinkProps}
              content={countrySelector}
              showPopupToNewVistorOnLanding={showPopupToNewVistorOnLanding}
            />
          </MobileMenuNavLink>
        )
      }
      return (
        <MobileMenuNavLink key={navLinkKey} order={item?.order}>
          <NavLink
            {...navLinkProps}
            handleClick={get(item, 'onClick', onNavClick)({ text: item.text, href: item.href })}
            url={item.href}
          />
        </MobileMenuNavLink>
      )
    })
  }, [
    filteredLinks,
    showHeaderStoreLocator,
    linkIconAttrObj,
    popupBasedCountrySelectorEnabled,
    countrySelector,
    dataQA,
    onNavClick,
  ])

  return (
    <Box
      mb={changeNavDrawerContentLinkPositionPrefValue ? 100 : 0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MobileMenuNavLink>
        <NavLink
          handleClick={onAccountClick}
          variant="mobileMenu"
          icon={<AccountIcon />}
          text={
            isCustomer
              ? formatMessage({ id: 'header.navigation.myAccount', defaultMessage: 'My account' })
              : formatMessage({ id: 'header.navigation.login', defaultMessage: 'Log In' })
          }
          url={isCustomer ? MY_ACCOUNT : ACCOUNT_LOGIN_URL}
          qaLink={qaSignInLink}
        />
      </MobileMenuNavLink>
      {filteredNavLinksElements}
    </Box>
  )
}

export default withErrorBoundaryWrapper(MobileMenuNavLinks)
