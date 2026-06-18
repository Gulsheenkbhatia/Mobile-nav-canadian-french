import { atomWithStorage } from 'jotai/utils'
import { STORAGE_SURVEY_STATUS } from 'toro/constants/storageIds'
import _get from 'lodash/get'
import { preferencesAtom } from 'store/preferences.atom'
import { currentLocaleAtom } from 'store/global.atom'
import { createAsyncStorage } from 'store/storage-utils'
import { atom } from 'jotai'
import { SurveyStatus } from 'toro/components/Survey'

export const DEFAULT_SURVEY_TIME_INTERVAL = 24

const surveyStorage = createAsyncStorage(0)

export const surveyStatusAtom = atom<SurveyStatus>(SurveyStatus.OPEN)

export const surveyLastInteractionAtom = atomWithStorage<number>(
  STORAGE_SURVEY_STATUS,
  0,
  surveyStorage
)

export const surveySessionyStatusAtom = atom((get) => {
  const surveyLastInteraction = get(surveyLastInteractionAtom)
  const surveyStatus = get(surveyStatusAtom)

  const preferences = get(preferencesAtom)
  const locale = get(currentLocaleAtom)

  if (surveyStatus === SurveyStatus.ANSWERED) {
    return true
  }
  const surveyTimeInterval = _get(
    preferences,
    `adaptiveExperience.surveyDetails[${locale}].waitTimeInHours`,
    DEFAULT_SURVEY_TIME_INTERVAL
  )

  const currentTime = Date.now()
  const elapsedTime = currentTime - surveyLastInteraction
  const thresholdTime = Number(surveyTimeInterval) * 60 * 60 * 1000

  return elapsedTime >= thresholdTime
})

export const updateSurveyLastInteractionAtom = atom(null, (_, set) => {
  set(surveyLastInteractionAtom, Date.now())
})
