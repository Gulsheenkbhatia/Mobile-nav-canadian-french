export type PromoCallout = {
  'call-out-message': {
    content: {
      text: string
      spanText: string
      promoStyle: string
      scriptContent: string
      mainHtml: string
      isPromoModal: boolean
      shouldInjectJquery: boolean | null
      styles: string | null
      drawerScheme?: {
        PDP: {
          recommenders: string[]
        }
      }
    }
    config: {
      device: string
    }
    id: string
  }
}
