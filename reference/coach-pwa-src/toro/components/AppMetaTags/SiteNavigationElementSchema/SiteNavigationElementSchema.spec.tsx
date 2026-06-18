import { render, screen } from 'test-utils/react'
import SiteNavigationElementSchema from 'toro/components/AppMetaTags/SiteNavigationElementSchema'
import { MenuData } from 'store/menu-data.atom'

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>
    },
  }
})

const componentProps = {
  menuData: {
    topCategories: ['test1', 'test2'],
    test1: {
      name: 'test1',
      url: '/test1',
    },
    test2: {
      name: 'test2',
      url: 'https://test.com/test2',
    },
    test3: {
      name: 'test3',
      url: '/test3',
    },
  } as unknown as MenuData,
  backendDomain: 'test.com',
}

const expectedSchema = [
  {
    '@context': 'http://schema.org',
    '@type': 'siteNavigationElement',
    name: 'test1',
    url: 'https://test.com/test1',
  },
  {
    '@context': 'http://schema.org',
    '@type': 'siteNavigationElement',
    name: 'test2',
    url: 'https://test.com/test2',
  },
]

const setup = () => {
  render(<SiteNavigationElementSchema {...componentProps} />, {
    contexts: {},
  })
}

describe('SiteNavigationElement', () => {
  it('should render schema with t1 categories only', () => {
    setup()
    const element = screen.getByTestId('seo-site-navigation-element')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent(JSON.stringify(expectedSchema))
  })
})
