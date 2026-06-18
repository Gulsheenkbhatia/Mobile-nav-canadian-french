import getQueryString from './getQueryString'

describe('getQueryString', () => {
  it('should return a query string with all defined parameters', () => {
    const params = {
      access_token: 'abcdef',
      sort_by: 'created_on:desc',
      additional_query: 'approval_status:app',
      page: 1,
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe(
      'access_token=abcdef&sort_by=created_on%3Adesc&additional_query=approval_status%3Aapp&page=1&page_size=20'
    )
  })

  it('should exclude parameters with undefined values', () => {
    const params = {
      access_token: 'abcdef',
      sort_by: undefined,
      additional_query: 'approval_status:app',
      page: undefined,
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe('access_token=abcdef&additional_query=approval_status%3Aapp&page_size=20')
  })

  it('should exclude parameters with null values', () => {
    const params = {
      access_token: 'abcdef',
      sort_by: null,
      additional_query: 'approval_status:app',
      page: null,
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe('access_token=abcdef&additional_query=approval_status%3Aapp&page_size=20')
  })

  it('should exclude parameters with empty string values', () => {
    const params = {
      access_token: 'abcdef',
      sort_by: '',
      additional_query: 'approval_status:app',
      page: '',
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe('access_token=abcdef&additional_query=approval_status%3Aapp&page_size=20')
  })

  it('should not exclude parameters with 0 string or number values', () => {
    const params = {
      access_token: 'abcdef',
      sort_by: '0',
      additional_query: 'approval_status:app',
      page: 0,
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe(
      'access_token=abcdef&sort_by=0&additional_query=approval_status%3Aapp&page=0&page_size=20'
    )
  })

  it('should not exclude parameters with boolean values', () => {
    const params = {
      access_token: true,
      sort_by: 'false',
      additional_query: false,
      page: 0,
      page_size: 20,
    }

    const result = getQueryString(params)
    expect(result).toBe(
      'access_token=true&sort_by=false&additional_query=false&page=0&page_size=20'
    )
  })

  it('should handle empty input object', () => {
    const params = {}

    const result = getQueryString(params)
    expect(result).toBe('')
  })
})
