import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

/*
 * The _CONTAINER selector is for handling the event listeners
 * The format should be compatible for the querySelector
 * */
const WIDGET_CTA_CONTAINER = '.shopping-gives-widget'
const CHARITY_MODAL_CONTAINER = '.charity-select-modal-overlay'
const LEARN_MORE_MODAL_CONTAINER = '.sg-learn-more-modal-overlay'

/*
 * The _SELECTORS values are exact the seme format as in the HTML
 * The format should be compatible for the event.target.classList operations
 *
 * HTML: <div class="select-text sg-open-charity-select" />
 * use: 'select-text sg-open-charity-select' or by a single class name 'sg-open-charity-select'
 * */
const CHARITY_MODAL_EVENT_SELECTORS = {
  closeCharityModalButton: 'sg-close sg-cancel-x sg-close-charity-select',
  closeCharityModalOverlay: 'charity-select-modal-overlay shoppinggives-tag cc-modal-overlay',
  charitySelectButton: 'sg-select-button',
}

const LEARN_MORE_MODAL_EVENT_SELECTORS = {
  closeLearnMoreModalButton: 'sg-close sg-close-learn-more',
  closeLearnMoreModalOverlay: 'sg-learn-more-modal-overlay shoppinggives-tag cc-modal-overlay',
}

const WIDGET_CTA_EVENT_SELECTORS = {
  selectCause: 'select-text sg-open-charity-select',
  learnMore: 'select-text sg-open-learn-more',
}

export type Listener = {
  container: string
  listenerNode: null | Element
  handler: (e: Event) => void
  callback?: () => void | null
}

export function useShoppingGivesHandlers({
  // params
  isLoggedIn,
  isSGWReady,
  // analytics
  analyticsSendHandlers,
}) {
  const {
    selectCauseAnalytics,
    learnMoreCloseAnalytics,
    learnMoreWidgetAnalytics,
    selectCauseCloseAnalytics,
    selectCauseWidgetCtasAnalytics,
    sendShoppingGivesWidgetImpression,
    sendShoppingGivesWidgetImpressionCause,
  } = analyticsSendHandlers

  const [impressed, setImpressed] = useState(false)
  const [isWidgetCTAsActive, setWidgetCTAsActive] = useState(false)

  const widgetListeners = useMemo(
    () => ({
      previewCTA: {
        [WIDGET_CTA_EVENT_SELECTORS.selectCause]: selectCauseAnalytics,
        [WIDGET_CTA_EVENT_SELECTORS.learnMore]: learnMoreWidgetAnalytics,
      },
      learnMoreModal: {
        [LEARN_MORE_MODAL_EVENT_SELECTORS.closeLearnMoreModalButton]: learnMoreCloseAnalytics,
        [LEARN_MORE_MODAL_EVENT_SELECTORS.closeLearnMoreModalOverlay]: learnMoreCloseAnalytics,
      },
      charityModal: {
        [CHARITY_MODAL_EVENT_SELECTORS.charitySelectButton]: selectCauseWidgetCtasAnalytics,
        [CHARITY_MODAL_EVENT_SELECTORS.closeCharityModalButton]: selectCauseCloseAnalytics,
        [CHARITY_MODAL_EVENT_SELECTORS.closeCharityModalOverlay]: selectCauseCloseAnalytics,
      },
    }),
    [
      selectCauseAnalytics,
      learnMoreWidgetAnalytics,
      learnMoreCloseAnalytics,
      learnMoreCloseAnalytics,
      selectCauseCloseAnalytics,
      selectCauseCloseAnalytics,
      selectCauseWidgetCtasAnalytics,
    ]
  )

  const widgetCTAHandler = useCallback(
    (event: Event) => {
      delegateEventListener({
        event,
        findEventHandler: findEvent,
        handlersMap: widgetListeners.previewCTA,
      })
    },
    [widgetListeners.previewCTA]
  )

  const charityModalHandler = useCallback(
    (event: Event) => {
      delegateEventListener({
        event,
        findEventHandler: findEvent,
        handlersMap: widgetListeners.charityModal,
      })
    },
    [widgetListeners.charityModal]
  )

  const learnMoreModalHandler = useCallback(
    (event: Event) => {
      delegateEventListener({
        event,
        findEventHandler: findEvent,
        handlersMap: widgetListeners.learnMoreModal,
      })
    },
    [widgetListeners.learnMoreModal]
  )

  const onAllWidgetCtasAdded = useCallback(() => {
    setWidgetCTAsActive(true)
  }, [])

  const listeners = useRef<Listener[]>([
    {
      container: WIDGET_CTA_CONTAINER,
      listenerNode: null,
      handler: widgetCTAHandler,
      callback: onAllWidgetCtasAdded,
    },
    {
      container: CHARITY_MODAL_CONTAINER,
      listenerNode: null,
      handler: charityModalHandler,
    },
    {
      container: LEARN_MORE_MODAL_CONTAINER,
      listenerNode: null,
      handler: learnMoreModalHandler,
    },
  ])

  /*
   * The widget is a dynamically loaded plugin, so we need to wait until its script is loaded
   * After that, we should give the plugin some time to render the UI first, that's why we use the setTimeout
   * When the widget's HTML have been rendered, we can add the event listeners
   * */
  useEffect(() => {
    if (!isSGWReady) return

    // setTimeout - to offload the call stack and let render the UI first
    setTimeout(() => {
      listeners.current = addEventListeners(listeners)
    }, 0) // should remain 0

    return () => {
      if (isSGWReady) {
        removeEventListeners(listeners)
      }
    }
  }, [isSGWReady])

  useEffect(() => {
    if (!isLoggedIn && !impressed) {
      sendShoppingGivesWidgetImpression()

      setImpressed(true)
    } else if (isLoggedIn && !impressed && isWidgetCTAsActive) {
      setImpressed(true)

      sendShoppingGivesWidgetImpressionCause()
    }
  }, [isLoggedIn, isWidgetCTAsActive, impressed])
}

// TODO: Candidate for the CMS content handlers, we'll need adjust it for the CMS in the case
function addEventListeners(listeners: MutableRefObject<Listener[]>) {
  return listeners.current.map((listener) => {
    const listenerNode = document.querySelector(listener.container)

    if (listenerNode) {
      listenerNode.addEventListener('click', listener.handler)
      listener?.callback?.()

      return {
        ...listener,
        listenerNode,
      }
    }

    return listener
  })
}

// TODO: Candidate for the CMS content handlers, we'll need adjust it for the CMS in the case
function removeEventListeners(listeners: MutableRefObject<Listener[]>) {
  try {
    return listeners.current.map((listener) => {
      if (listener.listenerNode) {
        listener.listenerNode.removeEventListener('click', listener.handler)

        return {
          ...listener,
          listenerNode: null,
        }
      }

      return listener
    })
  } catch (e) {
    console.error('Shopping Gives Widget: remove event listeners error:', e)
    return listeners.current
  }
}

function findEvent({ element, handlersMap }: FindEventHandlerParams): FindEventHandlerResult {
  /*
   * Try to pick the handler by the class name of the element
   * Works if the entire class name is a key in the handlersMap
   *  */
  if (element.className in handlersMap) {
    return handlersMap[element.className]
  }

  /*
   * In case of multiple classes, we need one particular class name
   * */

  for (const className of Array.from(element.classList.values())) {
    if (className in handlersMap) {
      return handlersMap[className]
    }
  }

  return null
}

type HandlersMap = Record<string, (e: Event) => void>

type FindEventHandlerParams = {
  element: Element
  handlersMap: HandlersMap
}

type FindEventHandlerResult = (e: Event) => void | null

type DelegateEventListenerParams = {
  event: Event
  handlersMap: HandlersMap
  findEventHandler: (params: FindEventHandlerParams) => FindEventHandlerResult
}

function delegateEventListener({
  event,
  handlersMap,
  findEventHandler,
}: DelegateEventListenerParams): void {
  if (!event.target) {
    return
  }

  event.stopPropagation()

  try {
    const handler = findEventHandler({ element: event.target as Element, handlersMap })

    if (handler) {
      handler(event)
    }
  } catch (e) {
    console.error('Shopping Gives Widget: delegateEventListener ERROR:', e)
  }
}
