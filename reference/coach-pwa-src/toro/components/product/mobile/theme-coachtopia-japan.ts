import mergeWith from 'lodash/mergeWith'
import { themeMerger } from 'store/theme-with-experiments.atom'
import pdpV6Theme from 'toro/components/product/mobile/theme'
import FreeShippingAndReturns from 'toro/components/product/mobile/FreeShippingAndReturns/themes/theme-coachtopia-japan'
import VarietyOfPayment from 'toro/components/product/mobile/VarietyOfPayment/themes/theme-coachtopia-japan'
import FastShipping from 'toro/components/product/mobile/FastShipping/themes/theme-coachtopia-japan'
import { styles } from 'toro/components/product/mobile/styles'

const pdpV6CoachtopiaTheme = {
  styles,
  components: {},
}

const baseTheme = mergeWith({}, pdpV6Theme, pdpV6CoachtopiaTheme, themeMerger(pdpV6Theme))

const deeplyMergedComponents = {
  components: {
    FreeShippingAndReturns,
    VarietyOfPayment,
    FastShipping,
  },
}

const finalTheme = mergeWith({}, baseTheme, deeplyMergedComponents, themeMerger(baseTheme))

export default finalTheme
