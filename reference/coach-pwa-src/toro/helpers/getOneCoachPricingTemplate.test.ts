import { ProductVertical } from 'toro/constants/OneSite'
import { PriceTemplate } from 'toro/types/productTypes'
import getOneCoachPricingTemplate from './getOneCoachPricingTemplate'

const cleanStateBase = {
  enableFallBackPricing: false,
  isOnClearance: false,
  isBundle: false,
  hideDiscountRate: false,
  hideComparableValue: false,
}

const fallbackBase = {
  enableFallBackPricing: true,
  isOnClearance: false,
  isBundle: false,
  hideDiscountRate: false,
  hideComparableValue: false,
  fallbackHideDiscountRate: false,
  fallbackHideComparableValue: false,
}

describe('getOneCoachPricingTemplate', () => {
  describe('clean state pricing (enableFallBackPricing is false)', () => {
    describe('Collection vertical', () => {
      it('returns FullPrice when discount enabled on shop level and item-level has no exceptions', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Collection,
            cleanStateDisplayDiscountPercentage: true,
          })
        ).toBe(PriceTemplate.FullPrice)
      })

      it('returns Strikeoff when item-level exception is present', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Collection,
            cleanStateDisplayDiscountPercentage: true,
            hideDiscountRate: true,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })

      it('returns Strikeoff when discount is not enabled on shop level', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Collection,
            cleanStateDisplayDiscountPercentage: false,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })

      it('returns Strikeoff for non-bundle collection when cleanStateDisplayDiscountPercentage is omitted', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Collection,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })

      describe('clearance', () => {
        it('returns Strikeoff for collection on clearance in clean state', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Collection,
              isOnClearance: true,
            })
          ).toBe(PriceTemplate.Strikeoff)
        })
      })

      describe('bundles', () => {
        it('returns Strikeoff for collection bundle in clean state', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Collection,
              isBundle: true,
            })
          ).toBe(PriceTemplate.Strikeoff)
        })
      })
    })

    describe('Outlet vertical', () => {
      describe('when cleanStateDisplayDiscountPercentage is true', () => {
        it('returns FullPriceComparable when item does not hide discount or comparable', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              cleanStateDisplayDiscountPercentage: true,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns Discount when item hides comparable value', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              cleanStateDisplayDiscountPercentage: true,
              hideComparableValue: true,
            })
          ).toBe(PriceTemplate.Discount)
        })

        it('returns SinglePrice when item hides discount rate', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              cleanStateDisplayDiscountPercentage: true,
              hideDiscountRate: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })

        it('returns SinglePrice when item hides both discount rate and comparable value', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              cleanStateDisplayDiscountPercentage: true,
              hideDiscountRate: true,
              hideComparableValue: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })
      })

      describe('when cleanStateDisplayDiscountPercentage is false or omitted', () => {
        it('returns SinglePrice for standard outlet when flag is false', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              cleanStateDisplayDiscountPercentage: false,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })

        it('returns SinglePrice for standard outlet when cleanStateDisplayDiscountPercentage is omitted', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })
      })

      describe('clearance outlet', () => {
        it('returns FullPriceComparable when on clearance with default item flags', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns FullPriceComparable when on clearance with hideDiscountRate and visible comparable', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              hideDiscountRate: true,
              hideComparableValue: false,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns FullPriceComparable when on clearance with hideComparableValue and visible discount', () => {
          expect(
            getOneCoachPricingTemplate({
              ...cleanStateBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              hideComparableValue: true,
              hideDiscountRate: false,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })
      })
    })

    describe('bundled products in clean state', () => {
      it('returns Strikeoff for outlet bundle regardless of cleanStateDisplayDiscountPercentage', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Outlet,
            isBundle: true,
            cleanStateDisplayDiscountPercentage: true,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })

      it('returns Strikeoff for collection bundle', () => {
        expect(
          getOneCoachPricingTemplate({
            ...cleanStateBase,
            productVertical: ProductVertical.Collection,
            isBundle: true,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })
    })
  })

  describe('fallback state pricing (enableFallBackPricing is true)', () => {
    describe('Outlet vertical', () => {
      describe('non-clearance: shop-level category flags (item-level hides off)', () => {
        it('returns FullPriceComparable when both shop hide flags are false', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns Comparable when only fallbackHideDiscountRate is true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.Comparable)
        })

        it('returns Discount when only fallbackHideComparableValue is true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.Discount)
        })

        it('returns SinglePrice when both shop hide flags are true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })
      })

      describe('non-clearance: item-level only (shop-level flags off)', () => {
        it('returns Comparable when hideDiscountRate is true and hideComparableValue is false', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: true,
              hideComparableValue: false,
            })
          ).toBe(PriceTemplate.Comparable)
        })

        it('returns Discount when hideComparableValue is true and hideDiscountRate is false', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: false,
              hideComparableValue: true,
            })
          ).toBe(PriceTemplate.Discount)
        })

        it('returns SinglePrice when both item hide flags are true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: true,
              hideComparableValue: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })
      })

      describe('non-clearance: item-level overrides shop-level category flags', () => {
        it('returns SinglePrice when item hideDiscountRate and shop hides both CV and DR', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: true,
              hideComparableValue: false,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })

        it('returns SinglePrice when item hides both and shop hide flags are off', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: true,
              hideComparableValue: true,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })

        it('returns SinglePrice when item hideComparableValue and shop hideDiscountRate', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: false,
              hideComparableValue: true,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })

        it('returns SinglePrice when item hideDiscountRate and shop hideComparableValue only', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              hideDiscountRate: true,
              hideComparableValue: false,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.SinglePrice)
        })
      })

      describe('on clearance: shop-level hide CV and DR flags are ignored', () => {
        it('returns FullPriceComparable when both shop hide flags are false', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns FullPriceComparable when only fallbackHideDiscountRate is true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: false,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns FullPriceComparable when only fallbackHideComparableValue is true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              fallbackHideDiscountRate: false,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })

        it('returns FullPriceComparable when both shop hide flags are true', () => {
          expect(
            getOneCoachPricingTemplate({
              ...fallbackBase,
              productVertical: ProductVertical.Outlet,
              isOnClearance: true,
              fallbackHideDiscountRate: true,
              fallbackHideComparableValue: true,
            })
          ).toBe(PriceTemplate.FullPriceComparable)
        })
      })
    })

    describe('Collection vertical', () => {
      describe('fallback: Strikeoff regardless of shop and item hide flags', () => {
        it.each([
          [false, false, false, false],
          [true, true, false, false],
          [false, true, true, false],
          [true, false, false, true],
          [true, true, true, true],
        ] as const)(
          'returns Strikeoff when shop DR=%s, shop CV=%s, item hideDR=%s, item hideCV=%s',
          (
            fallbackHideDiscountRate,
            fallbackHideComparableValue,
            hideDiscountRate,
            hideComparableValue
          ) => {
            expect(
              getOneCoachPricingTemplate({
                ...fallbackBase,
                productVertical: ProductVertical.Collection,
                fallbackHideDiscountRate,
                fallbackHideComparableValue,
                hideDiscountRate,
                hideComparableValue,
              })
            ).toBe(PriceTemplate.Strikeoff)
          }
        )
      })
    })

    describe('bundled products in fallback state', () => {
      it('returns Strikeoff for outlet bundle in fallback (bundle rule wins)', () => {
        expect(
          getOneCoachPricingTemplate({
            ...fallbackBase,
            productVertical: ProductVertical.Outlet,
            isBundle: true,
            fallbackHideDiscountRate: true,
            fallbackHideComparableValue: true,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })

      it('returns Strikeoff for collection bundle in fallback', () => {
        expect(
          getOneCoachPricingTemplate({
            ...fallbackBase,
            productVertical: ProductVertical.Collection,
            isBundle: true,
            fallbackHideDiscountRate: true,
            fallbackHideComparableValue: true,
          })
        ).toBe(PriceTemplate.Strikeoff)
      })
    })
  })
})
