import get from 'lodash/get'

import { useAtomValue } from 'jotai/utils'
import { type ComponentType } from 'react'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

const availableForSwitch = [
  'ymal',
  'recentlyviewed',
  'addtocart',
  'home1_rr',
  'home3_rr',
  'productlisting1_rr',
  'productlisting2_rr',
  'productlisting3_rr',
  'productlisting4_rr',
  'product3_rr',
  'product6_rr',
  'productlisting7_rr',
  'sm_el_sitevisit1',
]

const denyVariantsForSwitch = ['aeDrawerGrid', 'metaPLP']

// This is necessary because of inconsistencies in our code base.
// In most cases the 'ymal' scheme type is incorrectly passed as 'yaml'
const sanitizeSchemeType = (type: string) => (/yaml/.test(type) ? 'ymal' : type)

export const noop = () => null

const withVendorSwitch = function <T>(
  Component: ComponentType<T>,
  SecondComponent: ComponentType<T> = noop
) {
  return (props: T & { type?: string; variant?: string }) => {
    const { recommendations = false } = useAtomValue(xgenFeaturesAtom)

    const recommendationType = sanitizeSchemeType(get(props, 'type', ''))
    const isMatchingRecommendation = availableForSwitch.includes(recommendationType)
    const isDenyVariant = denyVariantsForSwitch.includes(props.variant)

    return recommendations && isMatchingRecommendation && !isDenyVariant ? (
      <SecondComponent {...props} type={recommendationType} />
    ) : (
      <Component {...props} />
    )
  }
}

export default withVendorSwitch
