import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { memo } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import CustomSlot from 'toro/cms/components/CustomSlot'
import FreeShipping from 'toro/components/FreeShipping'

const ShippingAndReturnsContent = ({ title, shippingBody }) => {
  const styles = useMultiStyleConfig('ShippingAndReturnsModal')
  return (
    <>
      <DrawerOverlay />
      <DrawerContent sx={styles.drawerContent}>
        <DrawerCloseButton />
        <Flex sx={styles.drawerHeader}>
          <Text sx={styles.drawerHeaderTitle}>{title}</Text>
        </Flex>
        <Flex sx={styles.drawerBody}>
          <CustomSlot content={shippingBody} Component={FreeShipping} />
        </Flex>
      </DrawerContent>
    </>
  )
}

export default memo(ShippingAndReturnsContent)
