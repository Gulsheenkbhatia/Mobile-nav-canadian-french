import { render } from 'test-utils/react'
import ComparablePrice from './index'

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: {
      'pdp.product.comparableValueText': 'Comparable Value',
    },
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

describe('ComparablePrice Component', () => {
  it('should render correctly when listPrice is provided with price in dollar', () => {
    const { getByText } = render(<ComparablePrice listPrice="$100" />)

    expect(getByText('Comparable Value')).toBeVisible()
    expect(getByText('$100')).toBeVisible()
  })

  it('should render correctly when listPrice is provided with price in Euro', () => {
    const { getByText } = render(<ComparablePrice listPrice="€150" />)

    expect(getByText('Comparable Value')).toBeVisible()
    expect(getByText('€150')).toBeVisible()
  })

  it('should not render when listPrice is not provided', () => {
    const { container } = render(<ComparablePrice variant="default" />)
    expect(container.querySelector('.pdp-comparable-price')).toBeNull()
  })
})
