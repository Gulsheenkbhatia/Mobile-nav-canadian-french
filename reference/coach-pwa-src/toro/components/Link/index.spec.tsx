import { render, CustomRenderOptions, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import Link from './index'
import LinkContext from 'components/LinkContext'
import isProxiedPath from 'toro/helpers/isProxiedPath'
import isBrowser from 'toro/helpers/isBrowser'
import isPlainObject from 'lodash/isPlainObject'
import useIsSubBrandSwitch from 'toro/hooks/useIsSubBrandSwitch'
import withDefaultHandler from 'toro/helpers/withDefaultHandler'

jest.mock('toro/helpers/isProxiedPath')
jest.mock('toro/helpers/isBrowser')
jest.mock('lodash/isPlainObject')
jest.mock('toro/hooks/useIsSubBrandSwitch')
jest.mock('toro/helpers/withDefaultHandler')

jest.mock('next/link', () => {
  return ({ children, href, onClick, passHref, prefetch, scroll, ...props }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </a>
    )
  }
})

beforeAll(() => {
  process.env.SERVICE_WORKER = 'true'
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {},
    writable: true,
  })
})

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

describe('Link Component', () => {
  const mockHref = 'http://testcase.com'
  const mockPageData = { current: { id: 1 } }
  const mockOnClick = jest.fn()
  const mockChildren = <span>Test Link</span>

  const renderLink = (props = {}) => {
    return render(
      <LinkContext.Provider value={{ current: mockPageData }}>
        <Link href={mockHref} onClick={mockOnClick} {...props}>
          {mockChildren}
        </Link>
      </LinkContext.Provider>,
      renderOptions
    )
  }

  beforeEach(() => {
    ;(isProxiedPath as jest.Mock).mockReturnValue(false)
    ;(isBrowser as jest.Mock).mockReturnValue(true)
    ;(isPlainObject as jest.Mock).mockReturnValue(true)
    ;(useIsSubBrandSwitch as jest.Mock).mockReturnValue(false)
    ;(withDefaultHandler as jest.Mock).mockImplementation(
      (handler, defaultHandler) => handler || defaultHandler
    )
    mockOnClick.mockClear()
  })

  test('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    renderLink()
    const linkElement = screen.getByText('Test Link')
    await user.click(linkElement)
    expect(mockOnClick).toHaveBeenCalled()
  })

  test('handles proxy link click correctly', async () => {
    const user = userEvent.setup()
    const originalLocation = window.location
    const mockLocation = {
      ...window.location,
      href: '',
    }
    delete window.location
    window.location = mockLocation
    ;(isProxiedPath as jest.Mock).mockReturnValue(true)
    renderLink()
    const linkElement = screen.getByText('Test Link')
    await user.click(linkElement)
    expect(window.location.href).toBe(mockHref)
    window.location = originalLocation
  })

  test('updates linkPageData.current on click', async () => {
    const user = userEvent.setup()
    const initialData = { id: 1 }
    const updatedData = { id: 2 }
    const mutablePageData = { current: initialData }

    render(
      <LinkContext.Provider value={mutablePageData}>
        <Link href={mockHref} pageData={updatedData}>
          {mockChildren}
        </Link>
      </LinkContext.Provider>,
      renderOptions
    )

    const linkElement = screen.getByText('Test Link')
    await user.click(linkElement)
    expect(mutablePageData.current).toBe(updatedData)
  })
})
