import { render, screen } from 'test-utils/react'
import TabbedContentModule, { TabbedContentAttribute } from './index'
import useProductData from 'toro/hooks/useProductData'

jest.mock('toro/hooks/useProductData')

jest.mock('toro/components/HtmlContent', () => {
  return {
    __esModule: true,
    default: ({ content, lazyLoadImages, lazyLoadVideos, ...props }) => (
      <div data-lazy-images={lazyLoadImages} data-lazy-videos={lazyLoadVideos} {...props}>
        {content}
      </div>
    ),
  }
})

const mockUseProductData = jest.mocked(useProductData)

describe('TabbedContentModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when content is available and product is online', () => {
    const mockHtmlMarkup = '<div>Sample tabbed content</div>'

    beforeEach(() => {
      mockUseProductData.mockReturnValue([mockHtmlMarkup, true])
    })

    it('renders HtmlContent for module ONE', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      const content = screen.getByTestId('tabbed-content-tabbedContentModule1')

      expect(content).toBeVisible()
      expect(content).toHaveTextContent('Sample tabbed content')
      expect(content).toHaveAttribute('data-qa', 'tabbed-content-tabbedContentModule1')
    })

    it('renders HtmlContent for module TWO', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.TWO} />)

      const content = screen.getByTestId('tabbed-content-tabbedContentModule2')

      expect(content).toBeVisible()
      expect(content).toHaveTextContent('Sample tabbed content')
      expect(content).toHaveAttribute('data-qa', 'tabbed-content-tabbedContentModule2')
    })

    it('calls useProductData with correct paths for module ONE', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      expect(mockUseProductData).toHaveBeenCalledWith([
        'tabbedContentModule1.c_body.default.markup',
        'tabbedContentModule1.online.default',
      ])
    })

    it('calls useProductData with correct paths for module TWO', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.TWO} />)

      expect(mockUseProductData).toHaveBeenCalledWith([
        'tabbedContentModule2.c_body.default.markup',
        'tabbedContentModule2.online.default',
      ])
    })
  })

  describe('when content should not render', () => {
    it('returns null when product is offline', () => {
      mockUseProductData.mockReturnValue(['<div>Content</div>', false])

      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      expect(screen.queryByTestId('tabbed-content-tabbedContentModule1')).not.toBeInTheDocument()
    })

    it.each([
      ['null', null],
      ['undefined', undefined],
      ['empty string', ''],
      ['whitespace only', '   \n\t  '],
    ])('returns null when htmlMarkup is %s', (_, value) => {
      mockUseProductData.mockReturnValue([value as any, true])

      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      expect(screen.queryByTestId('tabbed-content-tabbedContentModule1')).not.toBeInTheDocument()
    })
  })

  describe('HtmlContent integration', () => {
    beforeEach(() => {
      mockUseProductData.mockReturnValue(['<p>Rich content</p>', true])
    })

    it('passes content prop to HtmlContent', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      const content = screen.getByTestId('tabbed-content-tabbedContentModule1')

      expect(content).toHaveTextContent('Rich content')
    })

    it('enables lazy loading for images and videos', () => {
      render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)

      const content = screen.getByTestId('tabbed-content-tabbedContentModule1')

      expect(content).toHaveAttribute('data-lazy-images', 'true')
      expect(content).toHaveAttribute('data-lazy-videos', 'true')
    })
  })

  describe('Stability', () => {
    it('does not throw on unexpected hook output', () => {
      mockUseProductData.mockReturnValue([undefined, false])

      expect(() =>
        render(<TabbedContentModule moduleId={TabbedContentAttribute.ONE} />)
      ).not.toThrow()
    })
  })
})
