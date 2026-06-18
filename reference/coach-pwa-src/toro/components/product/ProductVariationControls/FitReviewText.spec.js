import React from 'react'
import { render } from '@testing-library/react'
import { queryAllByAttribute } from '@testing-library/dom'
import * as utils from 'jotai/utils'
import FitReviewText from './FitReviewText'

jest.mock('toro/hooks/useMultiStyleConfig', () => {
  return jest.fn().mockImplementation(() => ({
    fitReviewText: () => ({}),
  }))
})

describe('FitReviewText', () => {
  const mockLabel = 'size'
  const mockIsSticky = true

  it('renders without errors', () => {
    render(<FitReviewText label={mockLabel} isSticky={mockIsSticky} />)
  })

  it('renders null when fitReviewText is empty', () => {
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce('')
    const { container } = render(<FitReviewText label={mockLabel} isSticky={mockIsSticky} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the correct label data-qa attribute for size label', () => {
    const mockFitReviewText = 'Run true to size'
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(mockFitReviewText)
    const { container } = render(<FitReviewText label="size" isSticky={mockIsSticky} />)
    const queryByDataQa = queryAllByAttribute.bind(null, 'data-qa')
    const element = queryByDataQa(container, 'cm_txt_pdt_label_fitreviewsize')
    expect(element.length).toBeGreaterThan(0)
  })

  it('renders the correct label data-qa attribute for width label', () => {
    const mockFitReviewText = 'Run true to width'
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(mockFitReviewText)
    const { container } = render(<FitReviewText label="width" isSticky={mockIsSticky} />)
    const queryByDataQa = queryAllByAttribute.bind(null, 'data-qa')
    const element = queryByDataQa(container, 'cm_txt_pdt_label_fitreviewwidth')
    expect(element.length).toBeGreaterThan(0)
  })

  it('renders the fitReviewText when not empty', () => {
    const mockVariantType = 'size'
    const mockFitReviewText = { [mockVariantType]: 'Run True Size.' }
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(mockFitReviewText)
    const { getByText } = render(
      <FitReviewText label={mockLabel} variantType={mockVariantType} isSticky={mockIsSticky} />
    )
    const element = getByText(mockFitReviewText[mockVariantType])
    expect(element).toBeInTheDocument()
  })
})
