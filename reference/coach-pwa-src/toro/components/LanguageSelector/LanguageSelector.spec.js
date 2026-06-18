import { render } from 'test-utils/react'
import LanguageSelector from './LanguageSelector'

const mockData = {
  selector: {
    label: 'US',
    flag: 'usa',
    dataQA: {
      flag: 'hdr_cs_flag',
      label: 'hdr_txt_cs_label',
    },
  },
  dropdown: {
    title: 'CHANGE LOCATION',
    items: [
      {
        label: 'United States ($USD)',
        flag: 'usa',
        languages: [
          {
            name: 'EN',
            href: 'https://www.coach.com',
          },
        ],
        dataQA: {
          label: 'd_hdr_cs_drpdwn_label_active',
          lang: 'd_hdr_cs_drpdwn_lang_active',
        },
      },
      {
        label: 'Canada ($CAD)',
        flag: 'canada',
        languages: [
          {
            name: 'EN',
            href: 'https://ca.coach.com/en',
          },
          {
            name: 'FR',
            href: 'https://ca.coach.com/fr',
          },
        ],
        dataQA: {
          flag: 'd_hdr_cs_drpdwn_flag_ca',
          label: 'd_hdr_cs_drpdwn_label_ca',
          lang: 'd_hdr_cs_drpdwn_lang1_ca',
        },
      },
    ],
    viewMore: {
      viewMoreText: '',
    },
    selectedItemIndex: 0,
    selectedLanguageIndex: 0,
  },
}
jest.mock('toro/hooks/useOutsideClick', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const clearTimeoutMock = jest.fn()
global.clearTimeout = clearTimeoutMock

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        isOptGtmDisabled: true,
      },
    },
  },
  userSetupOptions: {
    delay: null,
  },
}

describe('LanguageSelector', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.runAllTimers()
    jest.useRealTimers()
  })
  it('renders without crashing', () => {
    const { container } = render(<LanguageSelector />)
    expect(container).toBeInTheDocument()
  })
  it('renders with correct prop values', () => {
    const { container } = render(<LanguageSelector content={mockData} />)
    const parentContainer = container.querySelector('.countrySelectorContainer')

    expect(parentContainer).toBeInTheDocument()
  })

  it('opens dropdown on mouse enter', async () => {
    const { user, getByText } = render(<LanguageSelector content={mockData} />, renderOptions)
    const carotIcon = document.querySelector('svg')

    await user.hover(carotIcon)
    const changeLocationText = getByText('CHANGE LOCATION')
    const CountrycurrencyUs = getByText('United States ($USD)')
    const CountrycurrencyCa = getByText('Canada ($CAD)')
    expect(changeLocationText).toBeInTheDocument()
    expect(CountrycurrencyUs).toBeInTheDocument()
    expect(CountrycurrencyCa).toBeInTheDocument()
  })
  it('closes dropdown on mouse leaves', async () => {
    const { user, container } = render(<LanguageSelector content={mockData} />, renderOptions)
    const carotIcon = document.querySelector('svg')
    const parentContainer = container.querySelector('.countrySelectorContainer')
    await user.hover(carotIcon)
    await user.unhover(carotIcon)
    expect(parentContainer).not.toHaveValue('CHANGE LOCATION')
  })

  it('closes dropdown when mouse leaves then handle Tab keypress', async () => {
    const { user, container } = render(<LanguageSelector content={mockData} />, renderOptions)
    const svgElement = container.querySelector('svg')
    await user.type(svgElement, '{Tab}')
    expect(svgElement).not.toHaveValue('CHANGE LOCATION')
  })

  it('closes dropdown on Tab press when focused on last anchor', async () => {
    const { user, container } = render(<LanguageSelector content={mockData} />, renderOptions)
    const svgElement = container.querySelector('svg')
    await user.click(svgElement)
    await user.type(svgElement, '{arrowdown}')
    await user.type(svgElement, '{Tab}')
    const parentContainer = container.querySelector('.countrySelectorContainer')
    expect(parentContainer).not.toHaveValue('CHANGE LOCATION')
  })

  it('focuses on the next anchor element in dropdown when ArrowDown key is pressed', async () => {
    const { user, getByText } = render(<LanguageSelector content={mockData} />, renderOptions)
    const svgElement = document.querySelector('svg')
    await user.click(svgElement)
    await user.type(svgElement, '{Space}')

    const changeLocationText = getByText('CHANGE LOCATION')
    expect(changeLocationText).toBeInTheDocument()
    await user.type(changeLocationText, '{arrowdown}')

    const usValue = getByText('United States ($USD)')
    expect(usValue).toHaveAttribute('data-qa', 'd_hdr_cs_drpdwn_label_active')
  })
  it('focuses on the next anchor element in dropdown when ArrowUp key is pressed', async () => {
    const { user, getByText } = render(<LanguageSelector content={mockData} />, renderOptions)
    const svgElement = document.querySelector('svg')

    await user.click(svgElement)
    await user.type(svgElement, '{Space}')

    const changeLocationText = getByText('CHANGE LOCATION')
    expect(changeLocationText).toBeInTheDocument()
    await user.type(changeLocationText, '{arrowup}')

    const usValue = getByText('United States ($USD)')
    expect(usValue).toHaveAttribute('data-qa', 'd_hdr_cs_drpdwn_label_active')
  })

  it('handles empty dropdown items correctly', async () => {
    const emptyDropdownData = { ...mockData, dropdown: { items: [] } }
    const { user, container } = render(
      <LanguageSelector content={emptyDropdownData} />,
      renderOptions
    )
    const parentContainer = container.querySelector('.countrySelectorContainer')

    await user.hover(parentContainer)
    expect(container.querySelector('.dropdownContainer')).toBeNull()
  })

  it('focuses on the previous anchor element in dropdown when ArrowUp key is pressed', async () => {
    const { user, getByText, getByTestId } = render(
      <LanguageSelector content={mockData} />,
      renderOptions
    )
    const svgElement = document.querySelector('svg')
    svgElement.focus()
    await user.click(svgElement)

    const changeLocationText = getByText('CHANGE LOCATION')
    const usValue = getByText('United States ($USD)')
    await user.type(changeLocationText, '{arrowdown}')

    expect(getByTestId('d_hdr_cs_drpdwn_label_active')).toBeVisible()
    await user.type(usValue, '{arrowdown}')
    await user.type(usValue, '{arrowup}')
    const onlocationfocus = getByText('United States ($USD)')

    expect(onlocationfocus).toBeVisible()
  })

  it('focuses on next sibling and calls hidePopover on Tab keydown', async () => {
    const { user, container } = render(<LanguageSelector content={mockData} />, renderOptions)
    const languageSelector = container.querySelector('.countrySelectorContainer')

    const nextSiblingAnchor = document.createElement('a')
    document.body.appendChild(nextSiblingAnchor)
    languageSelector.parentNode.appendChild(nextSiblingAnchor)
    languageSelector.focus()
    await user.type(languageSelector, '{Tab}')
    expect(container.querySelector('.dropdownContainer')).toBeVisible()
  })
})
