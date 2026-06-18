import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ShowMoreLessControl from 'toro/components/product/ProductVariationControls/ShowMoreLessControl'

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})
jest.mock('toro/components/product/ProductVariationControls/ShowMoreShowLess', () => {
  return ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button data-qa="show_more_less" onClick={onClick}>
      {text}
    </button>
  )
})

const mockSetShowMore = jest.fn()

const defaultProps = {
  items: ['a', 'b', 'c', 'd', 'e'],
  isShowMore: false,
  setShowMore: mockSetShowMore,
  maxSwatch: 3,
  isQuickView: false,
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
  return render(<ShowMoreLessControl {...combinedProps} />, renderOptions)
}

describe('ShowMoreLessControl', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with default props without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('show_more_less')).toBeVisible()
  })

  it('should render null when items length is less than maxSwatch', () => {
    const { queryByTestId } = makeSetup({ maxSwatch: 6 })
    expect(queryByTestId('show_more_less')).toBeNull()
  })

  it('should display "+N More" text when isShowMore is true and items length >= maxSwatch', () => {
    const { getByTestId } = makeSetup({ isShowMore: true })
    const moreCount = defaultProps.items.length - defaultProps.maxSwatch + 1
    expect(getByTestId('show_more_less')).toHaveTextContent(`+${moreCount} More`)
  })

  it('should call setShowMore function with toggled value when clicked', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup()
    const target = getByTestId('show_more_less')
    await user.click(target)
    expect(mockSetShowMore).toHaveBeenCalledWith(true)
  })
})
