import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import CustomizeRemovalModal from 'toro/components/product/CustomizeRemovalModal'
import { getRecipeDataFromStorage, setItem } from 'toro/helpers/customizationStorage'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/helpers/customizationStorage')
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

const mockUseViewportType = useViewportType as jest.MockedFunction<typeof useViewportType>
const mockUseAnalytics = useAnalytics as jest.MockedFunction<typeof useAnalytics>
const mockGetRecipeDataFromStorage = getRecipeDataFromStorage as jest.Mock
const mockSetItem = setItem as jest.Mock

const renderComponent = (props) => {
  return {
    ...render(<CustomizeRemovalModal {...props} />),
    user: userEvent.setup({ delay: null }),
  }
}

describe('CustomizeRemovalModal', () => {
  beforeEach(() => {
    mockUseViewportType.mockReturnValue({
      isMobile: false,
      isDesktop: true,
      isTablet: false,
    })
    mockUseAnalytics.mockReturnValue({
      send: jest.fn(),
    })
    mockGetRecipeDataFromStorage.mockReturnValue({})
    mockSetItem.mockImplementation(jest.fn())
  })

  it('should render the modal with correct text', async () => {
    const { getByText } = renderComponent({})
    await waitFor(() => {
      expect(getByText('Remove Customization')).toBeVisible()
      expect(getByText('Are you sure you would like to remove this customization?')).toBeVisible()
      expect(getByText('NO GO BACK')).toBeVisible()
      expect(getByText('YES')).toBeVisible()
    })
  })

  it('should call onCloseProp when the modal close button is clicked', async () => {
    const onCloseProp = jest.fn()
    const { user, getByRole } = renderComponent({ onClose: onCloseProp })

    await user.click(getByRole('button', { name: /close/i }))
    expect(onCloseProp).toHaveBeenCalled()
  })

  it('should call onBack when "NO GO BACK" button is clicked', async () => {
    const setCustomizeModal = jest.fn()
    const { user, getByText } = renderComponent({ setCustomizeModal })

    await user.click(getByText('NO GO BACK'))
    expect(setCustomizeModal).toHaveBeenCalledWith(false)
  })

  it('should call onLeave when "YES" button is clicked', async () => {
    const customizeModal = { item: { id: '1' } }
    const items = [{ id: '1' }, { id: '2' }]
    const setCustomizerVariants = jest.fn()
    const setFilterItems = jest.fn()
    const setSelectedColor = jest.fn()
    const setCustomizeModal = jest.fn()

    const { user, getByText } = renderComponent({
      customizeModal,
      items,
      setCustomizerVariants,
      setFilterItems,
      setSelectedColor,
      setCustomizeModal,
    })

    await user.click(getByText('YES'))
    expect(setCustomizerVariants).toHaveBeenCalled()
    expect(setFilterItems).toHaveBeenCalled()
    expect(setSelectedColor).toHaveBeenCalled()
    expect(setCustomizeModal).toHaveBeenCalledWith({ item: undefined, value: false })
  })
})
