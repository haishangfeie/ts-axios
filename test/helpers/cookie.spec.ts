import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  beforeEach(() => {
    document.cookie = 'foo=baz'
  })
  afterEach(() => {
    document.cookie = ''
  })

  test('shoule read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })

  test('shoule return null if cookie name is not exit', () => {
    expect(cookie.read('foo2')).toBe(null)
  })
})
