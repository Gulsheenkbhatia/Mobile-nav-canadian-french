import { useAtomValue } from 'jotai/utils'
import { renderHook } from 'test-utils/react'
import useExperiment, { USE_EXPERIMENT_VALIDATION_MESSAGES } from 'toro/hooks/useExperiment'

jest.mock('jotai/utils')

const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

const mockedUseAtomValue = useAtomValue as any
const setupExperiments = (experiments: string = '') => renderHook(() => useExperiment(experiments))

describe('toro/hooks/useExperiment.ts', () => {
  it('should return "false" when a string of experiment IDs is not supplied', () => {
    mockedUseAtomValue.mockImplementationOnce(() => {
      return ''
    })
    const { result } = setupExperiments([] as any)
    const isMyTestEnabled = result.current
    expect(isMyTestEnabled).toEqual(false)
    expect(mockedConsoleError).toHaveBeenCalledWith(USE_EXPERIMENT_VALIDATION_MESSAGES.INVALID_IDS)
  })

  describe('when multiple experiments are enabled', () => {
    it('should return "false" when the user is not part of any of the experiments', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return ''
      })
      const { result } = setupExperiments('myTest-otherTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(false)
    })
    it('should return "true" when the user is part of one of the experiments', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return 'otherTest'
      })
      const { result } = setupExperiments('myTest-otherTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(true)
    })
    it('should return "true" when the user is part of multiple experiments', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return 'myTest-otherTest'
      })
      const { result } = setupExperiments('myTest-otherTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(true)
    })
  })

  describe('when only one experiment is enabled', () => {
    it('should return "false" when the user is not part of the experiment', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return ''
      })
      const { result } = setupExperiments('myTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(false)
    })
    it('should return "true" when the user is part of the experiment', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return 'myTest'
      })
      const { result } = setupExperiments('myTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(true)
    })
    it('should return "true" when the user is part of multiple experiments', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return 'myTest-otherTest'
      })
      const { result } = setupExperiments('myTest')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(true)
    })
  })

  describe('when no experiments are enabled', () => {
    it('should return "false" when checking if the user is part of an experiment', () => {
      mockedUseAtomValue.mockImplementationOnce(() => {
        return 'myTest'
      })
      const { result } = setupExperiments('')
      const isMyTestEnabled = result.current
      expect(isMyTestEnabled).toEqual(false)
    })
  })
})
