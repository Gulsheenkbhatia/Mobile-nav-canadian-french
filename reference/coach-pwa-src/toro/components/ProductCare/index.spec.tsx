import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductCare from './index'

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ isMobile: true }),
}))
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})
const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      session: {},
    },
  },
}

describe('ProductCare Component', () => {
  const html = '<p>Some HTML content</p>'
  const items = [
    {
      title: '<h3>Item 1</h3>',
      content: '<p>Item 1 Content</p>',
      nestedItems: [
        {
          title: '<h4>Nested Item 1</h4>',
          content: '<p>Nested Item 1 Content</p>',
        },
      ],
    },
    {
      title: '<h3>Item 2</h3>',
      content: '<p>Item 2 Content</p>',
    },
  ]

  it('renders minimal content when both html and items are not provided', () => {
    const { container } = render(<ProductCare />, renderOptions)
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('renders HtmlContent when html is provided and accordion is false', () => {
    const { getByText } = render(<ProductCare html={html} accordion={false} />, renderOptions)
    expect(getByText('Some HTML content')).toBeVisible()
  })

  it('does not render HtmlContent when accordion is true and items are provided', () => {
    const { queryByText } = render(
      <ProductCare html={html} items={items} accordion={true} />,
      renderOptions
    )
    expect(queryByText('Some HTML content')).not.toBeInTheDocument()
  })
  it('renders all accordion items with correct titles and content', async () => {
    const user = userEvent.setup()
    const mockItems = [
      { title: 'Item 1', content: 'Content 1' },
      { title: 'Item 2', content: 'Content 2' },
      {
        title: 'Item 3',
        nestedItems: [
          { title: 'Nested Item 1', content: 'Nested Content 1' },
          { title: 'Nested Item 2', content: 'Nested Content 2' },
        ],
      },
    ]

    const { getByText } = render(<ProductCare accordion={true} items={mockItems} />, renderOptions)

    mockItems.map(async (item) => {
      expect(getByText(item.title)).toBeVisible()

      if (item.nestedItems) {
        user.click(getByText(item.title))

        await waitFor(() => {
          item.nestedItems.forEach((nestedItem) => {
            expect(getByText(nestedItem.title)).toBeVisible()
          })
        })
      }
    })
  })
  it('renders an empty Flex div when accordion is false or items are not provided', () => {
    const { container: container1 } = render(
      <ProductCare accordion={false} items={[]} />,
      renderOptions
    )
    expect(container1.firstChild).toBeEmptyDOMElement()
  })
  it('renders content directly when nestedItems is false or not provided', () => {
    const mockItems = [
      { title: 'Item 1', content: 'Content 1' },
      { title: 'Item 2', content: 'Content 2', nestedItems: false },
    ]

    const { getByText, queryByText } = render(
      <ProductCare accordion={true} items={mockItems} />,
      renderOptions
    )

    mockItems.forEach((item) => {
      expect(getByText(item.title)).toBeVisible()
    })

    expect(queryByText('Nested Item 1')).not.toBeInTheDocument()
  })
})
