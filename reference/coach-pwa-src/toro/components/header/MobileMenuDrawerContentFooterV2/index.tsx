import React, { useContext, useCallback, useMemo, memo, useEffect, useRef } from 'react'
import { SystemStyleObject } from '@chakra-ui/react'
import Flex from 'toro/components/Flex'
import NavLink from 'toro/components/header/NavLink'
import PWAContext from 'components/common/PWAContext'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import { ACCOUNT_LOGIN_URL, MY_ACCOUNT } from 'toro/constants/Urls'
import { LANGUAGE_FLAG_ICONS } from 'toro/constants/ContentFlag'
import {
  AccountIconV2,
  StoreIconV2,
  ContactUsIconV2,
  WishlistIconV2,
  FeedbackIcon,
  PackageIconV2,
} from 'toro/icons'
import { useAtomValue } from 'jotai/utils'
import { isSearchInDrawerActiveAtom } from 'store/search.atom'
import usePreference from 'toro/hooks/usePreference_new'
interface Props {
  styles?: Record<string, SystemStyleObject>
  onMount?: (footer: HTMLDivElement) => void
  /** Coach US FY26 nav drawer: wrap utility links with updated spacing. */
  isFY26Drawer?: boolean
}

const getLinkIconAttrObj = (selectedFlag) => {
  return {
    'icon-login': {
      icon: <AccountIconV2 />,
      qaAttr: 'm_hdr_link_signin',
    },
    'icon-my-account': {
      icon: <AccountIconV2 />,
      qaAttr: 'm_hdr_link_signin',
    },
    'icon-country': {
      icon: LANGUAGE_FLAG_ICONS[selectedFlag],
      qaAttr: 'm_hdr_txt_cs_label',
    },
    'icon-store-locator': {
      icon: <StoreIconV2 />,
      qaAttr: 'm_hdr_link_storelocator',
    },
    'icon-wishlist': {
      icon: <WishlistIconV2 />,
      qaAttr: 'm_hdr_icon_sfl',
    },
    'icon-contact-us': {
      icon: <ContactUsIconV2 />,
      qaAttr: 'm_hdr_link_contactUs',
    },
    'icon-feedback': {
      icon: <FeedbackIcon />,
      qaAttr: 'm_hdr_link_feedback',
    },
    'icon-track-order': {
      icon: <PackageIconV2 />,
      qaAttr: 'm_hdr_link_trackOrder',
    },
  }
}
const accountIds = ['icon-login', 'icon-my-account']
const countryLabel = 'm_hdr_txt_cs_label'
const handleLinkItem = (item) => {
  if (item.id === countryLabel) {
    const result = item.text.match(/\(([^)]+)\)/)
    if (result?.length) {
      return { ...item, text: result[1] }
    }
  }
  return item
}

const MobileMenuDrawerContentFooterV2 = ({ onMount, styles, isFY26Drawer = false }: Props) => {
  const {
    appData: { footer: footerData, header },
  } = useContext(PWAContext)
  const { session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const isCustomer = get(session, 'user.authType') === 'registered'
  const links = get(footerData, 'contentSlots["nav-element-content-area"]content.links', [])
  const flag = get(header, 'countrySelector.selector.flag', '')
  const linkIconAttrObj = useMemo(() => getLinkIconAttrObj(flag), [flag])
  const footerElementRef = useRef<HTMLDivElement>(null)
  const isSearchInDrawerActive = useAtomValue(isSearchInDrawerActiveAtom)
  const {
    xgenPreferences: { searchV2Features },
  } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })
  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)

  const onNavClick =
    ({ text }) =>
    () => {
      analytics.send('navClick', {
        eventLocation: 'utility',
        text: text,
      })
    }

  const accountText = useMemo(
    () =>
      isCustomer
        ? formatMessage({ id: 'header.navigation.myAccount', defaultMessage: 'My account' })
        : formatMessage({ id: 'header.navigation.login', defaultMessage: 'Log In' }),
    [isCustomer]
  )

  const onAccountClick = useCallback(
    () =>
      onNavClick({
        text: accountText,
      })(),
    [isCustomer]
  )

  // Prepare navigation links using only the links referenced in linkIconAttrObj and handle country text
  const navLinks = useMemo(() => {
    return links.map((item) => {
      if (linkIconAttrObj[item?.id]) {
        return handleLinkItem(item)
      }
      return item
    })
  }, [links])

  useEffect(() => {
    onMount?.(footerElementRef.current)
  }, [])

  if (isSearchInDrawerActive && searchOverlayRedesign) {
    return null
  }

  return (
    <Flex
      ref={footerElementRef}
      id="mobile-menu-drawer-footer-v2"
      sx={{
        ...styles.menuFooterLinks,
        ...(isFY26Drawer ? styles.footerFY26 : {}),
      }}
    >
      <>
        {navLinks?.map((item, idx) => {
          const { id, iconId, text, href } = item
          const isAccountEl = accountIds.includes(item.iconId)
          return (
            <NavLink
              sx={
                id !== countryLabel
                  ? {
                      ...styles.navLinkSVG,
                      ...styles.navLink,
                      ...(isFY26Drawer ? styles.footerFY26Link : {}),
                    }
                  : {
                      ...styles.navLink,
                      ...styles.countryLabelStyle,
                      ...(isFY26Drawer ? styles.footerFY26Link : {}),
                    }
              }
              key={`nav-links-${idx}`}
              handleClick={
                isAccountEl ? onAccountClick : get(item, 'onClick', onNavClick)({ text, href })
              }
              variant="mobileMenuV2"
              text={isAccountEl ? accountText : text}
              icon={get(linkIconAttrObj, `[${iconId}].icon`)}
              url={isAccountEl ? (isCustomer ? MY_ACCOUNT : ACCOUNT_LOGIN_URL) : href}
              qaLink={linkIconAttrObj[iconId]?.qaAttr}
            />
          )
        })}
      </>
    </Flex>
  )
}

export default memo(MobileMenuDrawerContentFooterV2)
