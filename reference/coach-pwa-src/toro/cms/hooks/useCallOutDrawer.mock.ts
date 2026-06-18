import { PromoCallout } from 'toro/components/product/CallOutMessage/types'

export const promoCallOutWithDrawerScheme: PromoCallout = {
  'call-out-message': {
    content: {
      text: '<span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span>',
      spanText:
        '<a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-drawer-scheme=\'{"PDP":{"recommenders":["product1_rr"]}}\' data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a>',
      promoStyle: 'background: #79488f; color: white; padding: var(--spacing-2);',
      scriptContent: '',
      mainHtml:
        '<html><head></head><body><a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-drawer-scheme=\'{"PDP":{"recommenders":["product1_rr"]}}\' data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a></body></html>',
      isPromoModal: false,
      shouldInjectJquery: null,
      styles: null,
      drawerScheme: { PDP: { recommenders: ['product1_rr'] } },
    },
    config: {
      device: 'All',
    },
    id: 'call-out-message',
  },
}

export const promoCallOutWithoutDrawerScheme: PromoCallout = {
  'call-out-message': {
    content: {
      text: '<span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span>',
      spanText:
        '<a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a>',
      promoStyle: 'background: #79488f; color: white; padding: var(--spacing-2);',
      scriptContent: '',
      mainHtml:
        '<html><head></head><body><a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a></body></html>',
      isPromoModal: false,
      shouldInjectJquery: null,
      styles: null,
    },
    config: {
      device: 'All',
    },
    id: 'call-out-message',
  },
}

export const promoCallOutWithEmptyDrawerScheme: PromoCallout = {
  'call-out-message': {
    content: {
      text: '<span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span>',
      spanText:
        '<a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-drawer-scheme=\'{"PDP":{"recommenders":[]}}\' data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a>',
      promoStyle: 'background: #79488f; color: white; padding: var(--spacing-2);',
      scriptContent: '',
      mainHtml:
        '<html><head></head><body><a class="impressionTrack justforyou" href="/handpicked-for-you.html" data-drawer-scheme=\'{"PDP":{"recommenders":[]}}\' data-event="internal_promotion" data-promotion-id="20231129-pdp-tag-redirectjfymobile" data-promotion-name="CLICK TO SHOP" data-creative-name="20231129-pdp-tag-redirectjfymobile" data-location-id="inlinebanner" data-creative-slot="1"><span class="pdpprimarytag" style="background: #79488f; color: white; padding: var(--spacing-2);">If you like this, you\'ll love these &#10024; <u>Show Me</u></span></a></body></html>',
      isPromoModal: false,
      shouldInjectJquery: null,
      styles: null,
      drawerScheme: { PDP: { recommenders: [] } },
    },
    config: {
      device: 'All',
    },
    id: 'call-out-message',
  },
}

export default {
  promoCallOutWithDrawerScheme,
  promoCallOutWithoutDrawerScheme,
  promoCallOutWithEmptyDrawerScheme,
}
