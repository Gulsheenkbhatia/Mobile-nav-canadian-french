import React from 'react'
import isString from 'lodash/isString'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'

type ExperimentProps = {
  forIDs?: string
  notForIDs?: string
  forDesktop?: boolean
  forMobile?: boolean
  alwaysOnForDesktop?: boolean
  alwaysOnForMobile?: boolean
  children?: React.ReactNode
}

export const EXPERIMENT_VALIDATION_MESSAGES = {
  WHITELIST_BLACKLIST_CONFLICT: '[Experiment] You cannot use both whitelist and blacklist IDs.',
  INVALID_WHITELIST:
    '[Experiment] You are trying to whitelist IDs, but you are sending an empty string instead.',
  INVALID_BLACKLIST:
    '[Experiment] You are trying to blacklist IDs, but you are sending an empty string instead.',
  WHITELIST_BLACKLIST_MISSING: '[Experiment] No whitelist or blacklist IDs found.',
}

const validateConfig = (forIDs: string, notForIDs: string) => {
  if (isString(forIDs) && isString(notForIDs) && forIDs.length > 0 && notForIDs.length > 0) {
    console.error(EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_CONFLICT)
    return false
  }

  if (isString(forIDs) && forIDs.length === 0) {
    console.error(EXPERIMENT_VALIDATION_MESSAGES.INVALID_WHITELIST)
    return false
  }

  if (isString(notForIDs) && notForIDs.length === 0) {
    console.error(EXPERIMENT_VALIDATION_MESSAGES.INVALID_BLACKLIST)
    return false
  }

  if (!isString(forIDs) && !isString(notForIDs)) {
    console.error(EXPERIMENT_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_MISSING)
    return false
  }

  return true
}

const withValidation = (ExperimentComponent) => (props: ExperimentProps) => {
  const isConfigValid = validateConfig(props?.forIDs, props?.notForIDs)
  if (!isConfigValid) {
    return null
  }

  return <ExperimentComponent {...props} />
}

/**
 * Experiment is a component that conditionally renders its children based on experiment IDs and viewport types.
 * It is designed to facilitate A/B testing and feature flagging by controlling which components are visible under specific conditions.
 *
 * Props:
 * - forIDs (string): Experiment IDs for which the component should render its children.
 * - notForIDs (string): Experiment IDs for which the component should not render its children.
 * - forDesktop (boolean): If true, renders children only on desktop devices.
 * - forMobile (boolean): If true, renders children only on mobile devices.
 * - alwaysOnForDesktop (boolean): If true, always renders children on desktop devices.
 * - alwaysOnForMobile (boolean): If true, always renders children on mobile devices.
 * - children (React.ReactNode): The content to be conditionally rendered.
 *
 * Bundle Optimization Benefits:
 * - Conditional Rendering: Reduces unnecessary code execution by rendering components only when relevant experiments are active.
 *
 * For more details on bundle optimization, refer to the Confluence documentation:
 * https://confluence.tapestry.support/spaces/PF/pages/1248692088/Bundle+Optimization+%E2%80%93+Implementation+Documentation
 *
 * Usage:
 * The component uses the `useExperiment` hook to determine if the experiment is active and the `useViewportType` hook to check the device type.
 * It conditionally renders its children based on these conditions.
 */
const Experiment = ({
  forIDs,
  notForIDs,
  forDesktop,
  forMobile,
  alwaysOnForDesktop,
  alwaysOnForMobile,
  children,
}: ExperimentProps) => {
  const isUsingWhitelist = !!forIDs
  const ids = isUsingWhitelist ? forIDs : notForIDs
  const isExperimentEnabled = useExperiment(ids)
  const { isDesktop, isMobile } = useViewportType()

  const shouldAlwaysRenderChildren =
    (isDesktop && alwaysOnForDesktop) || (isMobile && alwaysOnForMobile)

  const canRenderChildrenForExperiment =
    (isUsingWhitelist && isExperimentEnabled) || (!isUsingWhitelist && !isExperimentEnabled)

  const canRenderChildrenForViewport =
    (forDesktop && isDesktop) || (forMobile && isMobile) || (!forDesktop && !forMobile)

  const canRenderChildren =
    shouldAlwaysRenderChildren || (canRenderChildrenForExperiment && canRenderChildrenForViewport)

  if (!canRenderChildren) {
    return null
  }

  return <>{children}</>
}

export default withValidation(Experiment)
