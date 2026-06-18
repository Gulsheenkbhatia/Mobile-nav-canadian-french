import { useMemo } from 'react'
import camelCase from 'lodash/camelCase'
import { useAtomValue } from 'jotai/utils'

import { isSubBrandActiveAtom } from 'store/global.atom'

import usePreference from 'toro/hooks/usePreference_new'
import {
  SHOPPING_GIVES_URL,
  SHOPPING_GIVES_GROUP_ID,
  SHOPPING_GIVES_STORE_ID,
  SHOPPING_GIVES_IS_ENABLED,
  SHOPPING_GIVES_SUB_BRAND_ID,
  SHOPPING_GIVES_GUEST_IS_ENABLED,
  SHOPPING_GIVES_INSIDER_IS_ENABLED,
  SHOPPING_GIVES_GUEST_CUSTOMER_SEGMENT,
  SHOPPING_GIVES_GUEST_IS_ENABLED_SUB_BRAND,
  SHOPPING_GIVES_INSIDER_IS_ENABLED_SUB_BRAND,
} from 'toro/site-preferences'

export type UseShoppingGivesPreferences = {
  shoppingGivesBMIsEnabled: boolean
  shoppingGivesGuestEnabled: boolean
  shoppingGivesInsiderEnabled: boolean
  shoppingGivesUrl: string | undefined
  shoppingGivesStoreId: string | undefined
  shoppingGivesGuestCustomerSegment: string
}

// TODO: make SHOPPING_GIVES_GROUP_ID camelCased, and adjust all usages
const SHOPPING_GIVES_GROUP_ID_CAMELCASED = camelCase(SHOPPING_GIVES_GROUP_ID)

export function useShoppingGivesPreferences(): UseShoppingGivesPreferences {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const preferencesPayload = useMemo(
    () => getPreferencesPayload(isSubBrandActive),
    [isSubBrandActive]
  )

  const preferences = usePreference(preferencesPayload)
  const shoppingGives = preferences[SHOPPING_GIVES_GROUP_ID_CAMELCASED]
  const activeBrandKey = isSubBrandActive
    ? SHOPPING_GIVES_SUB_BRAND_ID
    : SHOPPING_GIVES_GROUP_ID_CAMELCASED

  return {
    shoppingGivesUrl: shoppingGives?.[SHOPPING_GIVES_URL],
    shoppingGivesStoreId: shoppingGives?.[SHOPPING_GIVES_STORE_ID],
    shoppingGivesBMIsEnabled: shoppingGives?.[SHOPPING_GIVES_IS_ENABLED] || false,
    shoppingGivesGuestCustomerSegment: shoppingGives?.[SHOPPING_GIVES_GUEST_CUSTOMER_SEGMENT] || '',
    // conditionally pick the preference depending on if it's a sub brand or not
    shoppingGivesGuestEnabled:
      preferences[activeBrandKey]?.[
        isSubBrandActive
          ? SHOPPING_GIVES_GUEST_IS_ENABLED_SUB_BRAND
          : SHOPPING_GIVES_GUEST_IS_ENABLED
      ] || false,
    shoppingGivesInsiderEnabled:
      preferences[activeBrandKey]?.[
        isSubBrandActive
          ? SHOPPING_GIVES_INSIDER_IS_ENABLED_SUB_BRAND
          : SHOPPING_GIVES_INSIDER_IS_ENABLED
      ] || false,
  }
}

function getPreferencesPayload(isSubBrandActive: boolean) {
  const preferencesPayload = {
    [SHOPPING_GIVES_GROUP_ID]: [
      SHOPPING_GIVES_URL,
      SHOPPING_GIVES_STORE_ID,
      SHOPPING_GIVES_IS_ENABLED,
      SHOPPING_GIVES_GUEST_CUSTOMER_SEGMENT,
    ],
  }

  if (isSubBrandActive) {
    preferencesPayload[SHOPPING_GIVES_SUB_BRAND_ID] = [
      SHOPPING_GIVES_GUEST_IS_ENABLED_SUB_BRAND,
      SHOPPING_GIVES_INSIDER_IS_ENABLED_SUB_BRAND,
    ]
  } else {
    preferencesPayload[SHOPPING_GIVES_GROUP_ID].push(SHOPPING_GIVES_GUEST_IS_ENABLED)
    preferencesPayload[SHOPPING_GIVES_GROUP_ID].push(SHOPPING_GIVES_INSIDER_IS_ENABLED)
  }

  return preferencesPayload
}
