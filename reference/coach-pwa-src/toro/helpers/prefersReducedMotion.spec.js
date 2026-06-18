import prefersReducedMotion from 'toro/helpers/prefersReducedMotion'

describe('prefersReducedMotion', () => {
  const originalWindow = global.window

  afterEach(() => {
    if (originalWindow === undefined) {
      delete global.window
    } else {
      global.window = originalWindow
    }
  })

  it('returns false when window is undefined (SSR)', () => {
    delete global.window
    expect(prefersReducedMotion()).toBe(false)
  })

  it('returns false when matchMedia is not available', () => {
    global.window = {}
    expect(prefersReducedMotion()).toBe(false)
  })

  it('returns true when matchMedia matches reduced motion', () => {
    global.window = {
      matchMedia: jest.fn(() => ({ matches: true })),
    }
    expect(prefersReducedMotion()).toBe(true)
  })

  it('returns false when matchMedia does not match reduced motion', () => {
    global.window = {
      matchMedia: jest.fn(() => ({ matches: false })),
    }
    expect(prefersReducedMotion()).toBe(false)
  })
})
