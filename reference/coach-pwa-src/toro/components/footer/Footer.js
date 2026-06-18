import React, { useState, useEffect, useContext, useMemo } from 'react'
import MainContainer from 'toro/components/MainContainer'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import Divider from 'toro/components/Divider'
import useTheme from 'toro/hooks/useTheme'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import Box from 'toro/components/Box'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import CustomSlot from 'toro/cms/components/CustomSlot'
import PolicyLinks from 'toro/components/footer/PolicyLinks'
import ContentLinks from 'toro/components/footer/ContentLinks'
import SocialIcons from 'toro/components/footer/SocialIcons'
import FooterCopy from 'toro/components/footer/FooterCopy'
import StoreButtons from './StoreButtons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import EmailSignupForm from 'toro/components/footer/EmailSignupForm/EmailSignupForm'
import AboveEmailSignupText from 'toro/components/footer/EmailSignupText/AboveEmailSignupText'
import { useRouter } from 'next/router'
import PWAContext from 'components/common/PWAContext'
import PaymentLogos from 'toro/components/PaymentLogos'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { isSWOutletAtom, isFooterVisibleAtom } from 'store/global.atom'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import { useInView } from 'react-intersection-observer'

import ImageSubBrandFooter from '@tapestry-inc/design-tokens/coachtopia/icon/characters/big-eye-flower.svg'
import SearchWidget from 'toro/components/SearchWidget'

const Footer = () => {
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const setIsFooterVisible = useUpdateAtom(isFooterVisibleAtom)
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('FooterTheme')
  const theme = useTheme()
  const router = useRouter()
  const isGateRoute = router.pathname.includes('/sw-outlet-sale') || isSWOutlet
  const { appData } = useContext(PWAContext)
  const localeData = normalizeLocalizationContent(get(appData, 'locale'))
  const locale = get(localeData, 'locale')
  const footerData = get(appData, 'footer')
  const siteId = get(appData, 'siteId')
  const isReducedFooter = get(appData, 'isReducedHeaderAndFooter', false)

  const { ref: footerRef } = useInView({
    threshold: 0,
    rootMargin: '0px 0px -50px 0px', // Trigger slightly before footer is fully visible
    onChange: (inView) => {
      setIsFooterVisible(inView)
    },
  })

  const [isFooterSearchFieldEnabled, setIsFooterSearchFieldEnabled] = useState(false)
  const enableSearchSuggestionsCategoryObj = usePreference({
    groupId: 'SearchSuggestions',
    preferenceId: 'enableSearchSuggestionsOnCategoryFooter',
  })

  const isFooterEmailConsentEnabled = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'enableGDPRConsent',
    siteId,
  })

  const { customer360: { disableUserEmailOptIn = false } = {} } = usePreferenceNew({
    Customer360: ['disableUserEmailOptIn'],
  })
  const aboveEmailSignupText = get(footerData, 'contentSlots["emailSignupText"]', '')
  const toroCaEmailSignupText = get(
    footerData,
    'contentSlots["toro-ca-footer-emailssignuptext"]',
    ''
  )
  const isToroCaEmailSignupTextEnabled = toroCaEmailSignupText?.online?.default
  const {
    contentSlots: {
      ['footer-email-consent']: {
        online: termsAndConditionOnline = false,
        content: { isSignupTextWithCheckbox } = {
          isSignupTextWithCheckbox: false,
        },
      } = {},
    } = {},
  } = footerData || {}
  const isTermsAndConditionTextEnabled =
    isFooterEmailConsentEnabled && termsAndConditionOnline?.default

  useEffect(() => {
    if (enableSearchSuggestionsCategoryObj) {
      const enabledSiteValue = getSiteValueFromPref(enableSearchSuggestionsCategoryObj, siteId)
      const isShow =
        typeof enabledSiteValue !== 'undefined'
          ? enabledSiteValue
          : get(enableSearchSuggestionsCategoryObj, `value`)
      setIsFooterSearchFieldEnabled(isShow)
    }
  }, [enableSearchSuggestionsCategoryObj])

  const footerPolicyLinksData = useMemo(() =>
    get(footerData, 'contentSlots["toro-ca-footer-policy-links"]', [footerData])
  )
  const isPaymentLogosEnabledInFooter = !!get(footerPolicyLinksData, 'content.html', false)

  return (
    <>
      {isFooterSearchFieldEnabled && isDesktop && !isGateRoute && !isReducedFooter && (
        <Box
          maxWidth={theme.maxLayoutWidth}
          sx={styles.footerSearchWrapper}
          data-qa="ftr_search_wrapper"
          className="footer_search"
        >
          <SearchWidget variant={'footer'} siteId={siteId} />
        </Box>
      )}
      <footer
        ref={footerRef}
        id="footer"
        style={styles.footerWrapper}
        data-qa={isDesktop ? 'd_footer_row' : 'm_footer_row'}
      >
        <MainContainer sx={styles.footerMainContainer}>
          {!isReducedFooter && (
            <>
              <Grid
                templateColumns={{
                  md: 'repeat(8, 2fr)',
                  base: '1fr 1fr',
                }}
                gap={isDesktop ? '55px' : 0}
                w="100%"
                sx={styles.footerInnerPadding(isDesktop)}
              >
                {isDesktop && (
                  <GridItem colStart={1} colEnd={6}>
                    <CustomSlot
                      content={get(footerData, 'contentSlots["footer-content-link"]')}
                      Component={ContentLinks}
                      ignoreHidden
                    />
                  </GridItem>
                )}
                <GridItem
                  order={{ base: -1, md: 1 }}
                  colSpan={{ base: 2, md: 3 }}
                  sx={styles.signupFormFooterWrapper}
                  width={{ base: '100%' }}
                >
                  {!isGateRoute ? (
                    <>
                      {aboveEmailSignupText && (
                        <Box mb="12px" sx={styles.emailSignupText}>
                          <CustomSlot
                            content={aboveEmailSignupText}
                            Component={AboveEmailSignupText}
                          />
                        </Box>
                      )}
                      {!disableUserEmailOptIn && (
                        <EmailSignupForm
                          isToroCaEmailSignupTextEnabled={isToroCaEmailSignupTextEnabled}
                          isTermsAndConditionTextEnabled={isTermsAndConditionTextEnabled}
                          isSignupTextWithCheckbox={isSignupTextWithCheckbox}
                          isDesktop={isDesktop}
                          footerData={footerData}
                          locale={locale}
                        />
                      )}
                    </>
                  ) : null}
                  <CustomSlot
                    content={get(footerData, 'contentSlots["toro-ca-footer-social"]', [])}
                    Component={SocialIcons}
                  />
                  <CustomSlot
                    content={get(footerData, 'contentSlots["store-buttons"]', '')}
                    Component={StoreButtons}
                  />
                </GridItem>
              </Grid>
              <Divider sx={styles.footerDivider} />
            </>
          )}
          {isPaymentLogosEnabledInFooter && (
            <Box sx={styles.paymentLogos}>
              <CustomSlot content={footerPolicyLinksData} Component={PaymentLogos} />
            </Box>
          )}
          {!isReducedFooter && (
            <Box w="100%" sx={styles.footerPolicyLinks}>
              <CustomSlot content={footerPolicyLinksData} Component={PolicyLinks} />
            </Box>
          )}
          <Box w="100%">
            <CustomSlot
              sx={isReducedFooter ? styles.subBrandFooter : {}}
              content={get(
                footerData,
                isReducedFooter
                  ? 'contentSlots["toro-coachtopia-footer"]'
                  : 'contentSlots["toro-ca-footer-copy"]',
                ''
              )}
              Component={FooterCopy}
            />
            {isReducedFooter && (
              <svg width={0} height={0}>
                <ImageSubBrandFooter id="icon-footer-coachtopia" />
              </svg>
            )}
          </Box>
        </MainContainer>
      </footer>
    </>
  )
}

export default Footer
