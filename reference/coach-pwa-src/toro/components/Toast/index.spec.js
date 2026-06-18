import { render } from 'test-utils/react'
import Toast from './index'

jest.mock('toro/hooks/useOutsideClick', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Toast component', () => {
  it('renders description', () => {
    const { getByText } = render(<Toast status="success" description="Test Description" />)
    expect(getByText('Test Description')).toBeInTheDocument()
  })
  it('calls onUndo when undo button is clicked', async () => {
    const onUndoMock = jest.fn()
    const formatMessageMock = jest.fn()
    const { user, container } = render(
      <Toast
        status="success"
        description="Test Description"
        onUndo={onUndoMock}
        canUndo={true}
        brandSW={false}
        formatMessage={formatMessageMock}
      />
    )
    const buttons = container.querySelectorAll('button')

    await user.click(buttons[0])
    expect(onUndoMock).toHaveBeenCalledTimes(1)
  })

  test('isInsideToastManager is true', () => {
    const { container } = render(
      <div id="chakra-toast-manager-top">
        <Toast status="success" description="Test Description" />
      </div>
    )

    const data = container.querySelector('#chakra-toast-manager-top')
    expect(
      data.querySelector(`[data-qa='cm_icon_alert_pdt_addedto_sfl_wshlst_success']`)
    ).toBeInTheDocument()
    expect(data.querySelector(`[data-qa='maab_add_added_toast']`)).toBeInTheDocument()
    expect(data.querySelector(`[data-qa='maab_add_updated_toast_icon_close']`)).toBeInTheDocument()
  })

  it('renders description with link', () => {
    const { getByText, getByRole } = render(
      <Toast status="success" description="Test Description" link="Test Link" />
    )
    expect(getByText('Test Description')).toBeInTheDocument()
    expect(getByRole('link')).toHaveAttribute('href', '/wishlist')
  })

  it('calls onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn()
    const { user, getByRole } = render(
      <Toast status="success" description="Test Description" onClose={onCloseMock} />
    )

    await user.click(getByRole('button'))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('calls onOutsideClick when clicking outside the toast', async () => {
    const onOutsideClickMock = jest.fn()
    require('toro/hooks/useOutsideClick').default.mockImplementation(({ handler }) => {
      handler()
    })

    const { user } = render(
      <Toast
        status="success"
        description="Test toast message"
        onOutsideClick={onOutsideClickMock}
      />
    )
    await user.click(document.body)
    expect(onOutsideClickMock).toHaveBeenCalled()
  })
})
