import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import { useCallback } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { isShopByStickyFiltersEnabledAtom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import useScrollWithHeadroomDisabled from 'toro/hooks/useScrollWithHeadroomDisabled'

interface ShopByWayfindingProps {
  wayfinding: {
    enabled: boolean
    option: 'icons' | 'no-icons'
    items: {
      image: { src: string; alt: string }
      id: string
      name: string
      url: string
      sectionId: string
    }[]
  }
}

const ShopByWayfinding = ({ wayfinding }: ShopByWayfindingProps) => {
  const shouldRenderIcons = wayfinding.option === 'icons'
  const styles = useMultiStyleConfig('ShopByProductListingPage', { shouldRenderIcons })
  const scrollTo = useScrollWithHeadroomDisabled()
  const isShopByStickyFiltersEnabled = useAtomValue(isShopByStickyFiltersEnabledAtom)

  const items = get(wayfinding, 'items', [])

  const onItemClick = useCallback(
    (sectionId: string) => {
      return () => {
        const filtersHeight = isShopByStickyFiltersEnabled
          ? document.getElementById('shop-by-browse-by-categories-filters')?.offsetHeight
          : 0
        const offsetTop = document.getElementById(sectionId)?.offsetTop

        if (offsetTop) {
          scrollTo({
            top: offsetTop - filtersHeight,
            behavior: 'smooth',
          })
        }
      }
    },
    [isShopByStickyFiltersEnabled]
  )

  if (!items.length) return null

  return (
    <Flex
      sx={styles.topCarouselWrapper}
      className={shouldRenderIcons ? 'image-carousel-wrapper' : ''}
      data-qa="wayFinder"
    >
      {items.map((item, idx) => (
        <Box
          key={item.id}
          sx={styles.topCarouselItem}
          onClick={onItemClick(item.sectionId)}
          className={shouldRenderIcons ? 'image-carousel-item' : ''}
        >
          {shouldRenderIcons && (
            <Image
              src={get(item, 'image.src')}
              alt={get(item, 'image.alt')}
              aspectRatio={0.8}
              lazy={idx > 2}
            />
          )}
          <p>{item.name}</p>
        </Box>
      ))}
    </Flex>
  )
}

export default ShopByWayfinding
