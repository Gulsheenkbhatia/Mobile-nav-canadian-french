import pdpThemev5 from 'toro/components/product/desktop/theme/v5'
import { themeMerger } from 'store/theme-with-experiments.atom'
import ProductCarousel from 'toro/components/product/desktop/ProductCarousel/themes/v5_1/theme'
import CarouselVideo from 'toro/components/product/desktop/CarouselVideo/themes/v5_1/theme'
import TangibleeControl from 'toro/components/product/desktop/ProductTangibleeControl/themes/v5_1/product-media-theme'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches/themes/v5_1/theme'
import ProductSizeSelector from 'toro/components/product/desktop/v5_1/SizeSelector/themes/theme'
import SizeGuideTheme from 'toro/components/product/SizeGuideButton/themes/v5_1/theme'
import ProductCarouselZoomModal from 'toro/components/product/desktop/ProductCarouselZoomModal/themes/v5_1/theme'

import mergeWith from 'lodash/mergeWith'

type V5ComponentNames = keyof typeof pdpThemev5['components']
type NewComponents = 'ProductCarouselZoomModal'

/**
 * Represents the set of allowed component names for v5.1.
 *
 * By default, this includes all components from the v5 theme (`V5ComponentNames`).
 * If you need to support new components that do not exist in v5, extend
 * `NewComponents` with their names.
 *
 * @example
 * // Add new components
 * type NewComponents = 'First' | 'Second'
 *
 * // Create a type that allows v5 components + new ones
 * type MyComponents = V5_1ComponentNames<NewComponents>
 *
 * const components: MyComponents = {
 *   ProductCarousel: {}, // from v5
 *   First: {},           // newly added
 *   Second: {},          // newly added
 *   Wrong: {}            // error (not in v5 and not listed in NewComponents)
 * }
 */
type V5_1ComponentNames<TNewComponent extends NewComponents> = Partial<
  Record<V5ComponentNames | TNewComponent, unknown>
>

const pdpThemeV5_1: { components: V5_1ComponentNames<NewComponents> } = {
  components: {
    ProductCarousel,
    CarouselVideoDesktop: CarouselVideo,
    ProductMediaTangibleeControls: TangibleeControl,
    PDPColorSwatches,
    ProductSizeSelector,
    SizeGuideTheme,
    ProductCarouselZoomModal,
  },
}

export default mergeWith({}, pdpThemev5, pdpThemeV5_1, themeMerger(pdpThemev5))
