import React from 'react'
import { render, screen } from 'test-utils/react'
import SketchContainer from './index'
import useProductData from 'toro/hooks/useProductData'

jest.mock('toro/hooks/useProductData', () => jest.fn())

jest.mock('toro/components/Flex', () => (props: any) => (
  <div data-qa="sketch-container" {...props} />
))

jest.mock('toro/components/HtmlContent', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-qa="sketch-html-content">{content}</div>,
}))

jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  SketchContainer: {},
}))

const renderComponent = (tuple: [string | undefined, boolean | undefined]) => {
  jest.mocked(useProductData).mockReturnValue(tuple)
  return render(<SketchContainer />)
}

describe('SketchContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requests markup and online flag from product data', () => {
    renderComponent([undefined, undefined])

    expect(useProductData).toHaveBeenCalledWith([
      'contentAreaPDPv7SketchShot.c_body.default.markup',
      'contentAreaPDPv7SketchShot.online.default',
    ])
  })

  it('returns null when markup and online are missing', () => {
    renderComponent([undefined, undefined])

    expect(screen.queryByTestId('sketch-container')).not.toBeInTheDocument()
  })

  it('returns null when asset is offline', () => {
    renderComponent(['<p>sketch</p>', false])

    expect(screen.queryByTestId('sketch-container')).not.toBeInTheDocument()
  })

  it('returns null when markup is empty or whitespace', () => {
    renderComponent(['   ', true])

    expect(screen.queryByTestId('sketch-container')).not.toBeInTheDocument()
  })

  it('renders HtmlContent when online and markup is present', () => {
    renderComponent(['<section class="media-asset-wrapper">x</section>', true])

    expect(screen.getByTestId('sketch-container')).toBeInTheDocument()
    expect(screen.getByTestId('sketch-html-content')).toHaveTextContent(
      '<section class="media-asset-wrapper">x</section>'
    )
  })
})
