import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import React from 'react'
import Text from 'toro/components/Text'
import { useRouter } from 'next/router'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import FallbackErrorButton from 'toro/components/product/FallbackErrorButton'
import PropTypes from 'prop-types'
import { LockIcon as Lock } from 'toro/icons'
import { useUpdateAtom } from 'jotai/utils'
import { setFlyoutConfigAtom } from 'store/flyout.atom'
import { TemplateName } from 'toro/constants/templates'
import useTemplate from 'toro/hooks/useTemplate'
import LockIconV6 from 'toro/icons/lock-v6.svg'

function SigninMemberButton({
  colors,
  isQuickView,
  productData,
  setModalOpen,
  variant,
  isPlpV3Desktop,
  ...props
}) {
  const styles = useMultiStyleConfig('SigninMemberButtonTheme', { variant })
  const { formatMessage } = useIntl()
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const router = useRouter()
  const dataPid = productData?.id
  const buttonProps = {
    variant: 'primary',
    color: colors?.main?.secondary,
    backgroundColor: colors?.main?.primary,
  }
  const analytics = useAnalytics()
  const showNewIcon = useTemplate([TemplateName.pdpv6, TemplateName.pdpv5_1])
  const handleClick = () => {
    analytics.send('productInteraction', {
      eventLocation: 'product',
      eventAction: 'membership exclusive',
      eventLabel: productData?.id,
    })

    analytics.send('modalImpression', {
      eventLocation: 'product',
      eventAction: 'sign in',
      modalTitle: 'sign in to your account',
    })

    setModalOpen?.(true)
    setFlyoutConfig({ type: 'login', options: { referrer: router.asPath } })
  }

  return (
    <Box
      className="memberWrapperExclusive"
      sx={styles.memberWrapper}
      flexGrow="1"
      data-qa="wrapper_mbr_exclsv_btn"
    >
      {isQuickView ? (
        <Text as="div" sx={styles.quickViewSignInTextStyle}>
          {formatMessage({
            id: 'pdp.product.viewProductDetailText',
            defaultMessage:
              'Click on ‘View Full Product Details’ below to sign up/sign in and purchase.',
          })}
        </Text>
      ) : (
        <Button
          {...buttonProps}
          sx={styles.signInBtnStyle}
          onClick={handleClick}
          size="lg"
          w="100%"
          data-pid={dataPid}
          {...props}
          id="sign-into-purchase"
          data-qa="membership_exclusive_cta"
        >
          <Box as="span" sx={styles.iconWrapper}>
            {showNewIcon ? <LockIconV6 width="24" height="24" /> : <Lock width="24" height="24" />}
          </Box>
          <Box as="span" sx={styles.signInText}>
            {isPlpV3Desktop
              ? formatMessage({
                  id: 'plp.product.signinToPurchaseBtnText',
                  defaultMessage: 'Insiders only - Please login',
                })
              : formatMessage({
                  id: 'pdp.product.signinToPurchaseBtnText',
                  defaultMessage: 'Sign in to purchase',
                })}
          </Box>
        </Button>
      )}
    </Box>
  )
}

SigninMemberButton.propTypes = {
  colors: PropTypes.object,
  isQuickView: PropTypes.bool,
  productData: PropTypes.object,
}

export default withErrorBoundaryWrapper(SigninMemberButton, {
  fallback: <FallbackErrorButton />,
})
