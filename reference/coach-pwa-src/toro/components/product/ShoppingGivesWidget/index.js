import { memo } from 'react'

import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { SGWidgetWithEnabledPreferences } from 'toro/components/product/ShoppingGivesWidget/SGWidgetWithEnabledPreferences'

/*
 * SGW: Shopping Gives Widget
 * Documentation: https://confluence.tapestry.support/display/SWNA/Shopping+Gives#ShoppingGives-Displaylogic
 *
 * you might need to set SHOPPING_GIVES_CONFIG_MODE=development in your .env
 * to have the required property: configMode
 *
 * SGW is a client side widget that is used to display the Shopping Gives Charity options on the product page.
 *
 * To display the widget, we need to go through the following steps:
 * 1. Check if BM(application preferences) has the SGW enabled.
 * 2. Check the Shopping Gives API to see if the product is eligible for SGW.
 * 3. If the previous steps are successful, we can display the initial UI with the CTA.
 * 4. If the user authorized, we can load the Shopping Gives Script.
 *
 * BM enabled (yes) => SG API enabled () => User authorized (yes) => SGW Script loaded
 * */
export default withErrorBoundaryWrapper(memo(SGWidgetWithEnabledPreferences))
