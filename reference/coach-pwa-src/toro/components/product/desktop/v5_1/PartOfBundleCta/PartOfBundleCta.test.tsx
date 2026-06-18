import { render } from 'test-utils/react'
import PartOfBundleCta from './index'

import usePreferenceNew from 'toro/hooks/usePreference_new'
import useProductData from 'toro/hooks/useProductData'
import { BUNDLE_CTA_DATA_QA_ID } from 'toro/components/product/desktop/v5_1/PartOfBundleCta/constants'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useProductData')

const mockUsePreferenceNew = jest.mocked(usePreferenceNew)
const mockUseProductData = jest.mocked(useProductData)

const bundleMockData = {
  bundleUrl: '/bundles/abc',
  bundleMsg: 'Part of a bundle',
  bundleLinkText: 'View bundle',
  bundleContentImages: {
    images: [{ absURL: 'https://img.example/1.jpg', alt: 'Bundle Image' }],
  },
}

describe('PartOfBundleCta', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders component when bundle data present and feature flag enabled', () => {
    mockUsePreferenceNew.mockReturnValue({ toggleSiteFeatures: { showBundleOnPLP: true } })
    mockUseProductData.mockReturnValue(bundleMockData)
    const { getByTestId, getByAltText } = render(<PartOfBundleCta />)

    const link = getByTestId(BUNDLE_CTA_DATA_QA_ID)
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/bundles/abc')
    expect(link).toHaveAttribute('aria-label', 'View bundle')
    expect(link).toHaveTextContent('Part of a bundle')
    expect(getByAltText('Bundle Image')).toBeInTheDocument()
  })

  it('renders nothing when no bundle data and feature flag disabled', () => {
    mockUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { showBundleOnPLP: false },
    })
    mockUseProductData.mockReturnValue(null)
    const { queryByTestId } = render(<PartOfBundleCta />)

    expect(queryByTestId(BUNDLE_CTA_DATA_QA_ID)).not.toBeInTheDocument()
  })

  it('renders nothing when no bundle data and feature flag enabled', () => {
    mockUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { showBundleOnPLP: true },
    })
    mockUseProductData.mockReturnValue(null)
    const { queryByTestId } = render(<PartOfBundleCta />)

    expect(queryByTestId(BUNDLE_CTA_DATA_QA_ID)).not.toBeInTheDocument()
  })

  it('renders nothing when bundle data present and feature flag disabled', () => {
    mockUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { showBundleOnPLP: false },
    })
    mockUseProductData.mockReturnValue(bundleMockData)
    const { queryByTestId } = render(<PartOfBundleCta />)

    expect(queryByTestId(BUNDLE_CTA_DATA_QA_ID)).not.toBeInTheDocument()
  })
})
