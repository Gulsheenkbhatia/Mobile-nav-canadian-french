import React, { useMemo, useState } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

import {
  BagDimension,
  BagStrapDrop,
  BagKeyFeatures,
  BagFabric,
  BagMaterial,
  BagDetails,
  ClosureType,
  ShoeHeelSpecifications,
} from 'toro/icons'

import ExpandableProductDetails from 'toro/components/product/mobile/ExpandableProductDetails'
import { type MessageDescriptor, useIntl } from 'react-intl'
import useProductData from 'toro/hooks/useProductData'
import Button from 'toro/components/Button'
import { useIntroBrowserSession } from 'toro/hooks/useIntroBrowserSession'
import useFullProductMedia from 'toro/components/product/mobile/v7/hooks/useFullProductMedia'
import usePreference from 'toro/hooks/usePreference_new'
import CarouselVideo from 'toro/components/product/CarouselVideo'

const TECHNICAL_DETAILS_TITLE: MessageDescriptor = {
  id: 'pdp.product.productDetail.titleV7',
  defaultMessage: 'Technical details',
}
// TODO: These icons will eventually come from design tokens instead of hard-coded toro/icons imports.
export const ICON_MAP = {
  icon_dimensions: BagDimension,
  icon_strapdrop: BagStrapDrop,
  icon_keyfeatures: BagKeyFeatures,
  icon_fabriccomposition: BagFabric,
  icon_material: BagMaterial,
  icon_details: BagDetails,
  icon_heelSpecifications: ShoeHeelSpecifications,
  icon_closureType: ClosureType,
}

const ProductSpecifications = () => {
  const styles = useMultiStyleConfig('ProductSpecsGrid')
  const { formatMessage } = useIntl()
  const { isFirstIntroBrowserSessionActive } = useIntroBrowserSession()
  const [isManuallyOpened, setIsManuallyOpened] = useState(false)

  const {
    pdpPreferences: { templateConfigs: { pdpv7: { enableProdSpecs = false } = {} } = {} },
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  const showMedia = isFirstIntroBrowserSessionActive || isManuallyOpened

  const productSpecs = useProductData('productSpecs') || []

  const validSpecs = productSpecs.filter((item) => item?.values?.length)

  const specsSectionVisible = enableProdSpecs && validSpecs.length > 0

  const productMedias = useFullProductMedia()
  const { productVideoIndex, productVideo } = useMemo(() => {
    const idx = productMedias.findIndex((m) => m.type === 'video' && m.src)
    const video = idx !== -1 ? productMedias[idx] : undefined
    return { productVideoIndex: idx, productVideo: video }
  }, [productMedias])
  const hasProductVideo = Boolean(productVideo)

  if (!specsSectionVisible) return null

  return (
    <Box sx={styles.container}>
      <Flex sx={styles.header}>
        <Text sx={styles.title}>
          {formatMessage({
            id: 'pdp.productSpecifications.title',
            defaultMessage: 'Product Specifications',
          })}
        </Text>

        <Text sx={styles.description}>
          {formatMessage({
            id: 'pdp.productSpecifications.description',
            defaultMessage: 'Thoughtfully designed, crafted with love.',
          })}
        </Text>
      </Flex>

      {hasProductVideo && !showMedia && (
        <Button
          size="xl"
          onClick={() => setIsManuallyOpened(true)}
          data-qa="open-product-specs-video"
          sx={styles.openImageButton}
        >
          {formatMessage({
            id: 'pdp.productSpecifications.viewVideo',
            defaultMessage: 'View Video',
          })}
        </Button>
      )}

      {showMedia && productVideo && (
        <Box sx={styles.videoEmbed}>
          <CarouselVideo
            objectFit="contain"
            videoSrc={productVideo.src}
            poster={productVideo.poster}
            isActive
            idx={productVideoIndex > 0 ? productVideoIndex : 1}
            isPlay
            muted
            isGallery
            variant="pdpv7"
          />
        </Box>
      )}

      <Box sx={styles.grid}>
        {validSpecs.map((spec, index) => {
          const Icon = ICON_MAP[spec.icon]

          const hasTopBorder = index >= 2

          return (
            <Flex
              key={`${spec.label}-${index}`}
              sx={{
                ...styles.item,
                borderTop: hasTopBorder ? '0.8px solid var(--color-neutral-light-3)' : 'none',
              }}
            >
              {Icon && (
                <Box sx={styles.icon}>
                  <Icon />
                </Box>
              )}

              <Flex sx={styles.itemDetails}>
                <Text sx={styles.itemTitle}>{spec.label}</Text>

                <Flex direction="column">
                  {spec.values.map((value, idx) => (
                    <Text sx={styles.itemValue} key={`${spec.label}-${idx}`}>
                      {value}
                    </Text>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          )
        })}
      </Box>

      <ExpandableProductDetails
        variant="pdpv7"
        hideAccordionItems={true}
        accordionTitle={TECHNICAL_DETAILS_TITLE}
      />
    </Box>
  )
}

export default ProductSpecifications
