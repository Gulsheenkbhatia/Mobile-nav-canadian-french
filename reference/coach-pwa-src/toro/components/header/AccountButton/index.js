import NavLink from 'toro/components/header/NavLink'
import React, { memo, useContext, useMemo } from 'react'
import get from 'lodash/get'
import SessionContext from 'toro/components/SessionContext'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import { ACCOUNT_LOGIN_URL, MY_ACCOUNT } from 'toro/constants/Urls'
import PWAContext from 'components/common/PWAContext'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import usePreference from 'toro/hooks/usePreference'
import { useIntl } from 'react-intl'
import { useUpdateAtom } from 'jotai/utils'
import { setFlyoutConfigAtom } from 'store/flyout.atom'
import { AccountIconV2 } from 'toro/icons'
import useExposedSearch from 'toro/hooks/useExposedSearch'

const AccountButton = ({ onClick, iconWidth = null }) => {
  const { appData } = useContext(PWAContext)
  const { session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const { isDesktop } = useViewportType()
  const { AccountIcon } = useMultiStyleConfig('Icons')
  const siteId = get(appData, 'siteId')
  const isCustomer = get(session, 'user.authType') === 'registered'
  const qalogInIcon = 'd_hdr_icon_signin'
  const qalogInLink = 'm_hdr_link_signin'
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const [accountUrl, loginUrl] = useLocaleUrl([MY_ACCOUNT, ACCOUNT_LOGIN_URL])
  const exposeMobileSearchBar = useExposedSearch()

  const accountIcon = exposeMobileSearchBar ? (
    <AccountIconV2 width={iconWidth} viewBox="0 0 160 120" transform="translate(0, 1)" />
  ) : (
    <AccountIcon />
  )

  const enableSignInFlyout = usePreference({
    groupId: 'navFlyoutStylings',
    preferenceId: 'enableSignInFlyout',
    siteId,
  })

  const accountIconRedirectUrlPref = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'accountIconRedirectUrl',
  })

  const accountIconRedirectUrl = useMemo(
    () =>
      getSiteValueFromPref(
        accountIconRedirectUrlPref,
        siteId,
        get(accountIconRedirectUrlPref, 'value')
      ),
    [accountIconRedirectUrlPref, siteId]
  )

  const accountRedirectUrl = useMemo(() => {
    if (!isCustomer) {
      if (enableSignInFlyout) return null
      return loginUrl
    }
    if (accountIconRedirectUrl) {
      return `/${accountIconRedirectUrl.toLowerCase()}`
    }
    return accountUrl
  }, [isCustomer, accountIconRedirectUrl, enableSignInFlyout])

  const onAccountClick = () => {
    if (enableSignInFlyout && !isCustomer) {
      setFlyoutConfig({ type: 'login' })
    }
    onClick(formatMessage({ id: 'header.navigation.AccountAriaLabel', defaultMessage: 'Account' }))
  }

  return (
    <NavLink
      handleClick={onAccountClick}
      ariaLabel={formatMessage({
        id: 'header.navigation.AccountAriaLabel',
        defaultMessage: 'Account',
      })}
      icon={accountIcon}
      url={accountRedirectUrl}
      qaLink={isDesktop ? qalogInIcon : qalogInLink}
      tooltipText={
        isCustomer
          ? formatMessage({ id: 'header.navigation.myAccount', defaultMessage: 'My account' })
          : formatMessage({ id: 'header.navigation.login', defaultMessage: 'Login' })
      }
      sx={{
        ml: isDesktop ? null : '40px',
        svg: {
          pointerEvents: 'none',
        },
      }}
    />
  )
}

export default memo(AccountButton)
