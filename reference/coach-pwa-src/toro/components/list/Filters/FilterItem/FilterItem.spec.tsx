import React from 'react'
import { render } from 'test-utils/react'
import { useAtom } from 'jotai'
import FilterItem, { useLoadFilterComponents } from 'toro/components/list/Filters/FilterItem'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'

// Mock dynamic imports and components
jest.mock('next/dynamic', () => jest.fn((fn) => fn()))
jest.mock('toro/components/list/Filters/FilterCheckboxes', () => () => <div>FilterCheckboxes</div>)
jest.mock('toro/components/list/Filters/FilterColors', () => () => <div>FilterColors</div>)
jest.mock('toro/components/list/Filters/FilterPrice', () => () => <div>FilterPrice</div>)
jest.mock('toro/components/list/Filters/FilterButtons', () => () => <div>FilterButtons</div>)

// Mock jotai and utilities
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(),
}))

jest.mock('jotai', () => {
  const originalModule = jest.requireActual('jotai')
  return {
    ...originalModule,
    useAtom: jest.fn(),
  }
})

// Mock components
jest.mock('toro/components/AccordionItem', () => ({ children }) => (
  <div>{children({ isExpanded: true })}</div>
))
jest.mock('toro/components/AccordionButton', () => (props) => <button {...props} />)
jest.mock('toro/components/AccordionPanel', () => (props) => <div {...props} />)
jest.mock('toro/components/Box', () => (props) => <div {...props} />)
jest.mock('toro/components/Text', () => (props) => <span {...props} />)
jest.mock('toro/components/list/Filters/FilterBusyOverlay', () => ({ children }) => (
  <div>{children}</div>
))

const handleAccordionButtonKeyDown = jest.fn()

const renderComponent = (props = {}) => {
  const styles = {
    accordionButton: {},
    FilterAccordionText: {},
    accordionSVG: {},
  }
  const refinement = {
    id: '1',
    name: 'Color',
    type: REFINEMENT_TYPE.COLOR,
  }
  const accordionIconExpanded = <span>Expanded</span>
  const accordionIconCollapsed = <span>Collapsed</span>
  return render(
    <FilterItem
      styles={styles}
      isMobile={false}
      refinement={refinement}
      accordionIconExpanded={accordionIconExpanded}
      accordionIconCollapsed={accordionIconCollapsed}
      handleAccordionButtonKeyDown={handleAccordionButtonKeyDown}
      {...props}
    />,
    renderOptions
  )
}

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      session: {},
    },
  },
}

describe('FilterItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should render FilterItem component', () => {
    ;(useAtom as jest.Mock).mockReturnValue([false, jest.fn()])
    const { getByText } = renderComponent({
      refinement: { id: '2', name: 'Attribute', type: REFINEMENT_TYPE.ATTRIBUTE },
    })
    expect(getByText('Attribute')).toBeInTheDocument()
    expect(getByText('Expanded')).toBeInTheDocument()
  })

  it('should load filter components on mouse enter', async () => {
    const setLoadFilterComponents = jest.fn(() => useLoadFilterComponents)
    ;(useAtom as jest.Mock).mockReturnValue([false, setLoadFilterComponents()])

    const { user, getByText } = renderComponent()
    await user.hover(getByText('Color'))
    expect(setLoadFilterComponents).toHaveBeenCalled()
  })

  it('should render appropriate filter component based on refinement type', () => {
    ;(useAtom as jest.Mock).mockReturnValue([true, jest.fn()])

    const { getByText } = renderComponent({
      refinement: { id: '2', name: 'Attribute', type: REFINEMENT_TYPE.ATTRIBUTE },
    })

    expect(getByText('Attribute')).toBeInTheDocument()
  })

  it('should handles accordion button key down event', async () => {
    ;(useAtom as jest.Mock).mockReturnValue([false, jest.fn()])

    const { user, getByText } = renderComponent()
    await user.type(getByText('Color'), '{Enter}')
    expect(handleAccordionButtonKeyDown).toHaveBeenCalled()
  })

  it('does not render filter component when isLoadFilterComponents is false', () => {
    ;(useAtom as jest.Mock).mockReturnValue([false, jest.fn()])

    const { queryByText } = renderComponent({ isMobile: true })

    expect(queryByText('FilterColors')).not.toBeInTheDocument()
  })
})
