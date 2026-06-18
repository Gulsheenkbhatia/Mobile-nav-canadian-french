import mergeWith from 'lodash/mergeWith'
import pdpModernTheme from 'toro/components/product/desktop/theme/v7/theme'

const TemplateContainerKateSpade = {
  baseStyle: () => ({}),
}

const pdpModernKateSpadeTheme = {
  components: {
    TemplateContainer: TemplateContainerKateSpade,
  },
}

export default mergeWith({}, pdpModernTheme, pdpModernKateSpadeTheme)
