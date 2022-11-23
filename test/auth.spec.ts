import axios from '../src/index'

import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should accept HTTP Basic auth with username&password', () => {
    axios('/foo', {
      auth: {
        username: 'Aladdin',
        password: 'open sesame'
      }
    })
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Authorization']).toBe('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==')
    })
  })

  test('should fail to encode HTTP Basic auth credentials with non-Latin1 characters', done => {
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
    return axios('/foo', {
      auth: {
        username: 'Aladßç£☃din',
        password: 'open sesame'
      }
    }).catch(error => {
      expect(/characters/i.test(error.message)).toBeTruthy()
      done()
    })
  })
})
