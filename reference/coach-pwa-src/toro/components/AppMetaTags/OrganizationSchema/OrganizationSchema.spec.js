import { render } from '@testing-library/react'
import OrganizationSchema from './index'
import { PAGE_TYPES } from 'toro/constants/seo'

jest.mock('next/head', () => {
  return ({ children }) => <>{children}</>
})

describe('OrganizationSchema', () => {
  const { HOME_PAGE, PLP, PDP, CLP } = PAGE_TYPES

  it('renders nothing if content is not valid JSON', () => {
    const { container } = render(<OrganizationSchema content="invalid json" pageType={HOME_PAGE} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing if JSON is empty', () => {
    const { container } = render(<OrganizationSchema content="" pageType={HOME_PAGE} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders script tag with single JSON object', async () => {
    const jsonContent = JSON.stringify({
      '@type': 'Organization',
      name: 'Example Company',
    })

    const { container } = render(<OrganizationSchema content={jsonContent} pageType={HOME_PAGE} />)

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('type', 'application/ld+json')
    expect(script).toHaveTextContent(jsonContent)
  })

  it('renders script tags with array of JSON objects on home page', () => {
    const jsonContent = JSON.stringify([
      { '@type': 'Organization', name: 'Example Company' },
      { '@type': 'Person', name: 'John Doe' },
    ])

    const { container } = render(<OrganizationSchema content={jsonContent} pageType={HOME_PAGE} />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')

    expect(scripts).toHaveLength(2)
    expect(scripts[0]).toHaveTextContent(
      JSON.stringify({
        '@type': 'Organization',
        name: 'Example Company',
      })
    )
    expect(scripts[1]).toHaveTextContent(
      JSON.stringify({
        '@type': 'Person',
        name: 'John Doe',
      })
    )
  })

  it('renders script tags with array of JSON objects on sub-brand home page', () => {
    const jsonContent = JSON.stringify([
      { '@type': 'Organization', name: 'Example Company' },
      { '@type': 'Person', name: 'John Doe' },
    ])

    const { container } = render(
      <OrganizationSchema content={jsonContent} pageType={CLP} isSubBrandHomePage={true} />
    )
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')

    expect(scripts).toHaveLength(2)
    expect(scripts[0]).toHaveTextContent(
      JSON.stringify({
        '@type': 'Organization',
        name: 'Example Company',
      })
    )
    expect(scripts[1]).toHaveTextContent(
      JSON.stringify({
        '@type': 'Person',
        name: 'John Doe',
      })
    )
  })

  it('assigns key to script tags correctly', () => {
    const jsonContent = JSON.stringify([
      { '@type': 'Organization', name: 'Example Company' },
      { '@type': 'Person', name: 'John Doe' },
      { name: 'No Type' },
    ])

    const { container } = render(<OrganizationSchema content={jsonContent} pageType={HOME_PAGE} />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')

    expect(scripts).toHaveLength(3)

    expect(scripts[0].getAttribute('data-key')).toBe('Organization')
    expect(scripts[1].getAttribute('data-key')).toBe('Person')
    expect(scripts[2].getAttribute('data-key')).toBe('2') // Using index as key when '@type' is not present
  })

  it('renders only `Corporation` schema on PLP and PDP', () => {
    const jsonContent = JSON.stringify([
      { '@type': 'Corporation', name: 'Example Company' },
      { '@type': 'Person', name: 'John Doe' },
    ])

    const { container: PLPContainer } = render(
      <OrganizationSchema content={jsonContent} pageType={PLP} />
    )
    const { container: PDPContainer } = render(
      <OrganizationSchema content={jsonContent} pageType={PDP} />
    )

    const PLPScripts = PLPContainer.querySelectorAll('script[type="application/ld+json"]')
    const PDPScripts = PDPContainer.querySelectorAll('script[type="application/ld+json"]')

    expect(PLPScripts).toHaveLength(1)
    expect(PLPScripts[0].getAttribute('data-key')).toBe('Corporation')

    expect(PDPScripts).toHaveLength(1)
    expect(PDPScripts[0].getAttribute('data-key')).toBe('Corporation')
  })
})
