import { renderHook } from 'test-utils/react'
import { useAccessorizedImageUrl } from './hooks'
import type { Atom } from 'jotai'

// Mock store/accessorizeIt.atom before any imports - only mock what's used
jest.mock('store/accessorizeIt.atom', () => {
  const { atom } = jest.requireActual('jotai')
  return {
    accessorizeItSelectedProductIDAtom: atom(''),
    accessorizeItSelectedProductAtom: atom(Promise.resolve(null)),
  }
})

// Mock dependencies
jest.mock('toro/helpers/productImages', () => ({
  getProductImageSrc: jest.fn(),
}))

jest.mock('toro/hooks/useSelectedColorData', () => jest.fn())

jest.mock('toro/hooks/useTemplate', () => jest.fn())

jest.mock('jotai/utils', () => {
  const actual = jest.requireActual('jotai/utils')
  return {
    ...actual,
    useAtomValue: jest.fn(),
  }
})

// Import mocked modules
import { getProductImageSrc } from 'toro/helpers/productImages'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useTemplate from 'toro/hooks/useTemplate'
import { useAtomValue } from 'jotai/utils'
import {
  accessorizeItSelectedProductIDAtom,
  accessorizeItSelectedProductAtom,
} from 'store/accessorizeIt.atom'

// Create typed mocks
const mockGetProductImageSrc = jest.mocked(getProductImageSrc)
const mockUseSelectedColorData = jest.mocked(useSelectedColorData)
const mockUseTemplate = jest.mocked(useTemplate)
const mockUseAtomValue = jest.mocked(useAtomValue)

describe('useAccessorizedImageUrl', () => {
  const defaultProductImage = 'https://example.com/product.jpg'
  const defaultProductDefaultImage = 'https://example.com/product-default.jpg'
  const defaultImageSrc = 'https://example.com/product-mobile.jpg'
  const serverAccessorizedImageUrl =
    'https://images.example.com/scene7/placeholders/vg_123_456_master_color_c0'

  const defaultContexts = {
    JotaiProviderContext: new Map<Atom<unknown>, unknown>([
      [accessorizeItSelectedProductIDAtom, ''],
      [accessorizeItSelectedProductAtom, Promise.resolve(null)],
    ]),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseSelectedColorData.mockReturnValue([
      null, // baseProductColor
      defaultProductImage,
      defaultProductDefaultImage,
    ])

    mockUseTemplate.mockReturnValue(false)
    mockGetProductImageSrc.mockReturnValue(defaultImageSrc)
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItSelectedProductAtom) {
        return null
      }
      return null
    })
  })

  it('should return default image when no accessory is selected', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItSelectedProductAtom) {
        return null
      }
      return null
    })

    const { result } = renderHook(() => useAccessorizedImageUrl(), {
      contexts: defaultContexts,
    })

    expect(result.current).toBe(defaultImageSrc)
  })

  it('should return accessorized image URL from server when accessory is selected and URL is available', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItSelectedProductAtom) {
        return {
          id: 'MASTER-COLOR',
          accessorizedImageUrl: serverAccessorizedImageUrl,
        }
      }
      return null
    })

    const { result } = renderHook(() => useAccessorizedImageUrl(), {
      contexts: defaultContexts,
    })

    expect(result.current).toBe(serverAccessorizedImageUrl)
  })

  it('should return default image when accessory is selected but URL is not available from server', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItSelectedProductAtom) {
        return {
          id: 'MASTER-COLOR',
          // accessorizedImageUrl is undefined
        }
      }
      return null
    })

    const { result } = renderHook(() => useAccessorizedImageUrl(), {
      contexts: defaultContexts,
    })

    expect(result.current).toBe(defaultImageSrc)
  })

  it('should return accessorized image URL regardless of angle parameter (server provides URL for c0)', () => {
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom === accessorizeItSelectedProductAtom) {
        return {
          id: 'MASTER-COLOR',
          accessorizedImageUrl: serverAccessorizedImageUrl,
        }
      }
      return null
    })

    const { result } = renderHook(() => useAccessorizedImageUrl('c2'), {
      contexts: defaultContexts,
    })

    expect(result.current).toBe(serverAccessorizedImageUrl)
  })
})
