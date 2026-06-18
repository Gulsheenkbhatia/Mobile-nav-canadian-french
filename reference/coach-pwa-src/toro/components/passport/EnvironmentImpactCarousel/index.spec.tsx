import { render, act, CustomRenderOptions } from 'test-utils/react'
import EnvironmentImpactCarouselRaw from './index'
import { preferencesAtom } from 'store/preferences.atom'
import { Atom } from 'jotai'
import { FC, ReactNode } from 'react'

// Type definition for component props
type EnvironmentImpactCarouselProps = {
  impacts?: any[]
  title?: string
  locale?: string
  rotateGlobeIcon?: string
  location?: string
  variant?: string
}

const withAtoms = (
  baseOptions: CustomRenderOptions,
  newAtoms: Array<[Atom<unknown>, unknown]>
): CustomRenderOptions => {
  const existingAtoms = baseOptions.contexts?.JotaiProviderContext || new Map()
  const mergedAtoms = new Map(existingAtoms)

  newAtoms.forEach(([atom, value]) => {
    mergedAtoms.set(atom, value)
  })

  return {
    ...baseOptions,
    contexts: {
      ...baseOptions.contexts,
      JotaiProviderContext: mergedAtoms,
    },
  }
}

function withContexts(
  baseOptions: CustomRenderOptions,
  partialContexts: Partial<NonNullable<CustomRenderOptions['contexts']>>
): CustomRenderOptions {
  return {
    ...baseOptions,
    contexts: {
      ...baseOptions.contexts,
      ...partialContexts,
    },
  }
}

// Cast component to use proper types
const EnvironmentImpactCarousel = EnvironmentImpactCarouselRaw as FC<EnvironmentImpactCarouselProps>

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test',
  }),
}))

// Mock Lazy component to always render children immediately in tests
jest.mock('toro/components/Lazy', () => {
  return function Lazy({ children }: { children: ReactNode }) {
    return <>{children}</>
  }
})

// Mock dynamic icon imports to render testable content
jest.mock('next/dynamic', () => {
  const originalDynamic = jest.requireActual('next/dynamic')
  return function dynamic(importFn: any, options?: any) {
    const iconFnStr = importFn.toString()

    // For icon imports (ssr: false), return a simple test component
    if (
      options?.ssr === false &&
      iconFnStr.includes('@tapestry-inc/design-tokens') &&
      iconFnStr.includes('icon/object')
    ) {
      return function MockIcon() {
        return <span data-qa="impact-icon">Icon</span>
      }
    }
    // For other dynamic imports (CarouselDesktop, CarouselMobile, etc), use original
    return originalDynamic(importFn, options)
  }
})

describe('EnvironmentImpactCarousel', () => {
  const mockAnalyticsSend = jest.fn()

  const defaultRenderOptions = {
    contexts: {
      ViewportContext: {
        viewport: 'desktop' as const,
        isDesktop: true,
      },
      PWAContext: {
        appData: {
          locale: 'en-US',
        },
      },
      AnalyticsContext: {
        send: mockAnalyticsSend,
      },
      JotaiProviderContext: new Map([
        [
          preferencesAtom,
          {
            ToggleSiteFeatures: {
              enableNewEnvImpactModule: false,
            },
            coachtopia: {
              environmentImpactViewDataSourcesPath: [
                {
                  locale: 'en-US',
                  link: 'https://example.com/data-sources',
                },
              ],
            },
          },
        ],
      ]),
    },
  }

  const mockImpacts = [
    {
      id: '1',
      title: 'Carbon Footprint',
      value: '5.2 kg CO2',
      description: 'Carbon emissions',
      icon: 'twitter',
      viewMoreUrl: 'https://example.com/carbon-footprint',
    },
    {
      id: '2',
      title: 'Water Usage',
      value: '100L',
      description: 'Water consumption',
      icon: 'tiktok',
      viewMoreUrl: 'https://example.com/water-usage',
    },
    {
      id: '3',
      title: 'Waste Impact',
      value: '0.5 kg',
      description: 'Waste generated',
      icon: 'pinterest',
      viewMoreUrl: 'https://example.com/waste-impact',
    },
  ]

  const defaultTitle = 'This Product’s Carbon and Waste Impact'
  const fallbackTitle = "This Product's Impact"
  const viewOurDataSourcesText = 'View Our Data Sources'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering - Conditional Display', () => {
    it('should return null when impacts array is empty', async () => {
      const { queryByText } = await act(() =>
        render(<EnvironmentImpactCarousel impacts={[]} locale="en-US" />, defaultRenderOptions)
      )

      // Should not render the title when no impacts
      expect(queryByText(defaultTitle)).not.toBeInTheDocument()
    })

    it('should return null when impacts is undefined', async () => {
      const { queryByText } = await act(() =>
        render(<EnvironmentImpactCarousel locale="en-US" />, defaultRenderOptions)
      )

      // Should not render the title when no impacts
      expect(queryByText(defaultTitle)).not.toBeInTheDocument()
    })

    it('should render carousel when impacts array has items', async () => {
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      // Should render title when impacts exist
      expect(getByText(defaultTitle)).toBeVisible()
    })

    it('should render with single impact item', async () => {
      const singleImpact = [mockImpacts[0]]
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={singleImpact} locale="en-US" />,
          defaultRenderOptions
        )
      )

      // Should render title and the impact value
      expect(getByText(defaultTitle)).toBeVisible()
      expect(getByText(singleImpact[0].value)).toBeVisible()
    })
  })

  describe('Rendering - Component Structure', () => {
    it('should render with correct component structure for minimalistic carousel', async () => {
      const renderOptions = withAtoms(defaultRenderOptions, [
        [
          preferencesAtom,
          {
            ToggleSiteFeatures: { enableNewEnvImpactModule: true },
            coachtopia: {
              environmentImpactViewDataSourcesPath: [
                {
                  locale: 'en-US',
                  link: 'https://example.com/data-sources',
                },
              ],
            },
          },
        ],
      ])

      const singleImpact = [mockImpacts[0]]

      const { getByText, container, getByTestId } = await act(() =>
        render(
          <EnvironmentImpactCarousel
            impacts={singleImpact}
            locale="en-US"
            rotateGlobeIcon="<div>Globe Icon</div>"
          />,
          renderOptions
        )
      )

      // Should render title
      expect(getByText(fallbackTitle)).toBeVisible()

      // Should render globe icon
      expect(getByText('Globe Icon')).toBeVisible()

      // Should render impact data
      expect(getByText(`${singleImpact[0].value} ${singleImpact[0].title}`)).toBeVisible()
      expect(getByText(singleImpact[0].description)).toBeVisible()
      expect(getByTestId('impact-icon')).toBeVisible()

      const link = container.querySelector(`a[href="${singleImpact[0].viewMoreUrl}"]`)
      expect(link).toBeVisible()

      // Should render view our data sources link
      expect(getByText(viewOurDataSourcesText)).toBeVisible()
    })

    it('should render with correct component structure for regular carousel', async () => {
      const singleImpact = [mockImpacts[0]]

      const { getByText, container, getByTestId } = await act(() =>
        render(
          <EnvironmentImpactCarousel
            impacts={singleImpact}
            locale="en-US"
            rotateGlobeIcon="<div>Globe Icon</div>"
          />,
          defaultRenderOptions
        )
      )

      // Should render title
      expect(getByText(defaultTitle)).toBeVisible()

      // Should render globe icon
      expect(getByText('Globe Icon')).toBeVisible()

      // Should render impact data
      expect(getByText(singleImpact[0].title)).toBeVisible()
      expect(getByText(singleImpact[0].value)).toBeVisible()
      expect(getByText(singleImpact[0].description)).toBeVisible()
      expect(getByTestId('impact-icon')).toBeVisible()

      const link = container.querySelector(`a[href="${singleImpact[0].viewMoreUrl}"]`)
      expect(link).toBeVisible()

      // Should render view our data sources link
      expect(getByText(viewOurDataSourcesText)).toBeVisible()
    })

    it('should render globe icon when rotateGlobeIcon prop is provided', async () => {
      const globeIconHtml = '<div class="globe-icon-test">Rotating Globe</div>'
      const { container } = await act(() =>
        render(
          <EnvironmentImpactCarousel
            impacts={mockImpacts}
            locale="en-US"
            rotateGlobeIcon={globeIconHtml}
          />,
          defaultRenderOptions
        )
      )

      // The rotateGlobeIcon HTML is passed to LazySlot which renders it via HtmlContent
      // With the Lazy component mocked, the HTML should render immediately
      const globeElement = container.querySelector('.globe-icon-test')
      expect(globeElement).toBeVisible()
    })
  })

  describe('Title Selection Logic', () => {
    it('should display prop title when provided', async () => {
      const customTitle = 'Custom Environmental Impact Title'
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" title={customTitle} />,
          defaultRenderOptions
        )
      )

      expect(getByText(customTitle)).toBeVisible()
    })

    it('should display internationalized fallback when enableNewEnvImpactModule is true and no title prop', async () => {
      const renderOptions = withAtoms(defaultRenderOptions, [
        [
          preferencesAtom,
          {
            ToggleSiteFeatures: {
              enableNewEnvImpactModule: true,
            },
          },
        ],
      ])

      const { getByText } = await act(() =>
        render(<EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />, renderOptions)
      )

      // Should use internationalized message
      expect(getByText(fallbackTitle)).toBeVisible()
    })

    it('should display hardcoded default string when module is disabled and no title prop', async () => {
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      // Should render the default title
      expect(getByText(defaultTitle)).toBeVisible()
    })

    it('should prioritize prop title over internationalized fallback', async () => {
      const customTitle = 'My Custom Title'
      const renderOptions = withAtoms(defaultRenderOptions, [
        [
          preferencesAtom,
          {
            ToggleSiteFeatures: {
              enableNewEnvImpactModule: true,
            },
          },
        ],
      ])

      const { getByText, queryByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" title={customTitle} />,
          renderOptions
        )
      )

      expect(getByText(customTitle)).toBeVisible()
      expect(queryByText(fallbackTitle)).not.toBeInTheDocument()
    })

    it('should prioritize prop title over hardcoded default', async () => {
      const customTitle = 'Another Custom Title'
      const { getByText, queryByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" title={customTitle} />,
          defaultRenderOptions
        )
      )

      expect(getByText(customTitle)).toBeVisible()
      expect(queryByText(defaultTitle)).not.toBeInTheDocument()
    })
  })

  describe('View Data Sources Link', () => {
    it('should render View Data Sources link when environmentImpactViewDataSourcesPath matches locale', async () => {
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      expect(getByText(viewOurDataSourcesText)).toBeVisible()
    })

    it('should not render View Data Sources link when no matching locale', async () => {
      const { queryByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="fr-FR" />,
          defaultRenderOptions
        )
      )

      expect(queryByText(viewOurDataSourcesText)).not.toBeInTheDocument()
    })

    it('should not render View Data Sources link when environmentImpactViewDataSourcesPath is empty', async () => {
      const renderOptions = withAtoms(defaultRenderOptions, [
        [
          preferencesAtom,
          {
            coachtopia: {
              environmentImpactViewDataSourcesPath: [],
            },
          },
        ],
      ])

      const { queryByText } = await act(() =>
        render(<EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />, renderOptions)
      )

      expect(queryByText(viewOurDataSourcesText)).not.toBeInTheDocument()
    })

    it('should not render View Data Sources link when environmentImpactViewDataSourcesPath is undefined', async () => {
      const renderOptions = withAtoms(defaultRenderOptions, [
        [
          preferencesAtom,
          {
            coachtopia: {},
          },
        ],
      ])

      const { queryByText } = await act(() =>
        render(<EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />, renderOptions)
      )

      expect(queryByText(viewOurDataSourcesText)).not.toBeInTheDocument()
    })

    it('should render correct link href for matching locale', async () => {
      const { container } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      const link = container.querySelector('a[href="https://example.com/data-sources"]')
      expect(link).toBeVisible()
    })

    it('should open link in new tab (target="_blank")', async () => {
      const { container } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      const link = container.querySelector('a[target="_blank"]')
      expect(link).toBeVisible()
    })

    it('should have desktop data-qa attribute when isDesktop is true', async () => {
      const { container } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      const link = container.querySelector('[data-qa="d_link_view_our_data_sources"]')
      expect(link).toBeVisible()
    })

    it('should have mobile data-qa attribute when isDesktop is false', async () => {
      const mobileRenderOptions = {
        ...defaultRenderOptions,
        contexts: {
          ...defaultRenderOptions.contexts,
          ViewportContext: {
            viewport: 'mobile' as const,
            isDesktop: false,
            isMobile: true,
          },
        },
      }

      const { container } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          mobileRenderOptions
        )
      )

      const link = container.querySelector('[data-qa="m_link_view_our_data_sources"]')
      expect(link).toBeVisible()
    })
  })

  describe('Analytics on Link Click', () => {
    it('should send analytics event when View Data Sources link is clicked', async () => {
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      const link = getByText(viewOurDataSourcesText)
      link.click()

      expect(mockAnalyticsSend).toHaveBeenCalledWith('coachtopiaInteraction', {
        eventLocation: 'Environmental Impact Module',
        eventPageLocation: 'coachtopia passport',
        eventAction: 'environmental impact modal click',
        eventLabel: 'view our data sources',
      })
    })

    it('should send analytics with custom location when provided', async () => {
      const customLocation = 'custom pdp location'
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel
            impacts={mockImpacts}
            locale="en-US"
            location={customLocation}
          />,
          defaultRenderOptions
        )
      )

      const link = getByText(viewOurDataSourcesText)
      link.click()

      expect(mockAnalyticsSend).toHaveBeenCalledWith('coachtopiaInteraction', {
        eventLocation: 'Environmental Impact Module',
        eventPageLocation: customLocation,
        eventAction: 'environmental impact modal click',
        eventLabel: 'view our data sources',
      })
    })

    it('should use default location when location prop is not provided', async () => {
      const { getByText } = await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      const link = getByText(viewOurDataSourcesText)
      link.click()

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'coachtopiaInteraction',
        expect.objectContaining({
          eventPageLocation: 'coachtopia passport',
        })
      )
    })

    it('should send analytics event only when link is clicked', async () => {
      await act(() =>
        render(
          <EnvironmentImpactCarousel impacts={mockImpacts} locale="en-US" />,
          defaultRenderOptions
        )
      )

      // Analytics should not be sent on render
      expect(mockAnalyticsSend).not.toHaveBeenCalled()
    })
  })

  describe('Responsive Carousels', () => {
    it.each(mockImpacts)(
      'should render carousel with impact data for "$title" regardless of desktop viewport',
      async (impact) => {
        const desktopResult = await act(() =>
          render(
            <EnvironmentImpactCarousel impacts={[impact]} locale="en-US" />,
            defaultRenderOptions
          )
        )

        // desktop assertions
        expect(desktopResult.getByText(impact.title)).toBeVisible()
        expect(desktopResult.getByText(impact.value)).toBeVisible()
        expect(desktopResult.getByText(impact.description)).toBeVisible()
        expect(desktopResult.getByTestId('impact-icon')).toBeVisible()

        const desktopLink = desktopResult.container.querySelector(`a[href="${impact.viewMoreUrl}"]`)
        expect(desktopLink).toBeVisible()
      }
    )

    it.each(mockImpacts)(
      'should render carousel with impact data for "$title" regardless of mobile viewport',
      async (impact) => {
        const mobileRenderOptions = withContexts(defaultRenderOptions, {
          ViewportContext: {
            viewport: 'mobile' as const,
            isDesktop: false,
            isMobile: true,
          },
        })

        const mobileResult = await act(() =>
          render(
            <EnvironmentImpactCarousel impacts={[impact]} locale="en-US" />,
            mobileRenderOptions
          )
        )

        // mobile assertions
        expect(mobileResult.getAllByText(impact.title)[0]).toBeVisible()
        expect(mobileResult.getAllByText(impact.value)[0]).toBeVisible()
        expect(mobileResult.getAllByText(impact.description)[0]).toBeVisible()
        expect(mobileResult.getAllByTestId('impact-icon')[0]).toBeVisible()

        const mobileLink = mobileResult.container.querySelector(`a[href="${impact.viewMoreUrl}"]`)
        expect(mobileLink).toBeVisible()
      }
    )
  })
})
