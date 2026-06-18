import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductColorControl from 'toro/components/product/ProductVariationControls/ProductColorControl'

jest.mock('toro/components/ColorButton', () => ({
  __esModule: true,
  default: jest.fn((props: any) => {
    return (
      <div onClick={() => props.onClick()} data-qa="color-button">
        Color Button
      </div>
    )
  }),
}))

const mockOnClick = jest.fn()
const defaultProps = {
  color: {
    image: {
      src: 'http://image.jpg',
      alt: 'Color image',
    },
  },
  selected: false,
  disabled: false,
  onClick: mockOnClick,
  styles: {
    colorButton: { background: 'red' },
  },
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}
const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ProductColorControl {...combinedProps} />, renderOptions)
}

describe('ProductColorControl', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with default props without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('color-button')).toBeVisible()
  })

  it('renders the component and calls onClick props when user clicks on the button', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup()
    const target = getByTestId('color-button')
    await user.click(target)
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('renders the component without crashing when color is not present', () => {
    const { getByTestId } = makeSetup({ color: null })
    expect(getByTestId('color-button')).toBeVisible()
  })

  it('renders the component without crashing when selected is true', () => {
    const { getByTestId } = makeSetup({ selected: true })
    expect(getByTestId('color-button')).toBeVisible()
  })

  it('renders the component without crashing when disabled is true', () => {
    const { getByTestId } = makeSetup({ disabled: true })
    expect(getByTestId('color-button')).toBeVisible()
  })

  it('renders the component without crashing when onClick prop is not passed and uses onClick from default propTypes when user clicks the button', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup({ onClick: undefined })
    const target = getByTestId('color-button')
    expect(target).toBeVisible()
    await user.click(target)
  })
})
