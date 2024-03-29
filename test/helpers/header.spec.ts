import { parseHeaders, processHeaders, flattenHeaders } from '../../src/helpers/header'

describe('helpers:header', () => {
  describe('processHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )
      // expect(parsed['content-type']).toBe('application/json')
      // expect(parsed['connection']).toBe('keep-alive')
      // expect(parsed['transfer-encoding']).toBe('chunked')
      // expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      // expect(parsed['key']).toBe('')
      expect(parsed).toEqual({
        'content-type': 'application/json',
        connection: 'keep-alive',
        'transfer-encoding': 'chunked',
        date: 'Tue, 21 May 2019 09:23:44 GMT',
        key: ''
      })
    })

    test('should return empty object if headers is empty string', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })

  describe('processHeaders', () => {
    test('should nomalize Content-Type Header name', () => {
      const headers: any = {
        'conTenT-Type': 'application/json;charset=utf-8',
        'Content-length': 1024
      }
      processHeaders(headers, {})
      // expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
      // expect(headers['conTenT-Type']).toBeUndefined()
      // expect(headers['Content-length']).toBe(1024)
      expect(headers).toEqual({
        'Content-Type': 'application/json;charset=utf-8',
        'Content-length': 1024
      })
    })

    test('should set Content-Type if no set and data is PlainObject', () => {
      const headers: any = {
        'Content-length': 1024
      }
      processHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should not set Content-Type if not set and data is not PlainObject', () => {
      const headers: any = {
        'Content-length': 1024
      }
      processHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(processHeaders(undefined, {})).toBeUndefined()
      expect(processHeaders(null, {})).toBeNull()
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })
    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is null or undefined', () => {
      expect(flattenHeaders(null, 'get')).toBe(null)
      expect(flattenHeaders(undefined, 'get')).toBe(undefined)
    })
  })
})
