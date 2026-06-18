import {
  initSplideSlider,
  getNextSplideSlide,
  goToNextSplideSlide,
  initSplideForSwatches,
  triggerSplideCalculation,
  addToSplideController,
  splideControllers,
  getLinkIndexWithMatchedFilterId,
  getIsConfigRequired,
  getClientSplideConfig,
} from './home'

const mockMainSplide = {
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  querySelectorAll: jest
    .fn()
    .mockReturnValue([
      { classList: { remove: jest.fn(), add: jest.fn() } },
      { classList: { remove: jest.fn(), add: jest.fn() } },
    ]),
}

describe('initSplideForSwatches', () => {
  const mockClosest = jest.fn()
  const mockFind = jest.fn()
  class SplideMock {
    constructor(element, options) {
      this.element = element
      this.options = options
      this.index = 0
      this.length = 5
    }

    mount() {
      return this
    }
    on() {
      return this
    }
  }

  beforeAll(() => {
    global.window.$ = jest.fn().mockImplementation(() => ({
      closest: mockClosest,
      find: mockFind,
    }))
    global.Splide = jest
      .fn()
      .mockImplementation((element, options) => new SplideMock(element, options))
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize Splide slider with appropriate configuration for desktop when total swatches exceed desktop limit', () => {
    const item = {
      dataset: { mobileSliderLimit: '3', desktopSliderLimit: '2' },
      closest: mockClosest,
    }
    mockClosest.mockReturnValueOnce(mockMainSplide)
    mockClosest.mockReturnValueOnce(false)
    mockFind.mockReturnValueOnce([{}, {}, {}]) // total swatches exceed desktop limit (3 > 2)

    initSplideForSwatches(item)

    expect(global.Splide).toHaveBeenCalledWith(expect.anything(), {
      arrows: true,
      pagination: false,
      perPage: 2,
      perMove: 2,
      start: 0,
      autoPlay: false,
      type: 'slide',
      drag: false,
      destroy: false,
      breakpoints: { 769: { destroy: true, drag: false, perPage: 3, perMove: 3, arrows: false } },
    })
  })

  it('should initialize Splide slider with appropriate configuration for mobile when total swatches exceed mobile limit', () => {
    const item = {
      dataset: { mobileSliderLimit: '2', desktopSliderLimit: '3' },
      closest: mockClosest,
    }
    mockClosest.mockReturnValueOnce(mockMainSplide)
    mockFind.mockReturnValueOnce([{}, {}, {}, {}]) // total swatches exceed mobile limit (4 > 2)

    initSplideForSwatches(item)

    expect(global.Splide).toHaveBeenCalledWith(expect.anything(), {
      arrows: true,
      pagination: false,
      perPage: 3,
      perMove: 3,
      start: 0,
      autoPlay: false,
      type: 'slide',
      drag: false,
      destroy: false,
      breakpoints: { 769: { destroy: false, drag: false, perPage: 2, perMove: 2, arrows: true } },
    })
  })
})

describe('addToSplideController', () => {
  it('should add a controller to splideControllers when the container is short-video-modal', () => {
    const SplideCarousel = {
      Components: {
        Controller: {
          getNext: jest.fn(),
          go: jest.fn(),
        },
      },
    }
    const mainSplide = document.createElement('div')
    mainSplide.className = 'short-video-modal'

    addToSplideController(SplideCarousel, mainSplide)

    expect(splideControllers).toHaveProperty('short-video-modal')
    expect(splideControllers['short-video-modal']).toEqual({
      id: 'short-video-modal',
      splide: SplideCarousel,
    })
  })

  it('should not add a controller when the container is not short-video-modal', () => {
    const SplideCarousel = {
      Components: {
        Controller: {
          getNext: jest.fn(),
          go: jest.fn(),
        },
      },
    }
    const mainSplide = document.createElement('div')
    mainSplide.className = 'short-videos'

    addToSplideController(SplideCarousel, mainSplide)

    expect(splideControllers).not.toHaveProperty('short-videos')
  })
})

describe('triggerSplideCalculation', () => {
  const container = 'mock-container'
  const mockElement = document.createElement('div')
  mockElement.classList.add(container)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if container is not provided or Splide is not loaded', () => {
    global.Splide = {}
    const resultWithNoContainer = triggerSplideCalculation(null, 0)
    expect(resultWithNoContainer).toBeUndefined()

    global.Splide = undefined
    const container = document.createElement('div')
    const resultWithContainer = triggerSplideCalculation(container, 0)
    expect(resultWithContainer).toBeUndefined()
  })
})

describe('goToNextSplideSlide', () => {
  let mockSplideControllers

  beforeEach(() => {
    // Mock the global splideControllers object
    mockSplideControllers = {
      'short-video-modal': {
        splide: {
          Components: {
            Controller: {
              getNext: jest.fn(),
              go: jest.fn(),
            },
          },
        },
      },
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should not go to the next Splide slide if container is not provided', () => {
    // Call the function without providing a container
    goToNextSplideSlide()

    // Verify that the go function was not called
    expect(
      mockSplideControllers['short-video-modal'].splide.Components.Controller.go
    ).not.toHaveBeenCalled()
  })

  it('should not go to the next Splide slide if Splide is not loaded', () => {
    // Mock Splide to be undefined, simulating Splide not being loaded
    global.Splide = undefined

    // Call the function with a valid container
    goToNextSplideSlide('short-video-modal')

    // Verify that the go function was not called
    expect(
      mockSplideControllers['short-video-modal'].splide.Components.Controller.go
    ).not.toHaveBeenCalled()
  })

  it('should not go to the next Splide slide if getNext returns -1', () => {
    const container = 'short-video-modal'

    // Mock the getNext function to return -1
    mockSplideControllers[container].splide.Components.Controller.getNext.mockReturnValue(-1)

    window.Splide = {}
    // Call the function
    goToNextSplideSlide(container)

    // Verify that the go function was not called
    expect(mockSplideControllers[container].splide.Components.Controller.go).not.toHaveBeenCalled()
  })
})

describe('getNextSplideSlide', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="shortVideoModal">
        <div class="lg-modal">
          <div class="splide__slide">Slide 1</div>
          <div class="splide__slide">Slide 2</div>
          <div class="splide__slide">Slide 3</div>
        </div>
      </div>
    `
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('should return the next slide when the shorts-video and index are valid', () => {
    const nextSlide = getNextSplideSlide('shortVideoModal', 1)
    expect(nextSlide).toBeDefined()
    expect(nextSlide.textContent).toBe('Slide 2')
  })

  test('should return null when the shorts-video is not found', () => {
    const nextSlide = getNextSplideSlide('nonExistentContainer', 1)
    expect(nextSlide).toBeUndefined()
  })

  test('should return null when the index is out of bounds', () => {
    const nextSlide = getNextSplideSlide('shortVideoModal', 5)
    expect(nextSlide).toBeUndefined()
  })

  test('should return null when the index is negative', () => {
    const nextSlide = getNextSplideSlide('shortVideoModal', -1)
    expect(nextSlide).toBeUndefined()
  })

  test('should return null when the ".lg-modal" element is not found', () => {
    document.querySelector('.lg-modal').remove()
    const nextSlide = getNextSplideSlide('shortVideoModal', 1)
    expect(nextSlide).toBeUndefined()
  })
})

describe('initSplideSlider', () => {
  let item
  let mainSplide
  let options
  let config
  const lazyLoadImages = jest.fn()
  const lazyLoadVideos = jest.fn()

  class SplideMock {
    constructor(element, options) {
      this.element = element
      this.options = options
    }
    mount() {
      return {}
    }
  }

  beforeAll(() => {
    global.Splide = jest
      .fn()
      .mockImplementation((element, options) => new SplideMock(element, options))
  })

  beforeEach(() => {
    config = { type: 'loop', perPage: 3 }
    mainSplide = document.createElement('div')
    mainSplide.classList.add('splide')
    document.body.appendChild(mainSplide)

    item = document.createElement('div')
    item.dataset.config = JSON.stringify(config)
    mainSplide.appendChild(item)

    options = { lazyLoadImages: true, lazyLoadVideos: true }
  })
  afterEach(() => {
    document.body.removeChild(mainSplide)
    jest.clearAllMocks()
  })

  test('does not call lazyLoadImages if options.lazyLoadImages is false', () => {
    initSplideSlider(item, { lazyLoadImages: false })
    expect(lazyLoadImages).not.toHaveBeenCalled()
  })

  test('does not call lazyLoadVideos if options.lazyLoadVideos is false', () => {
    initSplideSlider(item, { lazyLoadVideos: false })
    expect(lazyLoadVideos).not.toHaveBeenCalled()
  })

  test('should add splide-error class to mainSplide when there is an error', () => {
    item.setAttribute('data-config', 'invalid-json')
    initSplideSlider(item, options)
    expect(mainSplide.classList.contains('splide-error')).toBe(true)
  })
})

describe('getClientSplideConfig', () => {
  const originalLocation = global.location

  beforeAll(() => {
    delete global.location
    global.location = {
      search: '',
    }
  })

  afterAll(() => {
    global.location = originalLocation
  })

  // Mock the imported functions
  jest.mock('./home', () => ({
    getIsConfigRequired: jest.fn(),
    getLinkIndexWithMatchedFilterId: jest.fn(),
    getClientSplideConfig: jest.fn(),
    isMobileDevice: () => true,
  }))

  // Utility function to create a DOM element with optional properties
  function createElement(tag, classNames = [], dataset = {}, href = '') {
    const element = document.createElement(tag)
    classNames.forEach((className) => element.classList.add(className))
    if (tag === 'a' && href) {
      element.href = href
    }
    Object.keys(dataset).forEach((key) => {
      element.dataset[key] = dataset[key]
    })
    return element
  }
  afterAll(() => {
    document.body.innerHTML = ''
    global.location.search = ''
    jest.resetAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an empty config if filterUsedInLink is not found', () => {
    const item = createElement('div')
    const container = createElement('div', ['amp-page-acc', 'page-section'])
    container.appendChild(item)
    document.body.appendChild(container)

    const config = getClientSplideConfig(item)
    expect(config).toEqual({})
  })

  it('should return an empty config if isConfigRequired is false', () => {
    const item = createElement('div')
    const container = createElement('div', ['amp-page-acc', 'page-section'], {
      linkQuery: 'filter',
    })
    container.appendChild(item)
    document.body.appendChild(container)
    const config = getClientSplideConfig(item)
    expect(config).toEqual({})
  })

  it('should catch', () => {
    const item = createElement('div')
    const container = createElement('div', ['amp-page-acc', 'page-section'], {
      linkQuery: 'filter',
    })
    container.appendChild(item)
    document.body.appendChild(container)
    const config = getClientSplideConfig(item)
    expect(config).toEqual({})
  })
})

describe('getIsConfigRequired', () => {
  const originalLocation = global.location

  beforeAll(() => {
    delete global.location
    global.location = {
      search: '',
    }
  })

  afterAll(() => {
    global.location = originalLocation
  })

  // Mock the isMobileDevice function
  jest.mock('./isMobileDevice', () => ({
    isMobileDevice: jest.fn(),
  }))

  // Utility function to create a DOM element with optional properties
  function createElement(tag, classNames = [], dataset = {}, href = '') {
    const element = document.createElement(tag)
    classNames.forEach((className) => element.classList.add(className))
    if (tag === 'a' && href) {
      element.href = href
    }
    Object.keys(dataset).forEach((key) => {
      element.dataset[key] = dataset[key]
    })
    return element
  }
  beforeEach(() => {
    document.body.innerHTML = ''
    global.location.search = ''
    jest.resetAllMocks()
  })

  it('should return false if item is null', () => {
    expect(getIsConfigRequired(null, 'filter')).toBe(false)
  })

  it('should return false if filterUsedInLink is empty', () => {
    const item = createElement('div')
    expect(getIsConfigRequired(item, '')).toBe(false)
  })

  it('should return false if URL filter is not present', () => {
    const item = createElement('div')
    Object.defineProperty(global.location, 'search', {
      value: '?anotherFilter=something',
      writable: true,
    })
    expect(getIsConfigRequired(item, 'filter')).toBe(false)
  })

  it('should return falsy if no links are present', () => {
    const item = createElement('div')
    Object.defineProperty(global.location, 'search', {
      value: '?filter=value',
      writable: true,
    })
    expect(getIsConfigRequired(item, 'filter')).toBeFalsy()
  })

  it('should return false if tab-content is present but not active', () => {
    const item = createElement('div')
    const tabContent = createElement('div', ['tab-pane'])
    const link = createElement('a', ['at-media-asset'], {}, 'http://example.com')
    item.appendChild(link)
    tabContent.appendChild(item)
    document.body.appendChild(tabContent)
    Object.defineProperty(global.location, 'search', {
      value: '?filter=value',
      writable: true,
    })
    expect(getIsConfigRequired(item, 'filter')).toBe(false)
  })
})

describe('getLinkIndexWithMatchedFilterId', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  // Utility function to create a link element with href
  function createLinkElement(href) {
    const link = document.createElement('a')
    link.href = href
    return link
  }
  it('should return 0 if no links are provided', () => {
    const result = getLinkIndexWithMatchedFilterId('value', 'filter', [])
    expect(result).toBe(0)
  })

  it('should return 0 if filterUsedInLink is not present in any link', () => {
    const link1 = createLinkElement('http://example.com?anotherFilter=value1')
    const link2 = createLinkElement('http://example.com?anotherFilter=value2')
    const result = getLinkIndexWithMatchedFilterId('value', 'filter', [link1, link2])
    expect(result).toBe(0)
  })

  it('should return the index of the link that matches the filter value', () => {
    const link1 = createLinkElement('http://example.com?filter=value1')
    const link2 = createLinkElement('http://example.com?filter=value2')
    const result = getLinkIndexWithMatchedFilterId('value2', 'filter', [link1, link2])
    expect(result).toBe(1)
  })

  it('should return the index of the first link that matches the filter value', () => {
    const link1 = createLinkElement('http://example.com?filter=value')
    const link2 = createLinkElement('http://example.com?filter=value')
    const result = getLinkIndexWithMatchedFilterId('value', 'filter', [link1, link2])
    expect(result).toBe(0)
  })

  it('should return 0 if filterValue is empty', () => {
    const link1 = createLinkElement('http://example.com?filter=value')
    const link2 = createLinkElement('http://example.com?filter=value2')
    const result = getLinkIndexWithMatchedFilterId('', 'filter', [link1, link2])
    expect(result).toBe(0)
  })

  it('should return 0 if filterUsedInLink is empty', () => {
    const link1 = createLinkElement('http://example.com?filter=value')
    const link2 = createLinkElement('http://example.com?filter=value2')
    const result = getLinkIndexWithMatchedFilterId('value', '', [link1, link2])
    expect(result).toBe(0)
  })

  it('should be case insensitive for filter value matching', () => {
    const link1 = createLinkElement('http://example.com?filter=Value')
    const result = getLinkIndexWithMatchedFilterId('value', 'filter', [link1])
    expect(result).toBe(0)
  })

  it('should skip links without the filterUsedInLink parameter', () => {
    const link1 = createLinkElement('http://example.com?otherFilter=value')
    const link2 = createLinkElement('http://example.com?filter=value')
    const result = getLinkIndexWithMatchedFilterId('value', 'filter', [link1, link2])
    expect(result).toBe(1)
  })
})
