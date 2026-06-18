import type { NextApiRequest } from 'next'
import Cookies from 'cookies'
import { OPTIMIZELY_ENABLED_FEATURES } from 'toro/constants/cookies'
import isString from 'lodash/isString'

const isExperimentEnabled = (
  req: NextApiRequest,
  experimentIds: string = '',
  isCustomReq: boolean = false
): boolean => {
  if (!isString(experimentIds)) {
    return false
  }

  const activeExperiments = getActiveExperiments(req, isCustomReq)

  const splitIds = experimentIds.split('-')

  return splitIds.some((experimentId) => activeExperiments.includes(experimentId))
}

export const getActiveExperiments = (
  req: NextApiRequest,
  isCustomReq: boolean = false
): string[] => {
  const { ENV_CONTROLLED_EXPERIMENTS } = process.env
  const opt_features = (req.query?.opt_features || '') as string
  let optFeaturesCookie

  if (isCustomReq) {
    optFeaturesCookie = req.cookies?.opt_features
  } else {
    const cookies = new Cookies(req)
    optFeaturesCookie = cookies?.get(OPTIMIZELY_ENABLED_FEATURES)
  }

  return [
    ...(ENV_CONTROLLED_EXPERIMENTS?.split('-') ?? []),
    ...(optFeaturesCookie?.split('-') ?? []),
    ...(opt_features?.split('-') ?? []),
  ]
}

export default isExperimentEnabled
