import React from 'react'
import { render, screen } from 'test-utils/react'
import WaysToWear from './index'
import useProductData from 'toro/hooks/useProductData'

jest.mock('toro/hooks/useProductData', () => jest.fn())

jest.mock('toro/components/Flex', () => (props: any) => (
  <div data-qa="ways-to-wear-container" {...props} />
))

jest.mock('toro/components/HtmlContent', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-qa="ways-to-wear-container-asset">{content}</div>
  ),
}))

jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  WaysToWear: {},
}))

type MockTuple = [string | undefined, boolean | undefined, string | number | undefined | null]

const renderComponent = (tuple: MockTuple) => {
  jest.mocked(useProductData).mockReturnValue(tuple)
  return render(<WaysToWear />)
}

describe('WaysToWear', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requests markup, online flag, and asset id from product data', () => {
    renderComponent([undefined, undefined, undefined])

    expect(useProductData).toHaveBeenCalledWith([
      'waysToWearContent.c_body.default.markup',
      'waysToWearContent.online.default',
      'waysToWearContent.id',
    ])
  })

  it('returns null when markup and online are missing', () => {
    renderComponent([undefined, undefined, undefined])

    expect(screen.queryByTestId('ways-to-wear-container')).not.toBeInTheDocument()
  })

  it('returns null when asset is offline', () => {
    renderComponent(['<p>wtw</p>', false, 'wtw-slot'])

    expect(screen.queryByTestId('ways-to-wear-container')).not.toBeInTheDocument()
  })

  it('returns null when markup is empty or whitespace', () => {
    renderComponent(['   ', true, 'wtw-slot'])

    expect(screen.queryByTestId('ways-to-wear-container')).not.toBeInTheDocument()
  })

  it('renders HtmlContent when online and markup is present', () => {
    renderComponent(['<section class="media-asset-wrapper">x</section>', true, 'asset-123'])

    expect(screen.getByTestId('ways-to-wear-container')).toBeInTheDocument()
    expect(screen.getByTestId('ways-to-wear-container')).toHaveAttribute('id', 'asset-123')
    expect(screen.getByTestId('ways-to-wear-container-asset')).toHaveTextContent(
      '<section class="media-asset-wrapper">x</section>'
    )
  })
})
