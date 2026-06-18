import React, { useMemo, useContext, Fragment } from 'react'
import Link from 'toro/components/Link'
import Box from 'toro/components/Box'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import usePreference from 'toro/hooks/usePreference'
import useViewportType from 'toro/hooks/useViewportType'
import PWAContext from 'components/common/PWAContext'
import { useAtomValue } from 'jotai/utils'
import { isSWOutletAtom, isSubBrandActiveAtom } from 'store/global.atom'

import KsSurLogo from '@tapestry-inc/design-tokens/kate-spade/logo/ks-outlet-logo-black.svg'
import SwOutletLogo from '@tapestry-inc/design-tokens/stuart-weitzman/logo/primary-black-outlet.svg'
import SubBrandLogo from 'sub-theme-tokens/logo/primary-black.svg'
import defaultLogo from 'design-tokens/logo/primary-black.svg'
import { rootCategoryAtom } from 'store/search-results.atom'
import usePathnameMatch from 'toro/hooks/usePathnameMatch'
import useOneCoachTabConfig from 'toro/hooks/useOneCoachTabConfig'
import { isOneCoachInOutletCategoryAtom } from 'store/menu-data.atom'
function getBrandLogo(
  siteName,
  isSWOutlet,
  isOutletGatePage,
  isSubBrandActive,
  brand,
  subBrand,
  isOneCoachInOutletCategory,
  ImageOutlet
) {
  let currentBrand = brand
  if (siteName === 'stuart-site' && (isSWOutlet || isOutletGatePage)) {
    currentBrand = 'sw-outlet'
  } else if (siteName === 'stuart-site' || siteName === 'ksna-surprise') {
    currentBrand = siteName
  } else if (isSubBrandActive) {
    currentBrand = subBrand
  } else if (isOneCoachInOutletCategory) {
    currentBrand = 'outlet'
  }

  switch (currentBrand) {
    case 'ksna-surprise':
      return KsSurLogo
    case 'sw-outlet':
      return SwOutletLogo
    case 'coachtopia':
      return SubBrandLogo
    case 'outlet':
      return ImageOutlet
    default:
      return defaultLogo
  }
}

function getHref(
  siteName,
  rootCategory,
  isOutletCategoryLogo,
  isSubBrandActive,
  subBrandHomeURL,
  utmLink,
  isOneCoachInOutletCategory
) {
  if (siteName === 'stuart-site' && rootCategory === 'outlet' && isOutletCategoryLogo) {
    return '/sw-outlet-sale'
  }

  if (isSubBrandActive) {
    return subBrandHomeURL
  }

  if (isOneCoachInOutletCategory && utmLink) {
    return utmLink
  }

  return '/'
}

const Logo = () => {
  const { appData } = useContext(PWAContext)
  const rootCategory = useAtomValue(rootCategoryAtom)
  const isOutletGatePage = usePathnameMatch(/sw-outlet-sale-login/)
  const isSWOutlet = useAtomValue(isSWOutletAtom)

  const logoRootCategory = useMemo(
    () => (isOutletGatePage ? 'outlet-gate-page' : rootCategory),
    [rootCategory, isOutletGatePage]
  )
  const styles = useMultiStyleConfig('Logo')
  const { ImageOutlet } = styles
  const siteIdentifier = usePreference({
    groupId: 'generalConfiguration',
    preferenceId: 'siteIdentifier',
  })
  const isOutletCategoryLogoPref = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'isOutletCategoryLogo',
  })
  const subBrandHomeURL = usePreference({
    groupId: 'coachtopia',
    preferenceId: 'coachtopiaHomeURL',
    defaultValue: appData.subBrand ? `/shop/${appData.subBrand}` : '/',
  })?.value
  const { utmLink } = useOneCoachTabConfig()
  const siteName = get(siteIdentifier, 'value')
  const isOutletCategoryLogo = get(isOutletCategoryLogoPref, 'value', true)
  const isReducedHeader = get(appData, 'isReducedHeaderAndFooter', false)
  const isOneCoachInOutletCategory = useAtomValue(isOneCoachInOutletCategoryAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const BrandLogo = useMemo(
    () =>
      getBrandLogo(
        siteName,
        isSWOutlet,
        isOutletGatePage,
        isSubBrandActive,
        appData?.brand,
        appData?.subBrand,
        isOneCoachInOutletCategory,
        ImageOutlet
      ),
    [
      siteName,
      isSWOutlet,
      isOutletGatePage,
      isSubBrandActive,
      appData?.brand,
      appData?.subBrand,
      isOneCoachInOutletCategory,
      ImageOutlet,
    ]
  )

  const href = useMemo(
    () =>
      getHref(
        siteName,
        logoRootCategory,
        isOutletCategoryLogo,
        isSubBrandActive,
        subBrandHomeURL,
        utmLink,
        isOneCoachInOutletCategory
      ),
    [
      siteName,
      logoRootCategory,
      isOutletCategoryLogo,
      isSubBrandActive,
      subBrandHomeURL,
      utmLink,
      isOneCoachInOutletCategory,
    ]
  )

  const analytics = useAnalytics()
  const { formatMessage } = useIntl()

  const { isMobile } = useViewportType()

  const brandLogoAttributes = useMemo(
    () =>
      styles.brandLogo({
        isMobile,
        isSWOutlet: logoRootCategory?.includes('outlet'),
        isSubBrandActive,
        isReducedHeader,
        isOneCoachInOutletCategory,
      }),
    [isMobile, logoRootCategory, isReducedHeader, isSubBrandActive, isOneCoachInOutletCategory]
  )

  const LogoLink = isSubBrandActive && isReducedHeader ? Fragment : Link

  const onClick = () => {
    analytics.send('navClick', {
      eventLocation: 'utility',
      text: formatMessage({ id: 'header.logo.text' }),
    })
  }

  const coachtopiaLogoQA = useMemo(() => {
    if (isSubBrandActive) {
      return isMobile ? 'm_logo_coachtopia' : 'd_logo_coachtopia'
    }
  }, [isSubBrandActive, isMobile])

  return (
    <Box
      sx={{
        ...styles.logoWrapper({
          isOutletGatePage,
          isSWOutlet,
          isOneCoachInOutletCategory,
        }),
      }}
      data-qa={coachtopiaLogoQA}
    >
      <LogoLink
        aria-label={
          isOneCoachInOutletCategory
            ? `${appData?.brand?.replace(/-/g, ' ')} outlet logo`
            : formatMessage({
                id: 'header.logo.ariaLabel',
                defaultMessage: `${appData?.brand} Logo`,
              })
        }
        href={href}
        to={href}
        data-qa="hdr_link_global_logo"
        onClick={onClick}
        prefetch
        prefetchUrl="/api"
      >
        <BrandLogo className="logo" {...brandLogoAttributes} />
      </LogoLink>
    </Box>
  )
}

export default withErrorBoundaryWrapper(Logo)
