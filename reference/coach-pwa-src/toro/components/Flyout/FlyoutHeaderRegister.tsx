import React from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import { useUpdateAtom } from 'jotai/utils'
import { setFlyoutConfigAtom } from 'store/flyout.atom'

export default function FlyoutHeaderRegister({ drawerHeader, drawerBody }) {
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)

  const handleLoginClick = (e) => {
    const url = e.target.getAttribute('data-action-url') || e.target.getAttribute('data-url')
    const tokens = url.split('?')
    const searchParams = new URLSearchParams(tokens[1])
    const options = {}
    searchParams.forEach((val, key) => {
      options[key] = val
    })
    setFlyoutConfig({ type: 'login', options })
  }

  return (
    <Box mt="xxl">
      <Flex {...drawerBody?.buttonLogin?.parent?.attribs} alignItems="baseline">
        <Text variant="body-primary" size="md">
          {drawerBody?.buttonLogin?.parent?.text}&nbsp;
        </Text>
        <Button
          {...drawerBody?.buttonLogin?.button?.attribs}
          variant="plain"
          size="md"
          p="0"
          h="auto"
          onClick={handleLoginClick}
        >
          {drawerBody?.buttonLogin?.button?.text}
        </Button>
      </Flex>
      <Text size="sm" letterSpacing="1px" mt="l" mb="m">
        {drawerHeader?.text}
      </Text>
    </Box>
  )
}
