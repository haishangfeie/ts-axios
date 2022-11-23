import { buildURL, combinURL, isAbsoluteURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar'
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if some params value if null', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar',
          baz: null
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if the only params value if null', () => {
      expect(
        buildURL('/foo', {
          baz: null
        })
      ).toBe('/foo')
    })

    test('should support object params', () => {
      expect(
        buildURL('/foo', {
          foo: {
            baz: 'baz'
          }
        })
      ).toBe(
        '/foo?foo=' +
          encodeURI(
            JSON.stringify({
              baz: 'baz'
            })
          )
      )
    })

    test('should support date params', () => {
      const date = new Date()
      expect(
        buildURL('/foo', {
          date
        })
      ).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(
        buildURL('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char params', () => {
      expect(
        buildURL('/foo', {
          foo: '@:$, '
        })
      ).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      expect(
        buildURL('/foo?foo=bar', {
          bar: 'baz'
        })
      ).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildURL('/foo?foo=bar#home', {
          query: 'baz'
        })
      ).toBe('/foo?foo=bar&query=baz')
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=baz'
      })
      const params = { a: 1 }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=baz')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('a=b'))).toBe('/foo?a=b')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect some origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combinURL', () => {
    test('should combine URL', () => {
      expect(combinURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
      expect(combinURL('https://api.github.com/', 'users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashed', () => {
      expect(combinURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combinURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combinURL('https://api.github.com')).toBe('https://api.github.com')
    })

    test('should allow a single slash for relative url', () => {
      expect(combinURL('https://api.github.com', '/')).toBe('https://api.github.com/')
    })
  })
})
