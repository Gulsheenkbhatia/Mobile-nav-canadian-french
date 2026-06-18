import { forwardRef, memo, Ref, useCallback, useMemo, useRef } from 'react'
import { CertonaSchemeType } from 'store/certona-schemes.atoms'
import useRVRecommendations from 'toro/hooks/useRVRecommendations'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import CollapsibleRecommendationsCarousel from 'toro/components/CollapsibleRVRecommendationsCarousel'

const MAX_THUMBNAIL_PRODUCTS = 3

export type RVCollapsibleConfig = {
  location: string
  certonaScheme: CertonaSchemeType
  enableBadging: boolean
  limit?: number
  defaultExpanded?: boolean
}

const RVCollapsibleRecommendationsCarousel = forwardRef(
  (
    { location, certonaScheme, enableBadging, limit, defaultExpanded }: RVCollapsibleConfig,
    forwardedRef: Ref<{ getHeight: () => number }>
  ) => {
    const carouselRef = useRef<HTMLElement | null>(null)

    const containerCallbackRef = useCallback((node: HTMLElement | null) => {
      carouselRef.current = node
    }, [])

    const {
      title,
      products,
      display,
      handleClick,
      experienceId,
      addImpression,
      selectRecommItem,
      vendorScheme,
    } = useRVRecommendations({
      location,
      certonaScheme,
      enableBadging,
      limit,
      forwardedRef,
      carouselRef,
    })

    const styles = useMultiStyleConfig('CollapsibleRVCarousel', {})
    const thumbnailProducts = useMemo(() => products.slice(0, MAX_THUMBNAIL_PRODUCTS), [products])

    const headerSlot = (
      <>
        <Flex sx={styles.thumbnailsContainer}>
          {thumbnailProducts.map((product) => (
            <Box key={product.ID} sx={styles.thumbnailImage}>
              <Image
                sx={styles.thumbnailImageInner}
                src={product.imageURL}
                alt={product.name}
                data-qa="rv-thumbnail-image"
              />
            </Box>
          ))}
        </Flex>
        <Text sx={styles.collapsibleTitle}>{title}</Text>
      </>
    )

    return (
      <CollapsibleRecommendationsCarousel
        products={products}
        display={display}
        title={title}
        experienceId={experienceId}
        vendorScheme={vendorScheme}
        addImpression={addImpression}
        selectRecommItem={selectRecommItem}
        location={location}
        onContainerClick={handleClick}
        containerCallbackRef={containerCallbackRef}
        defaultExpanded={defaultExpanded}
        headerSlot={headerSlot}
      />
    )
  }
)

RVCollapsibleRecommendationsCarousel.displayName = 'RVCollapsibleRecommendationsCarousel'

export default memo(RVCollapsibleRecommendationsCarousel)
