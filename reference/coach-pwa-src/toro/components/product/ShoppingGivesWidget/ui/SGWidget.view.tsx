import { useMemo } from 'react'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import Button from 'toro/components/Button'
import Experiment from 'toro/components/Experiment'
import Skeleton from 'toro/components/Skeleton'

import { EXPERIMENTS } from 'toro/constants/experiments'
import { CoachInsiderLogo } from 'toro/components/product/ShoppingGivesWidget/ui/CoachInsiderLogo'

export function SGWidgetView({
  styles,
  isLoggedIn,
  donationAmount,
  handleLoginClick,
  handleRegistrationClick,
  widgetChildRefHandler,
  formatMessage,
  isSGWReady,
  isCTASkeletonEnabled,
}) {
  const shoppingGivesBody = useMemo(
    () => getShoppingGivesBody({ isLoggedIn, formatMessage, donationAmount }),
    [isLoggedIn, donationAmount]
  )

  const { shoppingGivesTitle, selectCauseLabel, becomeInsiderLabel } = useMemo(
    () => ({
      shoppingGivesTitle: getShoppingGivesTitle({ isLoggedIn, formatMessage }),
      selectCauseLabel: getSelectCauseLabel({ isLoggedIn, formatMessage }),
      becomeInsiderLabel: getBecomeInsiderLabel({ isLoggedIn, formatMessage }),
    }),
    [isLoggedIn]
  )

  return (
    <Box ref={widgetChildRefHandler} sx={styles.shoppingGivesWidget}>
      <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
        <CoachInsiderLogo styles={styles.coachInsiderLogo} />
      </Experiment>

      <Box>
        <Text size="xs" variant="shopping-gives-bold" sx={styles.shoppingGivesTitle}>
          {shoppingGivesTitle}
        </Text>
        <Text size="xs" variant="shopping-gives" sx={styles.shoppingGivesBody}>
          {shoppingGivesBody}
        </Text>
      </Box>
      <Skeleton isLoaded={!isCTASkeletonEnabled} sx={{ animationIterationCount: 'infinite' }}>
        <Box lineHeight="16px" sx={styles.shoppingGivesButtonContainer}>
          <Button
            size="sm"
            variant="plain"
            sx={{
              ...styles.shoppingGivesButton,
              ...styles.shoppingGivesSelectSignInButton,
            }}
            // To not conflict with the dynamic widget click handler
            // After the dynamic widget is displayed, the button will be listening to the plugin's handler
            onClick={isSGWReady ? undefined : handleLoginClick}
          >
            {selectCauseLabel}
          </Button>

          <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
            <Text sx={styles.textDivider}>or</Text>
          </Experiment>

          <Button
            size="sm"
            variant="plain"
            sx={styles.shoppingGivesButton}
            // To not conflict with the dynamic widget click handler
            // After the dynamic widget is displayed, the button will be listening to the plugin's handler
            onClick={isSGWReady ? undefined : handleRegistrationClick}
          >
            {becomeInsiderLabel}
          </Button>
        </Box>
      </Skeleton>

      <Flex sx={styles.poweredByContainer}>
        <Image
          src="https://cdn-shoppinggives-prod.s3.amazonaws.com/image-assets/powered-by-black-small.svg"
          alt="Powered by Shopping Gives"
          ariaLabel="Powered by Shopping Gives"
          lazy={false}
        />
      </Flex>
    </Box>
  )
}

function getShoppingGivesTitle({ isLoggedIn, formatMessage }) {
  return isLoggedIn
    ? formatMessage({ id: 'pdp.shoppingGives.widget.title' })
    : formatMessage({
        id: 'pdp.shoppingGives.widget.guest.title',
        defaultMessage: 'Insiders Give Back',
      })
}

function getShoppingGivesBody({ isLoggedIn, formatMessage, donationAmount }) {
  return isLoggedIn
    ? formatMessage(
        { id: 'pdp.shoppingGives.widget.body' },
        { donationAmount: DonationAmountTemplate(donationAmount) }
      )
    : formatMessage(
        {
          id: 'pdp.shoppingGives.widget.guest.body',
          defaultMessage:
            'We’ll donate {donationAmount} of your purchase to the cause of your choice when you sign in or sign up for Coach Insider',
        },
        { donationAmount: DonationAmountTemplate(donationAmount) }
      )
}

function getSelectCauseLabel({ isLoggedIn, formatMessage }) {
  return isLoggedIn
    ? window?.sgCurrentlySelectedCause?.causeId
      ? formatMessage({
          id: 'pdp.shoppingGives.widget.updateCause',
          defaultMessage: 'Update Cause',
        })
      : formatMessage({ id: 'pdp.shoppingGives.widget.selectCause' })
    : formatMessage({
        id: 'pdp.shoppingGives.widget.signIn',
        defaultMessage: 'Sign In',
      })
}

function getBecomeInsiderLabel({ isLoggedIn, formatMessage }) {
  return isLoggedIn
    ? formatMessage({ id: 'pdp.shoppingGives.widget.learnMore' })
    : formatMessage({
        id: 'pdp.shoppingGives.widget.becomeInsider',
        defaultMessage: 'Become An Insider',
      })
}

function DonationAmountTemplate(donationValue: string) {
  return (
    <Text as="span" variant="shopping-gives-bold" size="xs">
      {donationValue}
    </Text>
  )
}
