import NotifyMeProductDetails from 'toro/components/product/NotifyMeWidget/NotifyMeProductDetails'
import { useAtomValue } from 'jotai/utils'
import { render, screen } from 'test-utils/react'
import { mockIntersectionObserver } from 'test-utils/mock-utils'

mockIntersectionObserver()
jest.mock('jotai/utils', () => {
  const actual = jest.requireActual('jotai/utils')
  return {
    ...actual,
    useAtomValue: jest.fn(),
  }
})

const mockedUseAtomValue = jest.mocked(useAtomValue)

const productDetails = {
  productName: 'Test product',
  productColor: 'Black/Chalk',
  productImageSrc: 'test-image-src',
  productSize: '7',
  productPrice: '$100.00',
}

describe('NotifyMeProductDetails', () => {
  const setup = (props = { styles: {}, lazy: false }) => {
    return render(<NotifyMeProductDetails {...props} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if product details are not available', () => {
    mockedUseAtomValue.mockReturnValue(null)
    setup()
    const productImage = screen.queryByRole('img')
    expect(productImage).not.toBeInTheDocument()
  })

  it('should render product image', () => {
    mockedUseAtomValue.mockReturnValue(productDetails)
    setup()
    const productImage = screen.getByRole('img')
    expect(productImage).toBeVisible()
    expect(productImage).toHaveAttribute('src', productDetails.productImageSrc)
  })

  it('should render product name, price, color, and size', () => {
    mockedUseAtomValue.mockReturnValue(productDetails)
    setup()

    const productName = screen.getByText(productDetails.productName)
    expect(productName).toBeVisible()
    const productPrice = screen.getByText(productDetails.productPrice)
    expect(productPrice).toBeVisible()
    const productColor = screen.getByText((content) =>
      content.includes(productDetails.productColor)
    )
    expect(productColor).toBeVisible()
    const productSize = screen.queryByText((content) =>
      content.includes(`Size ${productDetails.productSize}`)
    )
    expect(productSize).toBeVisible()
  })

  it('should not render size if not provided', () => {
    mockedUseAtomValue.mockReturnValue({
      ...productDetails,
      productSize: undefined,
    })
    setup()

    const productSize = screen.queryByText((content) =>
      content.includes(`Size ${productDetails.productSize}`)
    )
    expect(productSize).not.toBeInTheDocument()
  })
})
