import SignUpDisclaimerModal from 'toro/components/SignUpDisclaimerModal'
import { useAtom } from 'jotai'
import { render, screen } from 'test-utils/react'
import useViewportType from 'toro/hooks/useViewportType'
import userEvent from '@testing-library/user-event'

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')
  return {
    ...actual,
    useAtom: jest.fn(),
  }
})
jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
    }),
  }
})
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useViewportType')
jest.mock('store/preferences.atom', () => ({
  preferencesAtom: {},
}))
jest.mock('toro/components/HtmlContent', () => {
  return function MockHtmlContent({ content }) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }
})

const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
const mockUseViewportType = useViewportType as jest.Mock

const textHtmlContent = `
  <div>
    <h1>Test Title</h1>
    <p>Test paragraph content.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
  </div>
`

describe('SignUpDisclaimerModal', () => {
  const setup = (props = { content: textHtmlContent }) => {
    return render(<SignUpDisclaimerModal {...props} />)
  }

  beforeEach(() => {
    mockUseViewportType.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    })
    mockedUseAtom.mockImplementation(() => [false, jest.fn()])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal with provided content', () => {
    mockedUseAtom.mockImplementation(() => [true, jest.fn()])
    setup()

    expect(screen.getByText('Test Title')).toBeVisible()
    expect(screen.getByText('Test paragraph content.')).toBeVisible()
    expect(screen.getByText('List item 1')).toBeVisible()
    expect(screen.getByText('List item 2')).toBeVisible()
  })

  it('should not render modal when isShowShippingAndReturnModal is false', () => {
    mockedUseAtom.mockImplementation(() => [false, jest.fn()])
    setup()

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Test paragraph content.')).not.toBeInTheDocument()
    expect(screen.queryByText('List item 1')).not.toBeInTheDocument()
    expect(screen.queryByText('List item 2')).not.toBeInTheDocument()
  })

  it('should call setShowShippingAndReturnModal when close button is clicked', async () => {
    const user = userEvent.setup()
    const setShowModal = jest.fn()
    mockedUseAtom.mockImplementation(() => [true, setShowModal])
    setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(setShowModal).toHaveBeenCalledTimes(1)
    expect(setShowModal).toHaveBeenCalledWith(false)
  })

  it('should render without content', () => {
    mockedUseAtom.mockImplementation(() => [true, jest.fn()])
    setup({ content: '' })

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })
})
