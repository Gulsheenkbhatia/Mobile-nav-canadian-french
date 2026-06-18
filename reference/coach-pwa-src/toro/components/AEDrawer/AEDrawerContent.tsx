import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { memo, ReactNode } from 'react'
import { SystemStyleObject } from '@chakra-ui/react'
import Image from 'toro/components/Image'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import { AEDrawerProduct } from 'store/ae-drawer.atom'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'

type AEDrawerContentProps = {
  viewport: 'mobile' | 'tablet' | 'desktop'
  title: string
  productData: AEDrawerProduct
  children: ReactNode
  styles: Record<string, SystemStyleObject | any>
}

function AEDrawerContent({ viewport, title, productData, styles, children }: AEDrawerContentProps) {
  const { firstThumbnailSrc, name } = productData
  const image = getProductImageSrc(firstThumbnailSrc, viewport, 'pdp', { isSwatchImageV3: true })
  const { isDesktop } = useViewportType()
  return (
    <>
      <DrawerOverlay />
      <DrawerContent
        sx={styles.drawerContent}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              y: 0,
              transition: { duration: 0.4 },
            },
            exit: {
              x: isDesktop ? '100%' : '0',
              y: isDesktop ? '0' : '100%',
              transition: { duration: 0.1 },
            },
          },
        }}
      >
        <DrawerCloseButton data-qa="plp_close_icon_recommendation" />
        <Flex sx={styles.drawerHeader}>
          <Image src={image} alt={name} sx={styles.productThumbnailImage} />
          <Flex sx={styles.drawerHeaderTitle}>
            {title && <Text sx={styles.similarToLabel}>{title}</Text>}
            <Text sx={styles.similarToProductName}>{name}</Text>
          </Flex>
        </Flex>
        <Flex sx={styles.drawerBody}>{children}</Flex>
      </DrawerContent>
    </>
  )
}

export default memo(AEDrawerContent)
