import { createRef, RefObject } from 'react'
import { render } from 'test-utils/react'
import FiltersAccordion from 'toro/components/list/Filters/FiltersAccordion'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom' // to wait for async chakraui animations

// Define the type for the refinement objects
type Refinement = {
  id: number
  name: string
  options: any
  type: string
}

// Define the type for the props used in FiltersAccordion
interface FiltersAccordionProps {
  styles: { AccordionIconColor: string }
  accordionRef: RefObject<HTMLDivElement>
  disableScroll: boolean
  refinementsToRender: Refinement[]
  handleAccordionChange: jest.Mock
  handleAccordionScroll: jest.Mock
  expandedRefinementIndexes: number[]
  handleAccordionButtonKeyDown: jest.Mock
  isMobile?: boolean
  isKeyboardScrolling?: boolean
}

window.scrollTo = jest.fn()
jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))

describe('FiltersAccordion', () => {
  const props: FiltersAccordionProps = {
    styles: { AccordionIconColor: 'blue' },
    accordionRef: createRef(),
    disableScroll: true,
    refinementsToRender: [
      {
        id: 1,
        name: 'Size',
        options: [
          { refvalue: 'XS', selectable: true, href: '' },
          { refvalue: 'S', selectable: true, href: '' },
          { refvalue: 'M', selectable: true, href: '' },
          { refvalue: 'L', selectable: true, href: '' },
          { refvalue: 'XL', selectable: true, href: '' },
        ],
        type: 'refinementDefaultStyle',
      },
      {
        id: 2,
        name: 'Color',
        options: [
          { refvalue: 'Beige', selectable: true, href: '' },
          { refvalue: 'Pink', selectable: true, href: '' },
        ],
        type: 'refinementDefaultStyle',
      },
      {
        id: 3,
        name: 'Categories',
        options: [
          { refvalue: 'Bags', selectable: true, href: '' },
          { refvalue: 'Wallets', selectable: true, href: '' },
          { refvalue: 'Wristlets', selectable: true, href: '' },
          { refvalue: 'Clothing', selectable: true, href: '' },
          { refvalue: 'Shoes', selectable: true, href: '' },
          { refvalue: 'Accessories', selectable: true, href: '' },
        ],
        type: 'refinementCheckboxStyle',
      },
    ],
    handleAccordionChange: jest.fn(),
    handleAccordionScroll: jest.fn(),
    expandedRefinementIndexes: [0],
    handleAccordionButtonKeyDown: jest.fn(),
  }

  const makeSetup = (customProps: any = {}) => {
    return render(<FiltersAccordion {...props} {...customProps} />, {
      contexts: { PWAContext: { appData: {} }, AnalyticsContext: {} },
    })
  }

  it('renders FilterItem components based on refinementsToRender', () => {
    const { getByText } = makeSetup()
    props.refinementsToRender.forEach((refinement) => {
      const filterItems = getByText(refinement.name)
      expect(filterItems).toBeVisible()
    })
  })

  it('sets correct classNames based on the scrolling functionality', () => {
    const { container } = makeSetup({
      isMobile: true,
      disableScroll: false,
      isKeyboardScrolling: true,
    })
    const accordionElement = container.querySelector('.is-keyboard-scrolling')
    const customScrollbar = container.querySelector('.custom-scrollbar')
    expect(accordionElement).toBeVisible()
    expect(customScrollbar).toBeVisible()
  })

  it('calls onChange when the accordion state changes', async () => {
    const { getAllByTestId } = makeSetup()

    const user = userEvent.setup()
    const testId = 'plpfltr_body_fltr_acord'
    const button = getAllByTestId(testId)[0]

    await user.click(button)
    await waitFor(() => {
      expect(props.handleAccordionChange).toHaveBeenCalled()
    })
  })

  it('assigns the provided ref to the Accordion', () => {
    const { getByText } = makeSetup()
    expect(props.accordionRef.current).toContainElement(getByText('Size'))
  })

  it('useAccordionIcons returns correct accordion icons', async () => {
    const { getByTestId, getAllByTestId } = makeSetup()

    const iconExpanded = getByTestId('plpfltr_icon_fltr_acord_up_arrow')
    const iconsCollapsed = getAllByTestId('plpfltr_icon_fltr_acord_down_arrow')

    expect(iconExpanded).toBeVisible()
    expect(iconsCollapsed[0]).toBeVisible()
  })
})
