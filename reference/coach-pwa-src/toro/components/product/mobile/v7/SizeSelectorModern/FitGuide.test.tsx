import type { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { render, screen, waitFor, within } from 'test-utils/react'
import type { Atom } from 'jotai'
import StylesProvider from 'toro/components/StylesProvider'
import FitGuide from 'toro/components/product/mobile/v7/SizeSelectorModern/FitGuide'
import {
  countryTabIndexAtom,
  productDataAtom,
  selectedColorAtom,
  sizingRangeAtom,
} from 'store/pdp.atom'
import { preferencesAtom, type PreferencesAtomType } from 'store/preferences.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'
import type { DetailedProduct } from 'toro/types/productTypes'

jest.mock('toro/components/DrawerBody', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="fit-guide-drawer-body">{children}</div>
  ),
}))

jest.mock('toro/components/HtmlContent', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  ),
}))

jest.mock('react-intl', () => {
  const actual = jest.requireActual<typeof import('react-intl')>('react-intl')
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage?: string }) => defaultMessage ?? '',
    }),
  }
})

const mockSizeData = [
  { length: 8, us: 'M8', uk: '7', eu: '41' },
  { length: 10, us: 'M10', uk: '9', eu: '43' },
  { length: 12, us: 'M12', uk: '11', eu: '45' },
]

const defaultPreferences: PreferencesAtomType = {
  PDPPreferences: {
    templateConfigs: {
      pdpv7: {
        sizeData: mockSizeData,
      },
    },
  },
  'Storefront Configs': {
    defaultSize: {
      brand: {
        isEnabled: false,
      },
    },
  },
}

const defaultProductData: Partial<DetailedProduct> = {}

const defaultSelectedColor = {}

const createJotaiContext = (overrides: Array<[Atom<unknown>, unknown]> = []) =>
  new Map<Atom<unknown>, unknown>([
    [sizingRangeAtom, 3],
    [productDataAtom, defaultProductData],
    [selectedColorAtom, defaultSelectedColor],
    [preferencesAtom, defaultPreferences],
    [isSubBrandActiveAtom, false],
    [countryTabIndexAtom, 0],
    ...overrides,
  ])

const renderWithProviders = (
  ui: React.ReactElement,
  jotaiOverrides: Array<[Atom<unknown>, unknown]> = []
) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <StylesProvider value={{}}>{ui}</StylesProvider>
    </IntlProvider>,
    {
      contexts: {
        JotaiProviderContext: createJotaiContext(jotaiOverrides),
      },
    }
  )

describe('FitGuide', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderFitGuide = (
    props: { draftSize?: string; jotaiOverrides?: Array<[Atom<unknown>, unknown]> } = {}
  ) =>
    renderWithProviders(<FitGuide draftSize={props.draftSize ?? ''} />, props.jotaiOverrides ?? [])

  it('renders heading and size table from preferences', () => {
    renderFitGuide()

    expect(screen.getByRole('heading', { name: 'Fit Guide' })).toBeVisible()

    const table = screen.getByRole('table')
    expect(within(table).getByText('US')).toBeVisible()
    expect(within(table).getByText('M8')).toBeVisible()
    expect(within(table).getByText('M10')).toBeVisible()
    expect(within(table).getByText('M12')).toBeVisible()
  })

  it('renders foot length input and unit controls', () => {
    renderFitGuide()

    expect(screen.getByPlaceholderText('e.g. 9.5')).toBeVisible()
    expect(screen.getByRole('button', { name: 'IN' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'CM' })).toBeVisible()
  })

  it('sorts table rows by closest length when foot length is entered', async () => {
    const { user } = renderFitGuide()

    const input = screen.getByPlaceholderText('e.g. 9.5')
    await user.type(input, '10')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')

    const firstDataRow = rows[1]
    expect(within(firstDataRow).getByText('M10')).toBeVisible()
  })

  it('shows marketing copy when fit guidance is available', () => {
    renderFitGuide()

    expect(screen.getByText(/Customers say this/i)).toBeVisible()
  })

  it('hides marketing when neutral sizing is enabled', () => {
    renderFitGuide({
      jotaiOverrides: [
        [
          preferencesAtom,
          {
            ...defaultPreferences,
            'Storefront Configs': {
              defaultSize: {
                brand: {
                  isEnabled: true,
                  sizeType: [],
                },
              },
            },
          },
        ],
        [
          selectedColorAtom,
          {
            id: 'color-id',
            sizes: [{ value: { us: '8' } }],
          },
        ],
      ],
    })

    expect(screen.queryByText(/Customers say this/i)).not.toBeInTheDocument()
  })

  it('toggles how-to-measure accordion', async () => {
    const { user } = renderFitGuide({
      jotaiOverrides: [
        [
          productDataAtom,
          {
            footMeasureContent: {
              c_body: {
                default: {
                  markup: '<p>1. Place your foot on a piece of paper</p>',
                },
              },
              online: {
                default: true,
              },
            },
          },
        ],
      ],
    })

    const [toggle] = screen
      .getAllByRole('button')
      .filter((el) => el.getAttribute('aria-controls') === 'how-to-measure-content')

    expect(toggle).toBeDefined()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await waitFor(() => {
      expect(screen.getByText('1. Place your foot on a piece of paper')).toBeVisible()
    })
  })
})
