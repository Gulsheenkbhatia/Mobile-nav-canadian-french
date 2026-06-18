import pick from 'lodash/pick'
import { useCallback } from 'react'
import { selectAtom, useAtomValue } from 'jotai/utils'
import flatten from 'lodash/flatten'
import camelCase from 'lodash/camelCase'
import { preferencesAtom } from 'store/preferences.atom'
import type { PreferencesAtomType } from 'store/preferences.atom'

type PreferencePayloadType = {
  [key: string]: readonly string[] | '*'
}

/**
 * Returns the specified preference group(s) together with the specified
 * preference IDs and their values.
 * Use the wildcard key '*' to get all preference IDs from the specified
 * preference group(s).
 * The group ID(s) will be normalized to camel case for consistency.
 *
 * @param {PreferencePayloadType} payload An object that contains the
 * group(s) of preferences and the specific preference IDs which we want
 * to retrieve.
 *
 * @example
 * // get specific preference IDs from a preference group
 * usePreference({ group1: ['p1', 'p2'] })
 * // => { group1: { p1: true, p2: 'test' } }
 *
 * @example
 * // get specific preference IDs from multiple preference groups
 * usePreference({ 'Group 1': ['p1', 'p2'], Group2: ['p1', 'p3'] })
 * // => { group1: { p1: true, p2: 'test' }, group2: { p1: 500, p3: false } }
 *
 * @example
 * // get all preference IDs from a preference group
 * usePreference({ group1: '*' })
 * // => { group1: { p1: true, p2: 'test', p3: { nested: true } } }
 */
const usePreference = (payload: PreferencePayloadType = {}): PreferencesAtomType => {
  // Flatten and stringify the preference IDs, so we can use them as dependency.
  const flattenedIds = flatten(Object.values(payload)).join()

  const pickPreferences = useCallback(
    (preferences: any) => {
      return Object.entries(payload).reduce<PreferencesAtomType>((acc, [groupId, prefIds]) => {
        const normalizedGroupId = camelCase(groupId)

        // Return all preferences in group if the wildcard key '*' is specified.
        if (prefIds === '*') {
          acc[normalizedGroupId] = preferences[groupId]
          return acc
        }

        // Otherwise, return the specified preferences only.
        const displayValueIds = prefIds.map((id) => `${id}DisplayValue` as const)
        acc[normalizedGroupId] = pick(preferences[groupId], [...prefIds, ...displayValueIds])

        return acc
      }, {})
    },
    [flattenedIds]
  )
  // https://jotai.org/docs/utilities/select#hold-stable-references
  return useAtomValue(selectAtom(preferencesAtom, pickPreferences))
}

export default usePreference
