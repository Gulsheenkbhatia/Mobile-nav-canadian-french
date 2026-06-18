import type { NextApiRequest } from 'next'
import isExperimentEnabled from 'toro/helpers/isExperimentEnabled'
import { EXPERIMENTS } from 'toro/constants/experiments'
import getViewportByReq from 'toro/helpers/getViewportByReq'
import isEmpty from 'lodash/isEmpty'
export interface OnModelPLPAttribute {
  template?: string
  enable: boolean
  isOnModelTabActive?: boolean
  images: string[]
}

export const getOnModelFlags = (
  req: NextApiRequest,
  onModelPLPAttribute?: OnModelPLPAttribute,
  siteOnModelPLPConfig?: OnModelPLPAttribute
) => {
  const viewport = getViewportByReq(req)
  const isMobile = viewport === 'mobile'

  const effectiveConfig = [onModelPLPAttribute, siteOnModelPLPConfig].find(
    (config: OnModelPLPAttribute) => !isEmpty(config)
  )

  if (!effectiveConfig?.enable || !isMobile) {
    return {}
  }

  const template = effectiveConfig?.template?.toLowerCase()
  const is1UpTemplate = template === '1up'
  const is2UpTemplate = template === '2up'

  const isOnModel1UpToggleEnabled =
    isExperimentEnabled(req, EXPERIMENTS.ON_MODEL_PLP_TOGGLE) && is1UpTemplate
  const isOnModel2UpToggleEnabled =
    isExperimentEnabled(req, EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE) && is2UpTemplate

  const isOnModel1UpEnabled = isExperimentEnabled(req, EXPERIMENTS.ON_MODEL_PLP) && is1UpTemplate
  const isOnModel2UpEnabled =
    isExperimentEnabled(req, EXPERIMENTS.ON_MODEL_PLP_2_UP) && is2UpTemplate

  const isOnModelPLPToggleEnabled = isOnModel1UpToggleEnabled || isOnModel2UpToggleEnabled
  const isOnModelEnabled = isOnModel1UpEnabled || isOnModel2UpEnabled

  const isOnModelTabActive = isOnModelPLPToggleEnabled && effectiveConfig.isOnModelTabActive
  const onModelPlpSequence =
    isOnModelPLPToggleEnabled || isOnModelEnabled ? effectiveConfig.images : undefined

  return {
    onModelPlpSequence,
    isOnModelTabActive,
    isOnModelPLPToggleEnabled,
    isOnModel2UpToggleEnabled,
    showOnModel2Up: isOnModel2UpEnabled || (isOnModel2UpToggleEnabled && isOnModelTabActive),
  }
}
