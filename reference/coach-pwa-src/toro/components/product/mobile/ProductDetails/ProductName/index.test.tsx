import React from 'react'
import { render, screen } from 'test-utils/react'
import ProductName from 'toro/components/product/mobile/ProductDetails/ProductName'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useAtomValue } from 'jotai/utils'

// Mock hooks
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useStyleConfig')
jest.mock('jotai/utils')

// Mock components — preserve polymorphic `as` so heading semantics are testable (Chakra-style)
jest.mock('toro/components/Box', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- jest.mock factory is hoisted; React must be required here
  const React = require('react')
  return function MockBox({ children, as: Tag = 'div', sx: _sx, ...rest }) {
    return React.createElement(Tag, rest, children)
  }
})
jest.mock('toro/components/Text', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- jest.mock factory is hoisted; React must be required here
  const React = require('react')
  return function MockText({ children, as: Tag = 'span', sx: _sx, display, style, ...rest }) {
    const props = {
      ...rest,
      ...(display === 'block' ? { style: { ...style, display: 'block' } } : {}),
      ...(display !== 'block' && style ? { style } : {}),
    }
    return React.createElement(Tag, props, children)
  }
})

const mockedUseProductData = jest.mocked(useProductData)
const mockedUsePreference = jest.mocked(usePreference)
const mockedUseStyleConfig = jest.mocked(useStyleConfig)
const mockedUseAtomValue = jest.mocked(useAtomValue)

// Test constants
const TEST_PRODUCT_NAMES = {
  SIMPLE: 'Simple Product Name',
  WITH_DELIMITER: 'Tote Bag with Charm',
  IN_DELIMITER: 'Wallet in Leather',
  FEATURE_DELIMITER: 'Product with Feature',
  BAG_WITH_CHARM: 'Bag with Charm',
} as const

const TEST_LOCALES = {
  EN_US_DASH: 'en-US',
  EN_US_UNDERSCORE: 'en_US',
  EN_CA: 'en-CA',
} as const

type Locale = typeof TEST_LOCALES[keyof typeof TEST_LOCALES] | null

// Helper functions
const renderProductName = (locale: Locale = TEST_LOCALES.EN_US_DASH) => {
  mockedUseAtomValue.mockReturnValue(locale)
  return render(<ProductName />)
}

const expectProductNameNotRendered = (container: HTMLElement) => {
  expect(container.querySelector('[data-qa="pdp_txt_pdt_title"]')).toBeNull()
}

const expectTitleAndSubtitle = (title: string, subtitle: string) => {
  expect(screen.getByText(title)).toBeVisible()
  expect(screen.getByText(subtitle)).toBeVisible()
}

/** Product title must be a single h1; subtitle stays phrasing flow inside that h1 */
const expectProductTitleHeading = (options: {
  fullAccessibleName: string | RegExp
  titleSegment?: string
  subtitleSegment?: string
}) => {
  const heading = screen.getByRole('heading', { level: 1, name: options.fullAccessibleName })
  expect(heading).toBeVisible()
  expect(heading.tagName).toBe('H1')
  expect(heading).toHaveAttribute('data-qa', 'pdp_txt_pdt_title')

  const spans = heading.querySelectorAll('span')
  if (options.titleSegment !== undefined) {
    expect(spans.length).toBeGreaterThanOrEqual(1)
    expect(spans[0].textContent).toBe(options.titleSegment)
  }
  if (options.subtitleSegment !== undefined) {
    expect(spans.length).toBe(2)
    expect(spans[1].textContent).toBe(options.subtitleSegment)
    expect(spans[1]).toHaveStyle({ display: 'block' })
  }
}

describe('ProductName', () => {
  const MOCK_SEPARATORS = {
    [TEST_LOCALES.EN_US_DASH]: { delimiters: ['with', 'in'] },
    [TEST_LOCALES.EN_CA]: { delimiters: ['with', 'in'] },
    [TEST_LOCALES.EN_US_UNDERSCORE]: { delimiters: ['with', 'in'] },
  }

  beforeEach(() => {
    mockedUsePreference.mockReturnValue({
      toggleSiteFeatures: {
        productNameSeparators: MOCK_SEPARATORS,
      },
    })
    mockedUseStyleConfig.mockReturnValue({
      productName: {},
      productSubtitle: {},
    })
    // Reset the atom mock before each test
    mockedUseAtomValue.mockReturnValue(TEST_LOCALES.EN_US_DASH)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when product name is not available', () => {
    it('should return null', () => {
      mockedUseProductData.mockReturnValue(null)

      const { container } = renderProductName()

      expectProductNameNotRendered(container)
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })
  })

  describe('when product name is available', () => {
    it('should render product name without subtitle when no delimiters are found', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.SIMPLE)

      renderProductName()

      expect(screen.getByText(TEST_PRODUCT_NAMES.SIMPLE)).toBeVisible()
      expect(screen.queryByText('with')).toBeNull()
    })

    it('should render title and subtitle when delimiter "with" is found', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.WITH_DELIMITER)

      renderProductName()

      expectTitleAndSubtitle('Tote Bag', 'with Charm')
    })

    it('should render title and subtitle when delimiter "in" is found', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.IN_DELIMITER)

      renderProductName()

      expectTitleAndSubtitle('Wallet', 'in Leather')
    })

    it('should split at earliest delimiter position regardless of config order', () => {
      // Test the main bug fix: "in" appears before "with" in text but "with" is first in config
      mockedUseProductData.mockReturnValue('Product in Canvas with Leather')

      renderProductName()

      // Should split at "in" (position ~8) not "with" (position ~18)
      expectTitleAndSubtitle('Product', 'in Canvas with Leather')
    })
  })

  describe('when locale is not available', () => {
    it('should render full product name as title when locale is missing', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.FEATURE_DELIMITER)

      renderProductName(null)

      expect(screen.getByText(TEST_PRODUCT_NAMES.FEATURE_DELIMITER)).toBeVisible()
      expect(screen.queryByText('with Feature')).toBeNull()
    })
  })

  describe('locale format handling', () => {
    it('should handle locale with dash format when config uses dash format', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.BAG_WITH_CHARM)

      renderProductName(TEST_LOCALES.EN_US_DASH)

      expectTitleAndSubtitle('Bag', 'with Charm')
    })

    it('should handle locale with underscore by converting to dash format', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.BAG_WITH_CHARM)

      renderProductName(TEST_LOCALES.EN_US_UNDERSCORE)

      expectTitleAndSubtitle('Bag', 'with Charm')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string product name', () => {
      mockedUseProductData.mockReturnValue('')

      const { container } = renderProductName()

      expectProductNameNotRendered(container)
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })
  })

  describe('heading semantics and accessibility', () => {
    it('should expose the product name as a single level-1 heading when there is no subtitle', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.SIMPLE)

      renderProductName()

      expectProductTitleHeading({
        fullAccessibleName: TEST_PRODUCT_NAMES.SIMPLE,
        titleSegment: TEST_PRODUCT_NAMES.SIMPLE,
      })
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.querySelectorAll('span')).toHaveLength(1)
    })

    it('should keep title and subtitle as phrasing content inside one h1 when split by delimiter', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.WITH_DELIMITER)

      renderProductName()

      expectProductTitleHeading({
        fullAccessibleName: 'Tote Bag with Charm',
        titleSegment: 'Tote Bag',
        subtitleSegment: 'with Charm',
      })
    })

    it('should use one h1 with full name as accessible name when locale is missing (no split)', () => {
      mockedUseProductData.mockReturnValue(TEST_PRODUCT_NAMES.FEATURE_DELIMITER)

      renderProductName(null)

      expectProductTitleHeading({
        fullAccessibleName: TEST_PRODUCT_NAMES.FEATURE_DELIMITER,
        titleSegment: TEST_PRODUCT_NAMES.FEATURE_DELIMITER,
      })
      expect(screen.getByRole('heading', { level: 1 }).querySelectorAll('span')).toHaveLength(1)
    })
  })
})
