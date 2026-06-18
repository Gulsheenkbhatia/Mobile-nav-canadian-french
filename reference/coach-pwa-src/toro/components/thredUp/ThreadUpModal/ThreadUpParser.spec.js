import thredUpModalContentParser from './parser'

const htmlMarkup =
  ' <div class="mol-banner u-max-width mol-banner-5962385fd2194a929c34a7f7ebea6175 container-fluid " data-qa="site_promo_banner_wrapper"> <div class="row"> <div class="banner-container solid-background col-12 p-0 " data-qa="site_promo_banner_wrapper"> <p class="text-eyebrow1-m promo-line-text promo-text text-center">You’re about to leave katespade.com...</p> <div class="mol-header-block-container mob-text-over-img"> <div class="mol-header-block mol-header-block-5962385fd2194a929c34a7f7ebea6175 bg-transparent text-center"> <div class="at-text-block at-text-block-5962385fd2194a929c34a7f7ebea6175" data-qa="site_promo_headline_wrapper"> <p class="at-eyebrow-text text-eyebrow1-m">Introducing</p> <h2 class="at-headline-text text-display1-m "> kate spade new york<br>Pre-Loved</h2> <p class="at-body-text text-body1-m "> Shop new-to-you kate spade new york styles… <br>and learn how to turn your own pieces <br>into a shopping credit.</p> </div> <div class="links-container flex-wrap align-items-end justify-content-center"> <a href="https://katespade.thredup.com/" title="SHOP NOW" data-event="internal_promotion" data-promotion-id="id-ThredUpContent" data-promotion-name="SHOP NOW" data-creative-name="NO_IMAGE" data-location-id="banner" data-creative-slot="C1" target="_blank" class="btn text-cta-underline btn-primary btn-medium">SHOP NOW</a> </div> </div> </div> </div> </div> </div> '

describe('thredUpModalContentParser', () => {
  it('parses HTML content correctly', () => {
    const parsedContent = thredUpModalContentParser(htmlMarkup)
    expect(parsedContent.html).toBe(
      '<div class="mol-banner u-max-width mol-banner-5962385fd2194a929c34a7f7ebea6175 container-fluid " data-qa="site_promo_banner_wrapper"> <div class="row"> <div class="banner-container solid-background col-12 p-0 " data-qa="site_promo_banner_wrapper"> <p class="text-eyebrow1-m promo-line-text promo-text text-center">You’re about to leave katespade.com...</p> <div class="mol-header-block-container mob-text-over-img"> <div class="mol-header-block mol-header-block-5962385fd2194a929c34a7f7ebea6175 bg-transparent text-center"> <div class="at-text-block at-text-block-5962385fd2194a929c34a7f7ebea6175" data-qa="site_promo_headline_wrapper"> <p class="at-eyebrow-text text-eyebrow1-m">Introducing</p> <h2 class="at-headline-text text-display1-m "> kate spade new york<br>Pre-Loved</h2> <p class="at-body-text text-body1-m "> Shop new-to-you kate spade new york styles… <br>and learn how to turn your own pieces <br>into a shopping credit.</p> </div> <div class="links-container flex-wrap align-items-end justify-content-center"> <a href="https://katespade.thredup.com/" title="SHOP NOW" data-event="internal_promotion" data-promotion-id="id-ThredUpContent" data-promotion-name="SHOP NOW" data-creative-name="NO_IMAGE" data-location-id="banner" data-creative-slot="C1" target="_blank" class="btn text-cta-underline btn-primary btn-medium">SHOP NOW</a> </div> </div> </div> </div> </div> </div>'
    )
    expect(parsedContent.hElem.length).toBe(2)
    expect(parsedContent.pElem.length).toBe(3)
  })

  it('returns undefined if input HTML is empty', () => {
    const parsedContent = thredUpModalContentParser('')
    expect(parsedContent).toBeUndefined()
  })
})
