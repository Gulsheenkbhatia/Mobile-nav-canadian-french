import { renderHook } from 'test-utils/react'
import useMinicartCertona from 'toro/hooks/useMinicartCertona'

const mockAnalytyticsSend = jest.fn()
jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)

const mockClearScheme = jest.fn()
jest.mock('jotai/utils', () => {
  const actualModule = jest.requireActual('jotai/utils')

  return {
    ...actualModule,
    useUpdateAtom: () => mockClearScheme,
  }
})

let useCertonaSchemeProps
jest.mock('toro/hooks/useCertonaScheme', () => (...args) => {
  useCertonaSchemeProps = [...args]
  return { items: [1] }
})

jest.mock('toro/hooks/useCertonaRequest', () => () => jest.fn())

jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

const mockVariantId = 'QY674 BLK'

const makeSetup = () => renderHook(() => useMinicartCertona(mockVariantId))

describe('useMinicartCertona', () => {
  afterAll(() => {
    useCertonaSchemeProps = null
  })
  it('should call useCertonaScheme with correct arguments and pass returned value in defulat case', () => {
    const { result } = makeSetup()
    expect(useCertonaSchemeProps[0]).toBe('addtobag_rr')
    expect(useCertonaSchemeProps[1].pagetype).toBe('addtocart')
    expect(useCertonaSchemeProps[1].recommendations).toBe(true)
    expect(useCertonaSchemeProps[1].itemid).toBe(mockVariantId)
    expect(useCertonaSchemeProps[1].enabled).toBe(true)
    expect(useCertonaSchemeProps[1].force).toBe(true)
    expect(result.current).toEqual({ items: [1] })
  })
  it('should clear scheme on onmount', () => {
    const component = makeSetup()
    component.unmount()
    expect(mockClearScheme).toHaveBeenCalledWith('addtobag_rr')
  })
})
