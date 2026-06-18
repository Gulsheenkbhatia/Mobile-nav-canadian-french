import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import DrawerHeader from 'toro/components/DrawerHeader'
import Text from 'toro/components/Text'
import DrawerBody from 'toro/components/DrawerBody'
import Drawer from 'toro/components/Drawer'
import Box from 'toro/components/Box'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useDisclosure from 'toro/hooks/useDisclosure'
import { flyoutConfigAtom, setFlyoutConfigAtom, FlyoutConfigAtomType } from 'store/flyout.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const FlyoutHeaderRegister = dynamic(() => import('toro/components/Flyout/FlyoutHeaderRegister'), {
  ssr: false,
})
const FlyoutBodyLogin = dynamic(() => import('toro/components/Flyout/FlyoutBodyLogin'), {
  ssr: false,
})
const FlyoutBodyRegister = dynamic(() => import('toro/components/Flyout/FlyoutBodyRegister'), {
  ssr: false,
})
const FlyoutBodyForgotPassword = dynamic(
  () => import('toro/components/Flyout/FlyoutBodyForgotPassword'),
  { ssr: false }
)

export default function Flyout() {
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [drawerHeader, setDrawerHeader] = useState(null)
  const [drawerBody, setDrawerBody] = useState(null)
  const setFlyoutConfig = useUpdateAtom(setFlyoutConfigAtom)
  const flyoutType = useAtomValue(flyoutConfigAtom)

  const styles: any = useMultiStyleConfig('Flyout')
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => hide(),
  })

  const show = async ({ type, options = {} }: FlyoutConfigAtomType) => {
    setFullscreenLoading(true)
    if (options.referrer?.endsWith('.html')) {
      const tokens = options.referrer.split('.html')
      options.referrer = tokens[0]
    }
    // Dynamically load fetchFlyoutContent
    const fetchFlyoutContent = (await import('toro/helpers/fetchFlyoutContent')).default
    const result = await fetchFlyoutContent(type, options)
    setDrawerHeader(result.header)
    setDrawerBody(result.body)
    onOpen()
    setFullscreenLoading(false)
  }

  useEffect(() => {
    if (flyoutType) {
      show(flyoutType)
    }
  }, [flyoutType])

  const hide = () => {
    setDrawerHeader(null)
    setDrawerBody(null)
    setFlyoutConfig(null)
  }

  return (
    <Drawer isOpen={isOpen} placement="right" variant="flyout" size="lg" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxWidth="368px" sx={styles?.drawerContent(flyoutType?.type)}>
        <DrawerCloseButton data-qa="Close_Button" />
        <DrawerHeader pb={0} pt="m" px="l">
          {drawerHeader && drawerBody && flyoutType?.type === 'register' ? (
            <FlyoutHeaderRegister drawerHeader={drawerHeader} drawerBody={drawerBody} />
          ) : (
            <Box py="s" mt="xxl">
              <Text size="sm" letterSpacing="1px">
                {drawerHeader?.text}
              </Text>
            </Box>
          )}
        </DrawerHeader>
        <DrawerBody pt="m" pb="l" px="l">
          {drawerBody && flyoutType?.type === 'login' && (
            <FlyoutBodyLogin data={drawerBody} onClose={onClose} />
          )}
          {drawerBody && flyoutType?.type === 'register' && (
            <FlyoutBodyRegister data={drawerBody} onClose={onClose} />
          )}
          {drawerBody && flyoutType?.type === 'forgot-password' && (
            <FlyoutBodyForgotPassword
              data={drawerBody}
              onClose={onClose}
              setDrawerHeader={setDrawerHeader}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
