import React, { FC } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import { BopisArrowRightIcon, EnterIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import useStyles from 'toro/hooks/useStyles'
import Skeleton from 'toro/components/Skeleton'

interface PayInInstallmentsButtonProps {
  onClick: () => void
  isLoading: boolean
  minInstallmentPrice: string | null
}

const PayInInstallmentsButton: FC<PayInInstallmentsButtonProps> = ({
  onClick,
  isLoading,
  minInstallmentPrice,
}) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const mainText = formatMessage({
    id: 'pdp.payInInstallments.button.mainText',
    defaultMessage: 'Buy now, pay later',
  })
  const subText = formatMessage(
    {
      id: 'pdp.payInInstallments.button.subText',
      defaultMessage: 'As low as {minInstallmentPrice} in installments',
    },
    { minInstallmentPrice }
  )
  const learnMoreText = formatMessage({
    id: 'pdp.payInInstallments.button.learnMoreText',
    defaultMessage: 'Learn more',
  })

  return (
    <Flex sx={styles.buttonContainer} data-qa="BNPL_Section">
      <Flex>
        <Flex sx={styles.iconWrapper}>
          <EnterIcon width="24" height="24" />
        </Flex>
        <Box>
          <Text sx={styles.buttonMainText}>{mainText}</Text>
          {isLoading ? (
            <Skeleton h="12.5px" w="175px" />
          ) : (
            <Text sx={styles.buttonSubText}>{subText}</Text>
          )}
        </Box>
      </Flex>
      <Flex sx={styles.learnMoreWrapper} onClick={onClick} role="button">
        <Text sx={styles.learnMoreText} data-qa="BNPL_Learn_More_CTA">
          {learnMoreText}
        </Text>
        <BopisArrowRightIcon width="14" height="14" />
      </Flex>
    </Flex>
  )
}

export default PayInInstallmentsButton
