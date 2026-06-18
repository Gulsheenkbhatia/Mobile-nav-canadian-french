import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'

describe('toggleBodyScroll', () => {
  it('should add and remove class to body', () => {
    toggleBodyScroll(false)
    expect(document.body.classList.contains('lock-body')).toBe(true)

    toggleBodyScroll(true)
    expect(document.body.classList.contains('lock-body')).toBe(false)
  })
})
