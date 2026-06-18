import { Atom } from 'jotai'
import * as jotaiUtils from 'jotai/utils'
import { renderHook, waitFor } from 'test-utils/react'
import { productDataAtom, productPriceAtom } from 'store/pdp.atom'
import { useSyncTangibleePriceGroup } from './useSyncTangibleePriceGroup'

jest.mock('toro/hooks/useGetCurrencyOptions', () => ({
  __esModule: true,
  default: jest.fn(() => () => ({
    currency: 'USD',
    decimals: 2,
    locale: 'en-US',
  })),
}))

const defaultProductPrice = {
  regularPrice: '$350',
  salePrice: '$295',
  discountPercentageValue: 15,
  isCustomizedProduct: false,
  hideDiscountPercentageOneSite: false,
  hideComparableValueOneSite: false,
}

const mockSetPriceGroup = jest.fn()

function renderHookWithAtoms(initialValues: [Atom<unknown>, unknown][]) {
  return renderHook(() => useSyncTangibleePriceGroup(), {
    contexts: {
      JotaiProviderContext: new Map(initialValues),
    },
  })
}

describe('useSyncTangibleePriceGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSetPriceGroup.mockClear()
    jest.spyOn(jotaiUtils, 'useUpdateAtom').mockReturnValue(mockSetPriceGroup)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('writes list and sale to priceGroupAtom; omits dohDod when there is no promotional pricing', async () => {
    renderHookWithAtoms([
      [productPriceAtom, defaultProductPrice],
      [productDataAtom, { pickedProps: { currency: 'USD' } }],
    ])

    await waitFor(() => expect(mockSetPriceGroup).toHaveBeenCalled())
    const payload = mockSetPriceGroup.mock.calls[mockSetPriceGroup.mock.calls.length - 1][0]
    expect(payload).toEqual(
      expect.objectContaining({
        listPrice: '$350',
        salePrice: '$295',
      })
    )
    expect(payload.dohDodPrice).toBeUndefined()
  })

  it('includes dohDodPrice when promotional pricing exists on productData', async () => {
    renderHookWithAtoms([
      [productPriceAtom, defaultProductPrice],
      [
        productDataAtom,
        {
          pickedProps: { currency: 'USD' },
          promotionPrice: [{ promotionalPrice: { value: 199, formatted: '$199.00' } }],
        },
      ],
    ])

    await waitFor(() => expect(mockSetPriceGroup).toHaveBeenCalled())
    const payload = mockSetPriceGroup.mock.calls[mockSetPriceGroup.mock.calls.length - 1][0]
    expect(payload).toEqual(
      expect.objectContaining({
        listPrice: '$350',
        salePrice: '$295',
      })
    )
    expect(payload.dohDodPrice).toBeDefined()
    expect(String(payload.dohDodPrice)).toMatch(/199/)
  })

  it('passes salePrice N/A through to setPriceGroup unchanged', async () => {
    renderHookWithAtoms([
      [
        productPriceAtom,
        {
          ...defaultProductPrice,
          regularPrice: '$350',
          salePrice: 'N/A',
          discountPercentageValue: 0,
          isCustomizedProduct: true,
        },
      ],
      [productDataAtom, { pickedProps: { currency: 'USD' } }],
    ])

    await waitFor(() => expect(mockSetPriceGroup).toHaveBeenCalled())
    const payload = mockSetPriceGroup.mock.calls[mockSetPriceGroup.mock.calls.length - 1][0]
    expect(payload.listPrice).toBe('$350')
    expect(payload.salePrice).toBe('N/A')
  })

  it('does not call setPriceGroup when both regularPrice and salePrice are missing', () => {
    renderHookWithAtoms([
      [
        productPriceAtom,
        {
          ...defaultProductPrice,
          regularPrice: undefined,
          salePrice: undefined,
        },
      ],
      [productDataAtom, null],
    ])

    expect(mockSetPriceGroup).not.toHaveBeenCalled()
  })
})
