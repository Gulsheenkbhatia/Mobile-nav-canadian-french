const WIDGET_WINDOW_PARAMETERS = {
  controllers: 'sgProductControllers',
}

const INJECTED_CONTENT_ATTRIBUTE = 'data-sg-widget-id'
const INJECTED_WIDGET_SCRIPT_ATTRIBUTE = 'id'
const INJECTED_CHARITY_SCRIPT_ATTRIBUTE = 'charity-select-' // charity-select-8704963

export function scleanUpSGW(pluginID: string) {
  try {
    const injectedContent = document.querySelectorAll(
      `div[${INJECTED_CONTENT_ATTRIBUTE}="${pluginID}"]`
    )
    const injectedWidgetScripts = document.querySelectorAll(
      `script[${INJECTED_WIDGET_SCRIPT_ATTRIBUTE}="${pluginID}"]`
    )
    const injectedCharityScripts = document.querySelectorAll(
      `script.${INJECTED_CHARITY_SCRIPT_ATTRIBUTE}${pluginID}`
    )

    const elementsToRemove = Array.from(injectedContent).concat(
      Array.from(injectedWidgetScripts),
      Array.from(injectedCharityScripts)
    )

    window[WIDGET_WINDOW_PARAMETERS.controllers] = []

    elementsToRemove.forEach((element) => {
      element.remove()
    })
  } catch (e) {
    console.error('Shopping Gives Widget: Clean up script error:', e)
  }
}
