import React from 'react'
import useTemplate from 'toro/hooks/useTemplate'
import useViewportType from 'toro/hooks/useViewportType'
import { TemplateNames } from 'toro/constants/templates'
import isArray from 'lodash/isArray'

type TemplateProps = {
  forIDs?: TemplateNames
  notForIDs?: TemplateNames
  forDesktop?: boolean
  forMobile?: boolean
  alwaysOnForDesktop?: boolean
  alwaysOnForMobile?: boolean
  children?: React.ReactNode
}

export const TEMPLATE_VALIDATION_MESSAGES = {
  WHITELIST_BLACKLIST_CONFLICT: '[Template] You cannot use both whitelist and blacklist IDs.',
  INVALID_WHITELIST:
    '[Template] You are trying to whitelist IDs, but you are sending an empty string instead.',
  INVALID_BLACKLIST:
    '[Template] You are trying to blacklist IDs, but you are sending an empty string instead.',
  WHITELIST_BLACKLIST_MISSING: '[Template] No whitelist or blacklist IDs found.',
}

const validateConfig = (forIDs: TemplateNames, notForIDs: TemplateNames) => {
  if (isArray(forIDs) && isArray(notForIDs) && forIDs.length > 0 && notForIDs.length > 0) {
    console.error(TEMPLATE_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_CONFLICT)
    return false
  }

  if (isArray(forIDs) && forIDs.length === 0) {
    console.error(TEMPLATE_VALIDATION_MESSAGES.INVALID_WHITELIST)
    return false
  }

  if (isArray(notForIDs) && notForIDs.length === 0) {
    console.error(TEMPLATE_VALIDATION_MESSAGES.INVALID_BLACKLIST)
    return false
  }

  if (!isArray(forIDs) && !isArray(notForIDs)) {
    console.error(TEMPLATE_VALIDATION_MESSAGES.WHITELIST_BLACKLIST_MISSING)
    return false
  }

  return true
}

const withValidation = (TemplateComponent) => (props: TemplateProps) => {
  const isConfigValid = validateConfig(props?.forIDs, props?.notForIDs)
  if (!isConfigValid) {
    return null
  }

  return <TemplateComponent {...props} />
}

/**
 * TemplateComponent is a component that conditionally renders its children
 * based on specified template IDs and viewport types.
 *
 * Props:
 * - forIDs (TemplateNames): Template IDs for which the component should render its children.
 * - notForIDs (TemplateNames): Template IDs for which the component should not render its children.
 * - forDesktop (boolean): If true, renders children only on desktop devices.
 * - forMobile (boolean): If true, renders children only on mobile devices.
 * - alwaysOnForDesktop (boolean): If true, always renders children on desktop devices.
 * - alwaysOnForMobile (boolean): If true, always renders children on mobile devices.
 * - children (React.ReactNode): The content to be conditionally rendered.
 *
 * Benefits for Bundle Optimization:
 * - Conditional Rendering: Reduces the amount of code executed on the client side, improving performance.
 * - Code Splitting: Allows for deferring the loading of non-critical components until needed.
 * - Viewport-Specific Loading: Ensures only necessary code for the current device is loaded, optimizing bundle size.
 *
 * For more details on bundle optimization, refer to the Confluence documentation:
 * https://confluence.tapestry.support/spaces/PF/pages/1248692088/Bundle+Optimization+%E2%80%93+Implementation+Documentation
 *
 */
const TemplateComponent = ({
  forIDs,
  notForIDs,
  forDesktop,
  forMobile,
  alwaysOnForDesktop,
  alwaysOnForMobile,
  children,
}: TemplateProps) => {
  const isUsingWhitelist = !!forIDs
  const ids = isUsingWhitelist ? forIDs : notForIDs
  const isTemplateEnabled = useTemplate(ids)
  const { isDesktop, isMobile } = useViewportType()

  const shouldAlwaysRenderChildren =
    (isDesktop && alwaysOnForDesktop) || (isMobile && alwaysOnForMobile)

  const canRenderChildrenForExperiment =
    (isUsingWhitelist && isTemplateEnabled) || (!isUsingWhitelist && !isTemplateEnabled)

  const canRenderChildrenForViewport =
    (forDesktop && isDesktop) || (forMobile && isMobile) || (!forDesktop && !forMobile)

  const canRenderChildren =
    shouldAlwaysRenderChildren || (canRenderChildrenForExperiment && canRenderChildrenForViewport)

  if (!canRenderChildren) {
    return null
  }

  return <>{children}</>
}

export default withValidation(TemplateComponent)
