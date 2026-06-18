import React, { FC, ReactNode, useEffect } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import Portal from 'toro/components/Portal'
import { CloseIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import useStyles from 'toro/hooks/useStyles'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'

interface PayInInstallmentsPopUpProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const PayInInstallmentsPopUp: FC<PayInInstallmentsPopUpProps> = ({ isOpen, onClose, children }) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const title = formatMessage({
    id: 'pdp.payInInstallments.title',
    defaultMessage: 'Buy now, pay later',
  })
  const subtitle = formatMessage({
    id: 'pdp.payInInstallments.subtitle',
    defaultMessage: 'How it works?',
  })
  const description = formatMessage({
    id: 'pdp.payInInstallments.description',
    defaultMessage:
      'Select one of the following as your payment method at checkout to pay in interest-free installments:',
  })
  const disclaimer = formatMessage({
    id: 'pdp.payInInstallments.disclaimer',
    defaultMessage:
      'You must be over 18, a resident of the US, and meet the additional criteria to qualify. Late fees may apply. Loans to California residents made or arranged are pursuant to a California Finance Lenders Law License.',
  })

  useEffect(() => {
    if (isOpen) {
      toggleBodyScroll(false)
    } else {
      toggleBodyScroll(true)
    }

    return () => {
      toggleBodyScroll(true)
    }
  }, [isOpen])

  return (
    <Portal>
      <Box display={isOpen ? 'block' : 'none'}>
        <Box sx={styles.overlay} onClick={onClose}>
          <Box sx={styles.contentWrapper} onClick={(e) => e.stopPropagation()}>
            <Flex sx={styles.header}>
              <Text sx={styles.title}>{title}</Text>
              <Button
                variant="unstyled"
                onClick={onClose}
                sx={styles.closeButton}
                aria-label="Close"
                data-qa="Close_BNPL_drawer"
              >
                <CloseIcon width="32" height="32" />
              </Button>
            </Flex>
            <Box>
              <Text sx={styles.subtitle}>{subtitle}</Text>
              <Text sx={styles.description}>{description}</Text>
              <Flex sx={styles.widgetsContainer}>{children}</Flex>
              <Text sx={styles.disclaimer}>{disclaimer}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Portal>
  )
}

export default PayInInstallmentsPopUp
