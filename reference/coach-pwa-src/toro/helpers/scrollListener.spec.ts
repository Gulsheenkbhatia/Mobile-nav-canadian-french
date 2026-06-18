import { waitFor } from '@testing-library/react'

describe('Global scroll listener singleton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    // Reset document.addEventListener mock
    document.addEventListener = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  test('Attaches listener to window object upon initialization', async () => {
    window.addEventListener = jest.fn()
    await import('toro/helpers/scrollListener')

    expect(window.addEventListener).toBeCalledWith('scroll', expect.any(Function), {
      passive: true,
    })
  })

  test('Attaches listener to document object upon initialization', async () => {
    document.addEventListener = jest.fn()
    await import('toro/helpers/scrollListener')

    expect(document.addEventListener).toBeCalledWith('scroll', expect.any(Function), {
      passive: true,
    })
  })

  test('Exposes instance to window object upon initialization', async () => {
    const { ScrollListener } = await import('toro/helpers/scrollListener')

    expect(window).toHaveProperty('scrollListener')
    expect(
      (<Window & typeof globalThis & { scrollListener: any }>window).scrollListener
    ).toBeInstanceOf(ScrollListener)
  })

  test('Adds callback to window scroll listener (default)', async () => {
    const callback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    scrollListener.add(callback)
    window.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback).toBeCalled(), { timeout: 200 })
  })

  test('Adds callback to window scroll listener (explicit)', async () => {
    const callback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    scrollListener.add(callback, 'window')
    window.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback).toBeCalled(), { timeout: 200 })
  })

  test('Adds callback to document scroll listener', async () => {
    const callback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    scrollListener.add(callback, 'document')
    document.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback).toBeCalled(), { timeout: 200 })
  })

  test('Removes callback from window scroll listener', async () => {
    const callback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    const remove = scrollListener.add(callback)
    remove()
    window.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback).not.toBeCalled(), { timeout: 200 })
  })

  test('Removes callback from document scroll listener', async () => {
    const callback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    const remove = scrollListener.add(callback, 'document')
    remove()
    document.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback).not.toBeCalled(), { timeout: 200 })
  })

  test('Window and document callbacks are independent', async () => {
    const windowCallback = jest.fn()
    const documentCallback = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default

    scrollListener.add(windowCallback, 'window')
    scrollListener.add(documentCallback, 'document')

    window.dispatchEvent(new CustomEvent('scroll'))
    waitFor(() => expect(windowCallback).toBeCalled(), { timeout: 200 })
    expect(documentCallback).not.toBeCalled()

    windowCallback.mockClear()
    documentCallback.mockClear()
    document.dispatchEvent(new CustomEvent('scroll'))
    waitFor(() => expect(documentCallback).toBeCalled(), { timeout: 200 })
  })

  test('Can add multiple callbacks to same target', async () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default

    scrollListener.add(callback1, 'window')
    scrollListener.add(callback2, 'window')
    window.dispatchEvent(new CustomEvent('scroll'))

    waitFor(
      () => {
        expect(callback1).toBeCalled()
        expect(callback2).toBeCalled()
      },
      { timeout: 200 }
    )
  })

  test('Removes specific callback without affecting others', async () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default

    const remove1 = scrollListener.add(callback1, 'window')
    scrollListener.add(callback2, 'window')
    remove1()
    window.dispatchEvent(new CustomEvent('scroll'))

    waitFor(() => expect(callback2).toBeCalled(), { timeout: 200 })
    expect(callback1).not.toBeCalled()
  })

  test('Destroys the instance and removes both listeners', async () => {
    window.removeEventListener = jest.fn()
    document.removeEventListener = jest.fn()
    const scrollListener = (await import('toro/helpers/scrollListener')).default
    scrollListener.destroy()

    expect(window.removeEventListener).toBeCalledWith('scroll', expect.any(Function))
    expect(document.removeEventListener).toBeCalledWith('scroll', expect.any(Function))
    expect(window).not.toHaveProperty('scrollListener')
  })
})
