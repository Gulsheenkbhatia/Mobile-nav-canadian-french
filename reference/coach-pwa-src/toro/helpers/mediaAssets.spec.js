import { splideSliderValidateClonedSlides } from './mediaAssets'

describe('splideSliderValidateClonedSlides', () => {
  beforeEach(() => {
    // Create the HTML DOM structure
    document.body.innerHTML = `
    <div class="splide">
        <div class="splide__track">
            <div class="splide__slide">Slide 1</div>
            <div class="splide__slide splide__slide--clone">
                <video data-desktop-video-src="desktop-video.mp4" 
                data-mobile-video-src="mobile-video.mp4" 
                data-desktop-poster-src="desktop-poster.jpg" 
                data-mobile-poster-src="mobile-poster.jpg" 
                data-poster="default-poster.jpg">
                </video>
            </div>
        </div>
    </div>
    `
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('should check if video exists', () => {
    const video = document.querySelector('.splide__slide--clone video')
    expect(video).not.toBeNull()
  })

  test('should not set video src and poster if video does not exist', () => {
    splideSliderValidateClonedSlides(false)
    const video = document.querySelector('.splide__slide--clone video')
    expect(video.src).toContain('')
    expect(video.poster).toContain('')
  })

  test('should update video src and poster when desktop attributes are provided', () => {
    splideSliderValidateClonedSlides(true)
    const video = document.querySelector('.splide__slide--clone video')
    expect(video.src).toContain('desktop-video.mp4')
    expect(video.poster).toContain('desktop-poster.jpg')
  })

  test('should update video src and poster when mobile attributes are provided', () => {
    splideSliderValidateClonedSlides(false)
    const video = document.querySelector('.splide__slide--clone video')
    expect(video.src).toContain('mobile-video.mp4')
    expect(video.poster).toContain('mobile-poster.jpg')
  })

  test('should update video src and use default poster when mobile attributes are not provided', () => {
    document.body.innerHTML = `
    <div class="splide">
        <div class="splide__track">
            <div class="splide__slide splide__slide--clone">
                <video data-mobile-video-src="mobile-video.mp4" data-poster="default-poster.jpg"></video>
            </div>
        </div>
    </div>
    `
    splideSliderValidateClonedSlides(false)
    const video = document.querySelector('.splide__slide--clone video')
    expect(video.src).toContain('mobile-video.mp4')
    expect(video.poster).toContain('default-poster.jpg')
  })
})
