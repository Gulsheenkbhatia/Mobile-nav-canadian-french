import { useMemo } from 'react'

export type UseShoppingGivesAnalytics = {
  selectCauseAnalytics: () => void
  learnMoreCloseAnalytics: () => void
  learnMoreWidgetAnalytics: () => void
  selectCauseCloseAnalytics: () => void
  selectCauseWidgetCtasAnalytics: () => void
  sendShoppingGivesWidgetImpression: () => void
  sendShoppingGivesWidgetImpressionCause: () => void
  sendAuthorizationAnalytics: (signIn: boolean) => void
}

type EventActionLabel = {
  eventAction: string
  eventLabel: string
}

const EVENT_ACTIONS_LABELS: Record<string, EventActionLabel> = {
  selectCauseClose: {
    eventAction: 'shopping gives modal click',
    eventLabel: 'modal select cause close (no selection)',
  },
  learnMoreClose: {
    eventAction: 'shopping gives modal click',
    eventLabel: 'modal learn more close',
  },
  selectCause: { eventAction: 'shopping gives modal click', eventLabel: 'modal select cause' },
  learnMoreWidget: { eventAction: 'shopping gives widget click', eventLabel: 'widget learn more' },
  selectCauseWidget: {
    eventAction: 'shopping gives widget click',
    eventLabel: 'widget select cause',
  },
  signIn: { eventAction: 'shopping gives widget click', eventLabel: 'widget sign in' },
  signUp: { eventAction: 'shopping gives widget click', eventLabel: 'widget sign up' },
  widgetImpression: {
    eventAction: 'shopping gives widget impression',
    eventLabel: 'widget for guest users',
  },
  widgetImpressionCause: {
    eventAction: 'shopping gives widget impression',
    eventLabel: 'widget with cause selected',
  },
  widgetImpressionNoCause: {
    eventAction: 'shopping gives widget impression',
    eventLabel: 'widget with no cause selected',
  },
}

const createAnalyticsEventParams = ({ eventAction, eventLabel }: EventActionLabel) => ({
  eventLocation: 'product',
  eventAction,
  eventLabel,
})

export type UseShoppingGivesAnalyticsProps = {
  analyticsSend: (event: string, data: unknown) => void
}

export function useShoppingGivesAnalytics({
  analyticsSend,
}: UseShoppingGivesAnalyticsProps): UseShoppingGivesAnalytics {
  const sendAnalyticsEvent = (eventName: keyof typeof EVENT_ACTIONS_LABELS) => {
    const { eventAction, eventLabel } = EVENT_ACTIONS_LABELS[eventName]

    analyticsSend(
      'shoppingGivesInteraction',
      createAnalyticsEventParams({ eventAction, eventLabel })
    )
  }

  return useMemo(
    () => ({
      selectCauseAnalytics: () => sendAnalyticsEvent('selectCause'),
      learnMoreCloseAnalytics: () => sendAnalyticsEvent('learnMoreClose'),
      learnMoreWidgetAnalytics: () => sendAnalyticsEvent('learnMoreWidget'),
      selectCauseCloseAnalytics: () => sendAnalyticsEvent('selectCauseClose'),
      selectCauseWidgetCtasAnalytics: () => sendAnalyticsEvent('selectCauseWidget'),
      sendShoppingGivesWidgetImpression: () => sendAnalyticsEvent('widgetImpression'),
      sendAuthorizationAnalytics: (signIn: boolean) =>
        sendAnalyticsEvent(signIn ? 'signIn' : 'signUp'),
      sendShoppingGivesWidgetImpressionCause: () => {
        sendAnalyticsEvent(getImpressionLabel())
      },
    }),
    []
  )
}

declare global {
  interface Window {
    sgCurrentlySelectedCause?: {
      causeId?: string
    }
  }
}

function getImpressionLabel() {
  return window?.sgCurrentlySelectedCause?.causeId
    ? 'widgetImpressionCause'
    : 'widgetImpressionNoCause'
}
