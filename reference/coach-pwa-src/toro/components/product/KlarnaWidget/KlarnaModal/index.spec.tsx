import React from 'react'
import { render, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import KlarnaModal from 'toro/components/product/KlarnaWidget/KlarnaModal'

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const renderWithProviders = (component) => {
  return render(component, renderOptions)
}

describe('KlarnaModal', () => {
  const mockOnClose = jest.fn()

  test('renders and shows the Modal when isOpen is true', async () => {
    const { getByRole } = renderWithProviders(
      <KlarnaModal isOpen={true} onClose={mockOnClose} url="https://example.com" />
    )

    const dialog = getByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
  })

  test('does not render the Modal when isOpen is false', () => {
    const { queryByRole } = renderWithProviders(
      <KlarnaModal isOpen={false} onClose={mockOnClose} url="https://example.com" />
    )
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const { getAllByRole } = renderWithProviders(
      <KlarnaModal isOpen={true} onClose={mockOnClose} url="https://example.com" />
    )
    const firstButton = getAllByRole('button')[0]
    await user.click(firstButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('renders iframe when url is provided', () => {
    renderWithProviders(
      <KlarnaModal isOpen={true} onClose={mockOnClose} url="https://example.com" />
    )
    const iframe = document.querySelector('iframe')

    expect(iframe).toHaveAttribute('src', 'https://example.com')
  })

  test('does not render iframe when url is not provided', () => {
    const { queryByRole } = renderWithProviders(<KlarnaModal isOpen={true} onClose={mockOnClose} />)

    expect(queryByRole('iframe')).not.toBeInTheDocument()
  })
})
