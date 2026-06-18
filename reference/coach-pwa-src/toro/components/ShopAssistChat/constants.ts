import { ChatStarterConfig } from 'toro/components/ShopAssistChat/types'

export const SHOP_ASSIST_API_URL_AKAMAI = '/assistant/api/invocations'
export const SHOP_ASSIST_FEEDBACK_API_URL_AKAMAI = '/assistant/api/feedback'
export const SHOP_ASSIST_API_URL_VERCEL = '/api/streaming/invocations'
export const SHOP_ASSIST_FEEDBACK_API_URL_VERCEL = '/api/streaming/feedback'

export const GUARDRAIL_ERROR_MESSAGE = 'Guardrail intervention'

export const OUT_OF_STOCK_RESTRICTION_TEXT =
  'Oops! Looks like this item is sold out. It wasn’t added to your bag.'
export const chatStarterConfig: ChatStarterConfig = {
  heading: {
    key: 'heading',
    defaultMessage: 'Find the perfect gift.',
  },
  subText: {
    key: 'subText',
    defaultMessage:
      'I’m Kate Spade’s AI Gift Assistant, here to help you find the<br />perfect gift. Tell me who it’s for and the occasion, and I’ll<br />suggest some thoughtful picks tailored to you.',
  },
  contactCustomerCare: {
    key: 'contactCustomerCare',
    defaultMessage: 'Looking for Customer Care? {link}',
  },
  contactUsHere: {
    key: 'contactUsHere',
    defaultMessage: 'Contact us here.',
  },
  privacyDetails: {
    key: 'privacyDetails',
    defaultMessage: 'Privacy Details',
  },
  contactCustomerCareUrl: {
    key: 'contactCustomerCareUrl',
    defaultMessage: '/contact-us',
  },
  privacyUrl: {
    key: 'privacyUrl',
    defaultMessage: '/support/privacy-policy',
  },
}
