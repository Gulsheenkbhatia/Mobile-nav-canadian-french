import organizationSchemaParser from './parser'

describe('organizationSchemaParser', () => {
  it('returns an empty object if HTML is empty', () => {
    const result = organizationSchemaParser('')
    expect(result).toEqual({})
  })

  it('returns an empty object if HTML is null', () => {
    const result = organizationSchemaParser(null)
    expect(result).toEqual({})
  })

  it('returns the JSON from the body of the HTML', () => {
    const html = `
      <html>
        <body>
          {"@type": "Organization", "name": "Example Company"}
        </body>
      </html>
    `
    let result = organizationSchemaParser(html)
    result.json = result.json.trim()

    expect(result).toEqual({
      json: '{"@type": "Organization", "name": "Example Company"}',
    })
  })

  it('handles HTML without a body tag gracefully', () => {
    const html = '<html></html>'
    const result = organizationSchemaParser(html)
    expect(result).toEqual({
      json: '',
    })
  })
})
