import { updateProductDataForQuickView } from './plp'
import {
  MOCKED_NORMALIZED_PLP_PRODUCT_ID_AND_VARIATION_GROUP,
  MOCKED_QUICK_VIEW_PRODUCT_VARIATION_GROUP,
  MOCKED_UPDATED_QUICK_VIEW_PRODUCT_VARIATION_GROUP,
  MOCKED_NORMALIZED_PLP_PRODUCT_ID_AND_VARIATION_GROUP_2,
  MOCKED_QUICK_VIEW_PRODUCT_VARIATION_GROUP_2,
  MOCKED_UPDATED_QUICK_VIEW_PRODUCT_VARIATION_GROUP_2,
} from '../../../tests/mocks/products/variationGroup'

describe('it should return productData with variationGroup updated by color and isAlmostGone', () => {
  it('product with isAlmostGone: false', () => {
    const args = {
      id: '93836 B4/BK',
      productData: MOCKED_QUICK_VIEW_PRODUCT_VARIATION_GROUP,
      products: MOCKED_NORMALIZED_PLP_PRODUCT_ID_AND_VARIATION_GROUP,
    }
    expect(updateProductDataForQuickView(args)).toEqual(
      MOCKED_UPDATED_QUICK_VIEW_PRODUCT_VARIATION_GROUP
    )
  })

  it('product with isAlmostGone: true', () => {
    const args = {
      id: 'F41394JIWIN',
      productData: MOCKED_QUICK_VIEW_PRODUCT_VARIATION_GROUP_2,
      products: MOCKED_NORMALIZED_PLP_PRODUCT_ID_AND_VARIATION_GROUP_2,
    }
    expect(updateProductDataForQuickView(args)).toEqual(
      MOCKED_UPDATED_QUICK_VIEW_PRODUCT_VARIATION_GROUP_2
    )
  })
})
