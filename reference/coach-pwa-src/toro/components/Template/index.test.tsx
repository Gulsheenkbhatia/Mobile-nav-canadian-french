import React from 'react'
import { render, screen } from 'test-utils/react'
import Template from './index'
import useTemplate from 'toro/hooks/useTemplate'
import useViewportType from 'toro/hooks/useViewportType'
import { TemplateName } from 'toro/constants/templates'

jest.mock('toro/hooks/useTemplate')
jest.mock('toro/hooks/useViewportType')

interface SetupProps {
  isTemplateEnabled?: boolean
  isDesktop?: boolean
  isMobile?: boolean
  forIDs?: TemplateName[]
  notForIDs?: TemplateName[]
  forDesktop?: boolean
  forMobile?: boolean
  alwaysOnForDesktop?: boolean
  alwaysOnForMobile?: boolean
  children?: React.ReactNode
}

describe('Template Component', () => {
  const mockChildren = <div data-qa="test-children">Test Content</div>
  const mockTemplateId = TemplateName.pdpv5

  const makeSetup = (props: SetupProps = {}) => {
    const {
      isTemplateEnabled = true,
      isDesktop = true,
      isMobile = false,
      children,
      ...restProps
    } = props

    // Dynamic mock implementations based on props
    jest.mocked(useTemplate).mockReturnValue(isTemplateEnabled)
    jest.mocked(useViewportType).mockReturnValue({
      isDesktop,
      isMobile,
    })

    const defaultProps = {
      ...(restProps.notForIDs ? {} : { forIDs: [mockTemplateId] }),
      ...restProps,
    }

    const renderResult = render(<Template {...defaultProps}>{children || mockChildren}</Template>)

    return {
      ...renderResult,
      children: screen.queryByTestId('test-children'),
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Validation Tests', () => {
    it('should not render when both forIDs and notForIDs are provided with same template id', () => {
      makeSetup({
        forIDs: [mockTemplateId],
        notForIDs: [mockTemplateId],
      })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should not render when forIDs is an empty array', () => {
      makeSetup({ forIDs: [] })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should not render when notForIDs is an empty array', () => {
      makeSetup({ notForIDs: [] })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should not render when neither forIDs nor notForIDs are provided', () => {
      makeSetup({ forIDs: undefined, notForIDs: undefined })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })
  })

  describe('Viewport Tests', () => {
    it('should render on desktop when forDesktop is true', () => {
      makeSetup({ forDesktop: true, isDesktop: true })
      expect(screen.getByText('Test Content')).toBeVisible()
    })

    it('should not render on desktop when forMobile is true', () => {
      makeSetup({ forMobile: true, isDesktop: true })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should render on mobile when forMobile is true', () => {
      makeSetup({
        forMobile: true,
        isDesktop: false,
        isMobile: true,
      })
      expect(screen.getByText('Test Content')).toBeVisible()
    })
  })

  describe('Template Experiment Tests', () => {
    it('should render when template is enabled and using forIDs', () => {
      makeSetup({ isTemplateEnabled: true, forDesktop: true })
      expect(screen.getByText('Test Content')).toBeVisible()
    })

    it('should not render when template is disabled and using forIDs', () => {
      makeSetup({ isTemplateEnabled: false })
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
    })

    it('should render when template is disabled and using notForIDs', () => {
      makeSetup({
        notForIDs: [mockTemplateId],
        isTemplateEnabled: false,
        forDesktop: true,
      })
      expect(screen.getByText('Test Content')).toBeVisible()
    })
  })

  describe('Always On Tests', () => {
    it('should always render on desktop when alwaysOnForDesktop is true', () => {
      makeSetup({
        alwaysOnForDesktop: true,
        isTemplateEnabled: false,
        isDesktop: true,
      })
      expect(screen.getByText('Test Content')).toBeVisible()
    })

    it('should always render on mobile when alwaysOnForMobile is true', () => {
      makeSetup({
        alwaysOnForMobile: true,
        isTemplateEnabled: false,
        isDesktop: false,
        isMobile: true,
      })
      expect(screen.getByText('Test Content')).toBeVisible()
    })
  })

  describe('Children Rendering Tests', () => {
    it('should render children when all conditions are met', () => {
      makeSetup({ forDesktop: true })
      expect(screen.getByText('Test Content')).toBeVisible()
    })

    it('should render multiple children', () => {
      const multipleChildren = (
        <>
          <div data-qa="child-1">Child 1</div>
          <div data-qa="child-2">Child 2</div>
        </>
      )

      makeSetup({
        forDesktop: true,
        children: multipleChildren,
      })
      expect(screen.getByText('Child 1')).toBeVisible()
      expect(screen.getByText('Child 2')).toBeVisible()
    })
  })
})
