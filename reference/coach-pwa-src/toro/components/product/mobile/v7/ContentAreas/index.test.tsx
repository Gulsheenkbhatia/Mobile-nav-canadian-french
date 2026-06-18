import React from 'react'
import { render, screen } from 'test-utils/react'
import ContentAreas from './index'
import useProductData from 'toro/hooks/useProductData'

jest.mock('toro/components/product/ContentArea/ContentAreaOne', () => ({
  __esModule: true,
  default: (props: { siteId?: string }) => (
    <div data-qa="mock-content-area-one" data-site-id={props.siteId} />
  ),
}))

jest.mock('toro/components/product/ContentArea/ContentAreaTwo', () => ({
  __esModule: true,
  default: (props: { siteId?: string }) => (
    <div data-qa="mock-content-area-two" data-site-id={props.siteId} />
  ),
}))

jest.mock('toro/components/product/ContentArea/ContentAreaThree', () => ({
  __esModule: true,
  default: (props: { siteId?: string }) => (
    <div data-qa="mock-content-area-three" data-site-id={props.siteId} />
  ),
}))

jest.mock('toro/hooks/useProductData', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockSlot = { content: { html: '<p>slot</p>' } }
const mockCustom = 'custom-attr-value'

const pwaContexts = {
  PWAContext: {
    deviceType: 'desktop' as const,
    appData: { siteId: 'coh_us_out' },
  },
}

type RenderContentAreasOpts = {
  contentAreaCustomAttribute: string | null | undefined
}

const renderContentAreas = (area: 1 | 2 | 3, opts?: RenderContentAreasOpts) => {
  const contentAreaCustomAttribute =
    opts !== undefined ? opts.contentAreaCustomAttribute : mockCustom
  jest.mocked(useProductData).mockReturnValue([mockSlot, contentAreaCustomAttribute])
  return render(<ContentAreas area={area} />, { contexts: pwaContexts })
}

describe('ContentAreas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    [
      1 as const,
      ['pdpContentAreas.pdp-content-area-one-markup', 'custom.c_pdpContentAreaOne'],
      'mock-content-area-one',
    ],
    [
      2 as const,
      ['pdpContentAreas.pdp-content-area-two-markup', 'custom.c_pdpContentAreaTwo'],
      'mock-content-area-two',
    ],
    [
      3 as const,
      ['pdpContentAreas.pdp-content-area-three-markup', 'custom.c_pdpContentAreaThree'],
      'mock-content-area-three',
    ],
  ])(
    'when area is %s, requests the correct product paths and renders only that content area',
    async (area, expectedPaths, expectedMockTestId) => {
      renderContentAreas(area)

      expect(useProductData).toHaveBeenCalledWith(expectedPaths)
      expect(screen.getByTestId(`sketch-content-areas-${area}`)).toBeInTheDocument()
      const active = await screen.findByTestId(expectedMockTestId)
      expect(active).toBeInTheDocument()
      expect(active).toHaveAttribute('data-site-id', 'coh_us_out')

      const otherIds = [
        'mock-content-area-one',
        'mock-content-area-two',
        'mock-content-area-three',
      ].filter((id) => id !== expectedMockTestId)
      otherIds.forEach((id) => {
        expect(screen.queryByTestId(id)).not.toBeInTheDocument()
      })
    }
  )

  it.each([
    ['null', null],
    ['undefined', undefined],
  ] as const)('when contentAreaCustomAttribute is %s, renders nothing', (_label, missingCustom) => {
    renderContentAreas(1, { contentAreaCustomAttribute: missingCustom })

    expect(useProductData).toHaveBeenCalledWith([
      'pdpContentAreas.pdp-content-area-one-markup',
      'custom.c_pdpContentAreaOne',
    ])
    expect(screen.queryByTestId('sketch-content-areas-1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-content-area-one')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-content-area-two')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-content-area-three')).not.toBeInTheDocument()
  })
})
