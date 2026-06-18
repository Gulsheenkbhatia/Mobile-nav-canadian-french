import { render } from 'test-utils/react'
import NoResultText from './NoResultText'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isMobile: true }))

describe('NoResultText Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    const { getByText } = render(<NoResultText />)

    expect(getByText('No Results Found for')).toBeInTheDocument()
    expect(getByText('""')).toBeInTheDocument()
  })

  it('renders correctly with query prop', () => {
    const { getByText } = render(<NoResultText query="the product C5147" />)

    expect(getByText('No Results Found for')).toBeInTheDocument()
    expect(getByText('"the product C5147"')).toBeInTheDocument()
  })
})
