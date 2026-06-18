import { renderHook } from '@testing-library/react'
import { Provider as JotaiProvider } from 'jotai'
import useIsSubBrandSwitch from 'toro/hooks/useIsSubBrandSwitch'
import { isSubBrandActiveAtom, subBrandAtom } from 'store/global.atom'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'

const atomsOneCoachOff = [
  [isSubBrandActiveAtom, false],
  [subBrandAtom, 'coachtopia'],
  [isOneCoachNAEnabledAtom, false],
]

const createWrapper = (initialValues = atomsOneCoachOff) => {
  return function Wrapper({ children }) {
    return <JotaiProvider initialValues={initialValues}>{children}</JotaiProvider>
  }
}

const renderWithProps = (href, initialValues = atomsOneCoachOff) => {
  return renderHook(() => useIsSubBrandSwitch(href), {
    wrapper: createWrapper(initialValues),
  })
}

describe('useIsSubBrandSwitch', () => {
  describe('when OneCoach disabled: return value = isSubBrandLink', () => {
    describe('isSubBrandInPath: sub-brand is first segment after /shop/ or /products/', () => {
      it('returns true for /shop/coachtopia (sub-brand link)', () => {
        const { result } = renderWithProps('/shop/coachtopia')
        expect(result.current).toBe(true)
      })

      it('returns true for /shop/coachtopia/all/view-all (sub-brand link)', () => {
        const { result } = renderWithProps('/shop/coachtopia/all/view-all')
        expect(result.current).toBe(true)
      })

      it('returns true for /products/coachtopia', () => {
        const { result } = renderWithProps('/products/coachtopia')
        expect(result.current).toBe(true)
      })
    })

    describe('isSubBrandInPath: sub-brand under /outlet/ is NOT sub-brand link', () => {
      it('returns false for /shop/outlet/coachtopia', () => {
        const { result } = renderWithProps('/shop/outlet/coachtopia')
        expect(result.current).toBe(false)
      })

      it('returns false for /shop/outlet/women/coachtopia/wallets', () => {
        const { result } = renderWithProps('/shop/outlet/women/coachtopia/wallets')
        expect(result.current).toBe(false)
      })
    })

    describe('isSubBrandInQueryParamsString: isCoachtopia=true', () => {
      it('returns true when href has /shop/ path and ?isCoachtopia=true', () => {
        const { result } = renderWithProps('/shop/women?isCoachtopia=true')
        expect(result.current).toBe(true)
      })

      it('returns true when href has /shop/ path and &isCoachtopia=true', () => {
        const { result } = renderWithProps('/shop/women?foo=bar&isCoachtopia=true')
        expect(result.current).toBe(true)
      })
    })
  })

  describe('when OneCoach enabled: return true only for (to/from) sub-brand switch', () => {
    it('returns true when OneCoach enabled, isSubBrandLink and not currently on sub-brand (navigating TO sub-brand)', () => {
      const { result } = renderWithProps('/shop/coachtopia', [
        [isSubBrandActiveAtom, false],
        [subBrandAtom, 'coachtopia'],
        [isOneCoachNAEnabledAtom, true],
      ])
      expect(result.current).toBe(true)
    })

    it('returns false when OneCoach enabled, link is outlet/coachtopia (same-section nav)', () => {
      const { result } = renderWithProps('/shop/outlet/coachtopia', [
        [isSubBrandActiveAtom, false],
        [subBrandAtom, 'coachtopia'],
        [isOneCoachNAEnabledAtom, true],
      ])
      expect(result.current).toBe(false)
    })

    it('returns false for Coachtopia PDP link when not on sub-brand (no brand switch for PDP)', () => {
      const { result } = renderWithProps('/products/coachtopia/ergo-bag-in-coachtopia-leather', [
        [isSubBrandActiveAtom, false],
        [subBrandAtom, 'coachtopia'],
        [isOneCoachNAEnabledAtom, true],
      ])
      expect(result.current).toBe(false)
    })

    it('returns false for Coachtopia PDP link when already on sub-brand (same-brand PDP nav)', () => {
      const { result } = renderWithProps('/products/coachtopia/ergo-bag-in-coachtopia-leather', [
        [isSubBrandActiveAtom, true],
        [subBrandAtom, 'coachtopia'],
        [isOneCoachNAEnabledAtom, true],
      ])
      expect(result.current).toBe(false)
    })

    it('returns true for Coachtopia PLP link when not on sub-brand (brand switch still needed for PLP)', () => {
      const { result } = renderWithProps('/shop/coachtopia/bags', [
        [isSubBrandActiveAtom, false],
        [subBrandAtom, 'coachtopia'],
        [isOneCoachNAEnabledAtom, true],
      ])
      expect(result.current).toBe(true)
    })
  })
})
