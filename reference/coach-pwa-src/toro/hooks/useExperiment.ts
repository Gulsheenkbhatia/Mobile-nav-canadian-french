import { useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'
import { experimentsAtom } from 'store/experiments.atom'
import isString from 'lodash/isString'

export const USE_EXPERIMENT_VALIDATION_MESSAGES = {
  INVALID_IDS: '[useExperiment] Invalid format provided for experiment IDs.',
}

const useExperiment = (ids: string = '') => {
  const experiments = useAtomValue(experimentsAtom)
  return useMemo(() => {
    if (!isString(ids)) {
      console.error(USE_EXPERIMENT_VALIDATION_MESSAGES.INVALID_IDS)
      return false
    }
    const splitIds = ids.split('-')
    const splitExperiments = experiments.split('-')
    return splitExperiments.some((experimentId: string) => splitIds.includes(experimentId))
  }, [ids, experiments])
}

export default useExperiment
