import restoreAtbPids from 'toro/helpers/restoreAtbPids'

describe('restoreAtbPids', () => {
  it('should return sanitizedHtml when originalHtml is empty', () => {
    const result = restoreAtbPids('', '<div>test</div>')
    expect(result).toBe('<div>test</div>')
  })

  it('should return empty string when sanitizedHtml is empty', () => {
    const result = restoreAtbPids('<div>test</div>', '')
    expect(result).toBe('')
  })

  it('should return sanitizedHtml when no data-atb-pid attributes exist', () => {
    const originalHtml = '<div>no pids here</div>'
    const sanitizedHtml = '<div>no pids here</div>'
    const result = restoreAtbPids(originalHtml, sanitizedHtml)
    expect(result).toBe(sanitizedHtml)
  })

  it('should restore product IDs in correct order', () => {
    const originalHtml = `
      <div data-atb-pid="C0638 B4/HA"></div>
      <div data-atb-pid="C9340 GLD  ONE"></div>
      <div data-atb-pid="76014 WIN  8"></div>
    `
    const sanitizedHtml = `
      <div data-atb-pid="C0638 B4/HA"></div>
      <div data-atb-pid="C9340 GLD ONE"></div>
      <div data-atb-pid="76014 WIN 8"></div>
    `
    const result = restoreAtbPids(originalHtml, sanitizedHtml)
    expect(result).toContain('data-atb-pid="C0638 B4/HA"')
    expect(result).toContain('data-atb-pid="C9340 GLD  ONE"')
    expect(result).toContain('data-atb-pid="76014 WIN  8"')
  })

  it('should handle duplicate product IDs correctly', () => {
    const originalHtml = `
      <div data-atb-pid="C0638 B4/HA"></div>
      <div data-atb-pid="C0638 B4/HA"></div>
    `
    const sanitizedHtml = `
      <div data-atb-pid="C0638 B4/HA"></div>
      <div data-atb-pid="C0638 B4/HA"></div>
    `
    const result = restoreAtbPids(originalHtml, sanitizedHtml)
    const matches = result.match(/data-atb-pid="C0638 B4\/HA"/g)
    expect(matches).toHaveLength(2)
  })
})
