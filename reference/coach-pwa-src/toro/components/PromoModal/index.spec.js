import userEvent from '@testing-library/user-event' // for simulating user interactions
import { waitFor } from '@testing-library/dom' // to wait for async chakraui animations
import { render, screen } from 'test-utils/react'
import PromoModal from './index'

jest.mock('hooks/useGlobalSlotAtomData', () => jest.fn())

const testVisibility = async (selector, testFn = screen.getByTestId, contentElement = '') => {
  if (!contentElement) contentElement = testFn(selector)

  await waitFor(() => {
    expect(contentElement).toBeVisible()
  })
}

describe('PromoModal component', () => {
  it('renders content', async () => {
    require('hooks/useGlobalSlotAtomData').mockReturnValueOnce({
      promoModalContent: '<p>content</p>',
    })

    render(<PromoModal isOpen={true} onClose={() => {}} />)
    const contentElement = screen.getByText(/content/i)

    await testVisibility('dialog', screen.getByRole, contentElement)
  })

  it('does not render anything when promoModalContent is undefined', () => {
    require('hooks/useGlobalSlotAtomData').mockReturnValueOnce({})

    const { queryByText } = render(<PromoModal isOpen={true} onClose={() => {}} />)
    expect(queryByText(/content/i)).toBeNull()
  })

  it('does not render anything when promoModalContent is empty', () => {
    require('hooks/useGlobalSlotAtomData').mockReturnValueOnce({ promoModalContent: '' })

    const { queryByText } = render(<PromoModal isOpen={true} onClose={() => {}} />)
    expect(queryByText(/content/i)).toBeNull() // Replace with relevant text content
  })

  it('calls onClose function when modal is closed', async () => {
    const user = userEvent.setup()

    require('hooks/useGlobalSlotAtomData').mockReturnValueOnce({
      promoModalContent: '<p>Some content</p>',
    })

    const onCloseMock = jest.fn()
    const { getByTestId } = render(<PromoModal isOpen={true} onClose={onCloseMock} />)

    await user.click(getByTestId('modal-close-button'))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('renders expected HTML structure and elements', async () => {
    require('hooks/useGlobalSlotAtomData').mockReturnValueOnce({
      promoModalContent: '<p>Some content</p>',
    })

    render(<PromoModal isOpen={true} onClose={() => {}} />)
    const contentElement = screen.getByText(/content/i)

    await testVisibility('dialog', screen.getByRole, contentElement)
    await testVisibility('modal-overlay')
    await testVisibility('modal-content')
    await testVisibility('modal-close-button')
  })
})
