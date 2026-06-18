import { memo } from 'react'
import { AddToBagIcon } from 'toro/icons'
import { useRouter } from 'next/router'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import { useUpdateAtom } from 'jotai/utils'
import { setFlyoutConfigAtom } from 'store/flyout.atom'

const InsiderExclusiveButton = () => {
  const router = useRouter()
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const { wrapper, button, icon } = useMultiStyleConfig('QuickAddToBag', {
    variant: 'plpV3',
  })
  const { formatMessage } = useIntl()
  const insiderExclusiveText = formatMessage({
    id: 'plp.MemberExclusiveTextPLP',
    defaultMessage: 'Insiders Only',
  })

  const handleClick = () => {
    setFlyoutConfig({ type: 'login', options: { referrer: router.asPath } })
  }
  return (
    <Box align="center" sx={wrapper}>
      <Button variant="button" w="100%" sx={button} onClick={handleClick}>
        <AddToBagIcon {...icon} />
        <Text
          variant="primary"
          fontSize="var(--text-10)"
          lineHeight="var(--line-height-xl)"
          letterSpacing="0"
        >
          {insiderExclusiveText}
        </Text>
      </Button>
    </Box>
  )
}
export default memo(InsiderExclusiveButton)
