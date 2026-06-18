import { atom } from 'jotai'
import { getExperiments } from 'toro/helpers/experiments'

export const envControlledExperimentsAtom = atom<string>('')

export const experimentsAtom = atom('')
export const setIncomingExperimentsAtom = atom(null, (get, set, incomingExperiments: string) => {
  const envControlledExperiments = get(envControlledExperimentsAtom)
  const experiments = getExperiments(envControlledExperiments, incomingExperiments)
  set(experimentsAtom, experiments)
})
