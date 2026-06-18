import { renderHook } from 'test-utils/react'
import { TemplateName } from 'toro/constants/templates'
import { productDataAtom } from 'store/pdp.atom'
import useTemplate, { USE_TEMPLATE_VALIDATION_MESSAGES } from 'toro/hooks/useTemplate'

describe('useTemplate', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.mocked(console.error).mockRestore()
  })

  describe('Template Matching', () => {
    it('should return true when the template is in the list', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.pdpv5, mobile: TemplateName.default } },
            ],
          ]),
        },
      })
      expect(result.current).toBe(true)
    })

    it('should return false when the template is not in the list', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.default, mobile: TemplateName.pdpv6 } },
            ],
          ]),
        },
      })
      expect(result.current).toBe(false)
    })

    it('should return true when checking for major version', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.pdpv5_0, mobile: TemplateName.default } },
            ],
          ]),
        },
      })
      expect(result.current).toBe(true)
    })

    it('should return true when template matches any in the list', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5, TemplateName.pdpv6]), {
        contexts: {
          ViewportContext: { isDesktop: false, isMobile: true },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.default, mobile: TemplateName.pdpv6 } },
            ],
          ]),
        },
      })
      expect(result.current).toBe(true)
    })

    it('should return false when template does not match any in the list', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5, TemplateName.pdpv6]), {
        contexts: {
          ViewportContext: { isDesktop: false, isMobile: true },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.default, mobile: TemplateName.default } },
            ],
          ]),
        },
      })
      expect(result.current).toBe(false)
    })

    it('should use default template when template is undefined', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.default]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([[productDataAtom, {}]]),
        },
      })
      expect(result.current).toBe(true)
    })

    it('should use default template when productData is null', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.default]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([[productDataAtom, null]]),
        },
      })
      expect(result.current).toBe(true)
    })
  })

  describe('Validation and Error Handling', () => {
    it('should return false and log error when template list is empty', () => {
      const { result } = renderHook(() => useTemplate([]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.pdpv5, mobile: TemplateName.default } },
            ],
          ]),
        },
      })

      expect(result.current).toBe(false)
      expect(console.error).toHaveBeenCalledWith(USE_TEMPLATE_VALIDATION_MESSAGES.EMPTY_TEMPLATE)
    })

    it('should return false and log error when template list is undefined', () => {
      const { result } = renderHook(() => useTemplate(undefined as any), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [
              productDataAtom,
              { templates: { desktop: TemplateName.pdpv5, mobile: TemplateName.default } },
            ],
          ]),
        },
      })

      expect(result.current).toBe(false)
      expect(console.error).toHaveBeenCalledWith(USE_TEMPLATE_VALIDATION_MESSAGES.EMPTY_TEMPLATE)
    })

    it('should return false and log error when template is not a string', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [productDataAtom, { templates: { desktop: 123 as any, mobile: TemplateName.default } }],
          ]),
        },
      })

      expect(result.current).toBe(false)
      expect(console.error).toHaveBeenCalledWith(USE_TEMPLATE_VALIDATION_MESSAGES.INVALID_TEMPLATE)
    })

    it('should return false and log error when template is an object', () => {
      const { result } = renderHook(() => useTemplate([TemplateName.pdpv5]), {
        contexts: {
          ViewportContext: { isDesktop: true, isMobile: false },
          JotaiProviderContext: new Map([
            [productDataAtom, { templates: { desktop: {} as any, mobile: TemplateName.default } }],
          ]),
        },
      })

      expect(result.current).toBe(false)
      expect(console.error).toHaveBeenCalledWith(USE_TEMPLATE_VALIDATION_MESSAGES.INVALID_TEMPLATE)
    })
  })

  describe('Multiple Templates', () => {
    it('should handle checking multiple templates at once', () => {
      const { result } = renderHook(
        () => useTemplate([TemplateName.pdpv5, TemplateName.pdpv5_0, TemplateName.pdpv5_1]),
        {
          contexts: {
            ViewportContext: { isDesktop: true, isMobile: false },
            JotaiProviderContext: new Map([
              [
                productDataAtom,
                { templates: { desktop: TemplateName.pdpv5_1, mobile: TemplateName.default } },
              ],
            ]),
          },
        }
      )
      expect(result.current).toBe(true)
    })

    it('should return true if any template in list matches', () => {
      const { result } = renderHook(
        () => useTemplate([TemplateName.default, TemplateName.pdpv5, TemplateName.pdpv6]),
        {
          contexts: {
            ViewportContext: { isDesktop: false, isMobile: true },
            JotaiProviderContext: new Map([
              [
                productDataAtom,
                { templates: { desktop: TemplateName.default, mobile: TemplateName.pdpv6 } },
              ],
            ]),
          },
        }
      )
      expect(result.current).toBe(true)
    })

    it('should return false if none of the templates match', () => {
      const { result } = renderHook(
        () => useTemplate([TemplateName.pdpv5_0, TemplateName.pdpv5_1]),
        {
          contexts: {
            ViewportContext: { isDesktop: false, isMobile: true },
            JotaiProviderContext: new Map([
              [
                productDataAtom,
                { templates: { desktop: TemplateName.default, mobile: TemplateName.pdpv6 } },
              ],
            ]),
          },
        }
      )
      expect(result.current).toBe(false)
    })
  })
})
