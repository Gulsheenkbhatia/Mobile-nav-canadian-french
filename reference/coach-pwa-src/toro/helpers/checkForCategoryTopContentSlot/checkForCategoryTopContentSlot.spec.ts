import { checkForCategoryTopContentSlot } from './index'

describe('checkForCategoryTopContentSlot', () => {
  it('should return false for empty HTML', () => {
    const result = checkForCategoryTopContentSlot()
    expect(result).toBe(false)
  })

  it('should return false if top content slot is not present', () => {
    const html = '<body></body>'
    const result = checkForCategoryTopContentSlot(html)
    expect(result).toBe(false)
  })

  it('should return false if top content slot is present but has no content', () => {
    const html = '<body><div id="category_top_content_slot"></div></body>'
    const result = checkForCategoryTopContentSlot(html)
    expect(result).toBe(false)
  })

  it('should return true if top content slot is present and has content', () => {
    const html = '<body><div id="category_top_content_slot"><p>Some content</p></div></body>'
    const result = checkForCategoryTopContentSlot(html)
    expect(result).toBe(true)
  })

  it('should handle parsing errors and return false', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const result = checkForCategoryTopContentSlot(null as unknown as string)
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(result).toBe(false)
    consoleErrorSpy.mockRestore()
  })
})
