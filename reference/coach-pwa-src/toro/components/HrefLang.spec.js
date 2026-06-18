import Head from 'next/head'
import HrefLangs, { getHrefLinksArray, deriveHreflangs } from 'toro/components/HrefLangs'
import { render, screen } from 'test-utils/react'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'

const MockedHeadComponent = ({ children }) => <div data-qa="head-next">{children}</div>
jest.mock('next/head')
jest.mocked(Head).mockImplementation(MockedHeadComponent)

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = jest.mocked(usePreference)

const mockPathURL = 'mock-url'

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: `/${mockPathURL}`,
    }),
  }
})

const generateBaseURLsForLocales = (siteName = 'example') => ({
  fr_CA: {
    sitename: `Sites-${siteName}`,
    hostname: `${siteName}.com`,
    targetlocale: '/fr/',
  },
  en_CA: {
    sitename: `Sites-${siteName}`,
    hostname: `${siteName}.com`,
    targetlocale: '/en/',
  },
  en_US: {
    sitename: `Sites-${siteName}`,
    hostname: `${siteName}.com`,
    targetlocale: '/en/',
  },
})

const generateCustomHreflangMock = (siteName = 'example') => `
<link rel="alternate" hreflang="x-default" href="https://${siteName}.com" />
<link rel="alternate" hreflang="fr-CA" href="https://${siteName}.com/fr" />
<link rel="alternate" hreflang="en-CA" href="https://${siteName}.com/en" />
<link rel="alternate" hreflang="en-US" href="https://${siteName}.com" />
`

/**
 * Extracts href and hreflang attributes from a string containing hreflang link tags.
 * @param {string} html - HTML string containing hreflang link tags.
 * @returns {Array<{href: string, hreflang: string}>} Array of objects containing href and hreflang attributes.
 */
const extractHreflangAttributes = (html) => {
  const regex = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/?>/g
  let match
  const result = []

  while ((match = regex.exec(html)) !== null) {
    const [, hreflang, href] = match
    result.push({ hreflang, href })
  }

  return result
}

const pageDataHP = {
  pageType: 'HP',
}

const pageDataSearch = {
  pageType: 'Search',
}

const pageDataPLP = {
  pageType: 'PLP',
  plpHreflangURL: {
    default: 'https://example.com/shop/men/view-all',
    'fr-CA': 'https://example.com/fr/shop/homme/afficher-tout',
    'en-CA': 'https://example.com/en/shop/men/view-all',
    'en-US': 'https://example.com/shop/men/view-all',
  },
}

const generatePageDataPLP = ({ customHreflang = false, siteName = 'example' }) => ({
  ...pageDataPLP,
  c_customHreflang: customHreflang ? generateCustomHreflangMock(siteName) : null,
})

const generatePageDataPDP = ({
  defaultVariantGroupCustomHreflang = false,
  defaultVariantCustomHreflang = false,
  customHreflang = false,
  siteName = 'example',
}) => ({
  pageType: 'PDP',
  defaultVariantGroup: {
    customAttributes: {
      c_customHreflang: defaultVariantGroupCustomHreflang
        ? generateCustomHreflangMock(siteName)
        : null,
    },
  },
  defaultVariant: {
    customAttributes: {
      c_customHreflang: defaultVariantCustomHreflang ? generateCustomHreflangMock(siteName) : null,
    },
  },
  custom: {
    c_customHreflang: customHreflang ? generateCustomHreflangMock(siteName) : null,
  },
})

describe('HrefLangs', () => {
  it('should render base hreflangs for homepage', () => {
    const links = generateBaseURLsForLocales('coach')

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={pageDataHP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    expect(linkElements.length).toBe(Object.keys(links).length)

    Object.entries(links).forEach(([hreflang, link], index) => {
      const targetLocale = hreflang !== 'en_US' ? get(link, 'targetlocale', '/') : '/'
      const hrefValue = `https://${link.hostname}${targetLocale}${mockPathURL}`
      expect(linkElements[index]).toHaveAttribute('href', hrefValue)
      expect(linkElements[index]).toHaveAttribute('hreflang', hreflang.replace('_', '-'))
    })
  })

  it('should render custom hreflangs for homepage', () => {
    const customLinks = generateCustomHreflangMock('coach')

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: null,
          homePageCustomHreflang: customLinks,
        },
      }
    })
    render(<HrefLangs pageData={pageDataHP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const links = getHrefLinksArray(customLinks).filter((element) => element !== null)

    expect(linkElements.length).toBe(links.length)

    links.forEach((element, index) => {
      expect(element.props.rel).toBe('alternate')
      expect(linkElements[index]).toHaveAttribute('href', element.props.href)
      expect(linkElements[index]).toHaveAttribute('hreflang', element.props.hrefLang)
    })
  })

  it('should not render links on search page', () => {
    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: null,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={pageDataSearch} />)

    const linkElements = document.querySelectorAll('link[rel="alternate"]')

    expect(linkElements.length).toBe(0)
  })

  it('should render base hreflangs for plp', () => {
    const links = generateBaseURLsForLocales('coach')

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={pageDataPLP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const plpHreflangs = deriveHreflangs(pageDataPLP.plpHreflangURL)

    expect(linkElements.length).toBe(plpHreflangs.length)
    plpHreflangs.forEach((link, index) => {
      expect(linkElements[index]).toHaveAttribute('href', link.href)
      expect(linkElements[index]).toHaveAttribute('hreflang', link.language)
    })
  })

  it('should render custom hreflangs for plp', () => {
    const links = generateBaseURLsForLocales('coach')
    const customPageDataPLP = generatePageDataPLP({ customHreflang: true, siteName: 'coach' })

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: customPageDataPLP.c_customHreflang,
        },
      }
    })
    render(<HrefLangs pageData={customPageDataPLP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const hrefValues = extractHreflangAttributes(customPageDataPLP.c_customHreflang)

    expect(linkElements.length).toBe(hrefValues.length)
    linkElements.forEach((link, index) => {
      expect(link).toHaveAttribute('href', hrefValues[index].href)
      expect(link).toHaveAttribute('hreflang', hrefValues[index].hreflang)
    })
  })

  it('should render base hreflangs for pdp', () => {
    const links = generateBaseURLsForLocales('coach')

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={generatePageDataPDP({ siteName: 'coach' })} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    expect(linkElements.length).toBe(Object.keys(links).length)

    Object.entries(links).forEach(([hreflang, link], index) => {
      const targetLocale = hreflang !== 'en_US' ? get(link, 'targetlocale', '/') : '/'
      const hrefValue = `https://${link.hostname}${targetLocale}${mockPathURL}`
      expect(linkElements[index]).toHaveAttribute('href', hrefValue)
      expect(linkElements[index]).toHaveAttribute('hreflang', hreflang.replace('_', '-'))
    })
  })

  it('should render custom hreflangs for pdp', () => {
    const links = generateBaseURLsForLocales('coach')
    const customPageDataPDP = generatePageDataPDP({ customHreflang: true, siteName: 'coach' })

    const customHreflang = customPageDataPDP.custom.c_customHreflang

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={customPageDataPDP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const hrefValues = extractHreflangAttributes(customHreflang)

    expect(linkElements.length).toBe(hrefValues.length)
    linkElements.forEach((link, index) => {
      expect(link).toHaveAttribute('href', hrefValues[index].href)
      expect(link).toHaveAttribute('hreflang', hrefValues[index].hreflang)
    })
  })

  it('should render custom default variant hreflangs for pdp', () => {
    const links = generateBaseURLsForLocales('coach')
    const customPageDataPDP = generatePageDataPDP({
      defaultVariantCustomHreflang: true,
      siteName: 'coach',
    })

    const customHreflang = customPageDataPDP.defaultVariant.customAttributes.c_customHreflang

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={customPageDataPDP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const hrefValues = extractHreflangAttributes(customHreflang)

    expect(linkElements.length).toBe(hrefValues.length)
    linkElements.forEach((link, index) => {
      expect(link).toHaveAttribute('href', hrefValues[index].href)
      expect(link).toHaveAttribute('hreflang', hrefValues[index].hreflang)
    })
  })

  it('should render custom default variant group hreflangs for pdp', () => {
    const links = generateBaseURLsForLocales('coach')
    const customPageDataPDP = generatePageDataPDP({
      defaultVariantGroupCustomHreflang: true,
      siteName: 'coach',
    })

    const customHreflang = customPageDataPDP.defaultVariantGroup.customAttributes.c_customHreflang

    mockedUsePreference.mockImplementation(() => {
      return {
        seoSitePreferences: {
          baseURLsForLocales: links,
          homePageCustomHreflang: null,
        },
      }
    })
    render(<HrefLangs pageData={customPageDataPDP} />)

    const headDiv = screen.getByTestId('head-next')
    const linkElements = headDiv.querySelectorAll('link[rel="alternate"]')

    const hrefValues = extractHreflangAttributes(customHreflang)

    expect(linkElements.length).toBe(hrefValues.length)
    linkElements.forEach((link, index) => {
      expect(link).toHaveAttribute('href', hrefValues[index].href)
      expect(link).toHaveAttribute('hreflang', hrefValues[index].hreflang)
    })
  })
})
