import getCookie from './getCookie' // Assuming this file is in the same directory

describe('getCookie function', () => {
  it('should return the value of the cookie when extractFullCookie is false', () => {
    const cookies = 'cookie1=value1; cookie2=value2; cookie3=value3'
    expect(getCookie('cookie1', cookies, false)).toEqual('value1')
    expect(getCookie('cookie2', cookies, false)).toEqual('value2')
    expect(getCookie('cookie3', cookies, false)).toEqual('value3')
  })

  it('should return null if the cookie is not found when extractFullCookie is false', () => {
    const cookies = 'cookie1=value1; cookie2=value2; cookie3=value3'
    expect(getCookie('cookie4', cookies, false)).toBeNull()
  })

  it('should return the full cookie string when extractFullCookie is true', () => {
    const cookies = 'cookie1=value1;cookie2=value2;cookie3=value3'
    expect(getCookie('cookie1', cookies, true)).toEqual('cookie1=value1')
    expect(getCookie('cookie2', cookies, true)).toEqual('cookie2=value2')
    expect(getCookie('cookie3', cookies, true)).toEqual('cookie3=value3')
  })

  it('should return null if the cookie is not found when extractFullCookie is true', () => {
    const cookies = 'cookie1=value1; cookie2=value2; cookie3=value3'
    expect(getCookie('cookie4', cookies, true)).toBeNull()
  })

  it('should work correctly with an array of cookies', () => {
    const cookiesArray = ['cookie1=value1', 'cookie2=value2', 'cookie3=value3']
    expect(getCookie('cookie1', cookiesArray, false)).toEqual('value1')
    expect(getCookie('cookie2', cookiesArray, false)).toEqual('value2')
    expect(getCookie('cookie3', cookiesArray, false)).toEqual('value3')
    expect(getCookie('cookie4', cookiesArray, false)).toBeNull()
    expect(getCookie('cookie1', cookiesArray, true)).toEqual('cookie1=value1')
    expect(getCookie('cookie2', cookiesArray, true)).toEqual('cookie2=value2')
    expect(getCookie('cookie3', cookiesArray, true)).toEqual('cookie3=value3')
    expect(getCookie('cookie4', cookiesArray, true)).toBeNull()
  })

  it('should return null if the cookie string is empty', () => {
    const cookies = ''
    expect(getCookie('cookie1', cookies, false)).toBeNull()
    expect(getCookie('cookie1', cookies, true)).toBeNull()
  })
})
