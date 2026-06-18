import { ComponentType } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import first from 'lodash/first'
import keys from 'lodash/keys'
import camelCase from 'lodash/camelCase'

type WithFeatureFlagPreferencePayload = {
  [groupId: string]: [preferenceId: string]
}

/**
 * Higher-order component used to render argument component only when feature flag is "true".
 * @param {ComponentType<P>} Component Original component.
 * @param {WithFeatureFlagPreferencePayload} preferencePayload Preference payload passed to "usePreference()" hook.
 * Only the first preference ID of the first group is taken in consideration. The rest of payload is ignored.
 * @param {boolean} condition Condition to check against. It is "true" by default.
 * @returns {ComponentType<P>} Returns the component to be rendered or "null" if the feature flag value does not match the condition.
 */
const withFeatureFlag = function <T>(
  Component: ComponentType<T>,
  preferencePayload: WithFeatureFlagPreferencePayload = {},
  condition = true
) {
  return (props: T) => {
    const preferenceOutput = usePreference(preferencePayload)
    const groupId = first(keys(preferencePayload)) || ''
    const preferenceId = first(get(preferencePayload, groupId, []))
    const isEnabled = get(preferenceOutput, [camelCase(groupId), preferenceId], false)
    if (isEnabled !== condition) {
      return null
    }

    return <Component {...props} />
  }
}

export default withFeatureFlag
