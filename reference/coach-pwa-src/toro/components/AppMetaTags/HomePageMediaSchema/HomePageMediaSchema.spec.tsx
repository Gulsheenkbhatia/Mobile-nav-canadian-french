import { render } from '@testing-library/react'

import { HomeImageObjectSchema } from './'

import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

describe('HomeImageObjectSchema', () => {
  const { ORGANIZATION, IMAGE } = SCHEMA_TYPES
  const { BASE_URL } = SCHEMA_URLS

  const basePageData = {
    heroImageSrc: '//images.example.com/home-hero.jpg',
    heroImageAlt: 'Hero banner alt text',
  } as Record<string, unknown>

  const baseAppData = {
    brand: 'coach-outlet',
  } as Record<string, unknown>

  it('renders nothing when url is missing', () => {
    const { container } = render(
      <HomeImageObjectSchema
        pageData={{ ...basePageData, heroImageSrc: '' }}
        appData={baseAppData}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when alt text is missing', () => {
    const { container } = render(
      <HomeImageObjectSchema
        pageData={{ ...basePageData, heroImageAlt: '' }}
        appData={baseAppData}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders a single ld+json script with expected JSON', () => {
    const { container } = render(
      <HomeImageObjectSchema pageData={basePageData} appData={baseAppData} />
    )

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('type', 'application/ld+json')
    expect(script).toHaveAttribute('data-key', 'HomePageImageObject')

    const json = JSON.parse(script.textContent || '')

    expect(json).toEqual({
      '@context': BASE_URL,
      '@type': IMAGE,
      contentUrl: `https:${basePageData.heroImageSrc}`,
      caption: basePageData.heroImageAlt,
      creator: { '@type': ORGANIZATION, name: 'Coach Outlet' },
      creditText: 'Coach Outlet',
      copyrightNotice: '© Coach Outlet',
      representativeOfPage: true,
    })
  })

  it('derives a human-readable brand name from appData.brand', () => {
    const { container } = render(
      <HomeImageObjectSchema pageData={basePageData} appData={{ brand: 'kate-spade' }} />
    )

    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script.textContent || '')

    expect(json.creator.name).toBe('Kate Spade')
    expect(json.creditText).toBe('Kate Spade')
    expect(json.copyrightNotice).toBe('© Kate Spade')
  })
})
