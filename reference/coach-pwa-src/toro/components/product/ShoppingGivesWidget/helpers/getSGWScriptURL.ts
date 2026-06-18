import { configModeMap } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledPreferences'

// Should be a document query selector
const WIDGET_CTA_CONTAINER = '.shopping-gives-widget'

type GetSGWScriptURLProps = {
  masterId: string
  configMode: string
  promotionPrice: number
  shoppingGivesStoreId: string
}

export function getSGWScriptURL(parameters: GetSGWScriptURLProps): string | null {
  const isAllParametersProvided = Object.values(parameters).every((parameter) => !!parameter)

  if (!isAllParametersProvided) {
    console.error('Shopping Gives Widget: getSGWScriptURL missing dynamic parameters', parameters)
    return null
  }

  const { masterId, configMode, promotionPrice, shoppingGivesStoreId } = parameters
  const environment = configModeMap[configMode]

  return `/scripts/contained-product.${environment}.js?sid=${shoppingGivesStoreId}&price=${promotionPrice}&subitem-id=${masterId}&target-element=${WIDGET_CTA_CONTAINER}`
}
