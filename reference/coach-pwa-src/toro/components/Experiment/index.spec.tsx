import { render as jestRender } from 'test-utils/react'
import Experiment, { EXPERIMENT_VALIDATION_MESSAGES } from 'toro/components/Experiment'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useViewportType')

const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

const EXPERIMENT_ID = 'experimentA'
const TEST_ID = 'componentA'

const ComponentA = () => <div data-qa={TEST_ID}>ComponentA</div>

const render = (component: any) => jestRender(component, { contexts: {} })

describe('toro/components/Experiment/index.tsx', () => {
  describe('when using the "forIDs" whitelist', () => {
    beforeEach(() => {
      mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    })

    it('should render "ComponentA" when experiment A is enabled', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment forIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()
    })
    it('should not render "ComponentA" when experiment A is not enabled', () => {
      mockedUseExperiment.mockImplementation(() => false)
      const { queryByTestId } = render(
        <Experiment forIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
    })
  })
  describe('when using the "notForIDs" blacklist', () => {
    beforeEach(() => {
      mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    })

    it('should render "ComponentA" when experiment A is not enabled', () => {
      mockedUseExperiment.mockImplementation(() => false)
      const { queryByTestId } = render(
        <Experiment notForIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()
    })
    it('should not render "ComponentA" when experiment A is enabled', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment notForIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
    })
  })
  describe('when specifying a viewport', () => {
    it('should render "ComponentA" for desktop only when "forDesktop" is set', () => {
      mockedUseExperiment.mockImplementation(() => true)

      const Component = () => (
        <Experiment forIDs={EXPERIMENT_ID} forDesktop>
          <ComponentA />
        </Experiment>
      )

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: true, isMobile: false }))
      const { queryByTestId, rerender } = render(<Component />)
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }))
      rerender(<Component />)
      expect(elA).not.toBeInTheDocument()
    })
    it('should render "ComponentA" for mobile only when "forMobile" is set', () => {
      mockedUseExperiment.mockImplementation(() => true)

      const Component = () => (
        <Experiment forIDs={EXPERIMENT_ID} forMobile>
          <ComponentA />
        </Experiment>
      )

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }))
      const { queryByTestId, rerender } = render(<Component />)
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: true, isMobile: false }))
      rerender(<Component />)
      expect(elA).not.toBeInTheDocument()
    })
    it('should render "ComponentA" for both desktop and mobile when "forDesktop" and "forMobile" are not set', () => {
      mockedUseExperiment.mockImplementation(() => true)

      const Component = () => (
        <Experiment forIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: true, isMobile: false }))
      const { queryByTestId, rerender } = render(<Component />)
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }))
      rerender(<Component />)
      expect(elA).toBeInTheDocument()
    })
    it('should render "ComponentA" for both desktop and mobile when both "forDesktop" and "forMobile" are set', () => {
      mockedUseExperiment.mockImplementation(() => true)

      const Component = () => (
        <Experiment forDesktop forMobile forIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )

      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: true, isMobile: false }))
      const { queryByTestId, rerender } = render(<Component />)

      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()
      mockedUseViewportType.mockImplementationOnce(() => ({ isDesktop: false, isMobile: true }))
      rerender(<Component />)
      expect(elA).toBeInTheDocument()
    })
    it('should render "ComponentA" for desktop when "alwaysOnForDesktop" is set even if experiment A is not enabled', () => {
      mockedUseExperiment.mockImplementation(() => false)
      mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))

      const { queryByTestId } = render(
        <Experiment forIDs={EXPERIMENT_ID} alwaysOnForDesktop>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()
    })
    it('should render "ComponentA" for mobile when "alwaysOnForMobile" is set even if experiment A is not enabled', () => {
      mockedUseExperiment.mockImplementation(() => false)
      mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))

      const { queryByTestId } = render(
        <Experiment forIDs={EXPERIMENT_ID} alwaysOnForMobile>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).toBeInTheDocument()
    })
  })
  it('should not render "ComponentA" for mobile when "alwaysOnForDesktop" is set if experiment A is not enabled', () => {
    mockedUseExperiment.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))

    const { queryByTestId } = render(
      <Experiment forIDs={EXPERIMENT_ID} alwaysOnForDesktop>
        <ComponentA />
      </Experiment>
    )
    const elA = queryByTestId(TEST_ID)
    expect(elA).not.toBeInTheDocument()
  })
  it('should not render "ComponentA" for desktop when "alwaysOnForMobile" is set if experiment A is not enabled', () => {
    mockedUseExperiment.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))

    const { queryByTestId } = render(
      <Experiment forIDs={EXPERIMENT_ID} alwaysOnForMobile>
        <ComponentA />
      </Experiment>
    )
    const elA = queryByTestId(TEST_ID)
    expect(elA).not.toBeInTheDocument()
  })
  describe('input validation', () => {
    beforeEach(() => {
      mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    })

    it('should not render "ComponentA" when both the whitelist and the blacklist are configured', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment forIDs={EXPERIMENT_ID} notForIDs={EXPERIMENT_ID}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_CONFLICT
      )
    })
    it('should not render "ComponentA" when both the whitelist and the blacklist are missing', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_MISSING
      )
    })
    it(`should not render "ComponentA" when the whitelist is not a string`, () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment forIDs={0 as any}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_MISSING
      )
    })
    it(`should not render "ComponentA" when the blacklist is not a string`, () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment notForIDs={0 as any}>
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_MISSING
      )
    })
    it('should not render "ComponentA" when whitelist is an empty string', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment forIDs="">
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.INVALID_WHITELIST
      )
    })
    it('should not render "ComponentA" when blacklist is an empty string', () => {
      mockedUseExperiment.mockImplementation(() => true)
      const { queryByTestId } = render(
        <Experiment notForIDs="">
          <ComponentA />
        </Experiment>
      )
      const elA = queryByTestId(TEST_ID)
      expect(elA).not.toBeInTheDocument()
      expect(mockedConsoleError).toHaveBeenCalledWith(
        EXPERIMENT_VALIDATION_MESSAGES.INVALID_BLACKLIST
      )
    })
  })
})
