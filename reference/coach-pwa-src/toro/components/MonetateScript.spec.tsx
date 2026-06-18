import Head from 'next/head'
import { render } from 'test-utils/react'
import usePageType from 'toro/hooks/usePageType'
import usePreference from 'toro/hooks/usePreference_new'
import useTemplate from 'toro/hooks/useTemplate'
import MonetateScript from 'toro/components/MonetateScript'

const basePageTypeFlags: ReturnType<typeof usePageType> = {
  isHP: false,
  isPLP: false,
  isPDP: false,
  isSRP: false,
  isContentPage: false,
  isProductPassport: false,
  isRetailHP: false,
  isSubHP: false,
  isOutletHP: false,
}

// Need to mock next/head, to avoid injecting script into head element.
const MockedHeadComponent = ({ children }) => <div>{children}</div>
jest.mock('next/head')
// Keep next/script in the test container so cleanup removes it between tests (real Next
// `Script` can leave nodes outside the rendered tree).
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ src }: { src: string }) =>
    src ? <script src={src} data-qa="monetate-script" /> : null,
}))
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/usePageType', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isHP: false,
    isPLP: false,
    isPDP: false,
    isSRP: false,
    isContentPage: false,
    isProductPassport: false,
    isRetailHP: false,
    isSubHP: false,
    isOutletHP: false,
  })),
}))
jest.mock('toro/hooks/useTemplate', () => ({
  __esModule: true,
  default: jest.fn(() => false),
}))
jest.mocked(Head).mockImplementation(MockedHeadComponent)

const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
const mockedUseTemplate = useTemplate as jest.MockedFn<typeof useTemplate>

const makeSetup = (customRenderOptions) => {
  return render(<MonetateScript />, customRenderOptions)
}

describe('toro/components/MonetateScript', () => {
  afterEach(() => {
    jest.resetAllMocks()
    mockedUsePageType.mockImplementation(() => ({ ...basePageTypeFlags }))
    mockedUseTemplate.mockImplementation(() => false)
  })

  it('should return null when the script URL is not defined', () => {
    mockedUsePreference.mockImplementation(() => ({
      monetate: { monetateScriptUrl: null },
      toggleSiteFeatures: { enableMonetate: true },
    }))
    makeSetup({ contexts: { PWAContext: { appData: {} } } })
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('should return null when enableMonetate is false', () => {
    mockedUsePreference.mockImplementation(() => ({
      monetate: { monetateScriptUrl: '/mock/monetate/script/url' },
      toggleSiteFeatures: { enableMonetate: false },
    }))
    makeSetup({ contexts: { PWAContext: { appData: {} } } })
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('should return the script when the script URL is defined and enableMonetate is true', () => {
    mockedUsePreference.mockImplementation(() => ({
      monetate: { monetateScriptUrl: '/mock/monetate/script/url' },
      toggleSiteFeatures: { enableMonetate: true },
    }))
    makeSetup({ contexts: { PWAContext: { appData: {} } } })
    expect(document.querySelector('script')).toBeInTheDocument()
  })

  it('should return null on PDP v7 even when Monetate is enabled and URL is set', () => {
    mockedUsePageType.mockImplementation(() => ({ ...basePageTypeFlags, isPDP: true }))
    mockedUseTemplate.mockImplementation(() => true)
    mockedUsePreference.mockImplementation(() => ({
      monetate: { monetateScriptUrl: '/mock/monetate/script/url' },
      toggleSiteFeatures: { enableMonetate: true },
    }))
    makeSetup({ contexts: { PWAContext: { appData: {} } } })
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('should load Monetate on non-PDP routes even when useTemplate reports PDP v7', () => {
    mockedUsePageType.mockImplementation(() => ({ ...basePageTypeFlags }))
    mockedUseTemplate.mockImplementation(() => true)
    mockedUsePreference.mockImplementation(() => ({
      monetate: { monetateScriptUrl: '/mock/monetate/script/url' },
      toggleSiteFeatures: { enableMonetate: true },
    }))
    makeSetup({ contexts: { PWAContext: { appData: {} } } })
    expect(document.querySelector('script[data-qa="monetate-script"]')).toBeInTheDocument()
  })
})
