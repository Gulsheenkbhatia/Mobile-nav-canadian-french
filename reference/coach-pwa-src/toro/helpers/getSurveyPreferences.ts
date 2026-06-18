import get from 'lodash/get'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import type { NextApiRequest } from 'next'
import type { PreferencesAtomGroupType } from 'store/preferences.atom'

type GetSurvePreferencesParams = {
  preferences: PreferencesAtomGroupType
  req: NextApiRequest
}

export function getSurveyPreferences({ preferences, req }: GetSurvePreferencesParams) {
  const locale = getLocaleFromReq(req, true)
  const surveySlot = get(preferences, `surveyDetails[${locale}]`)

  return surveySlot
}
