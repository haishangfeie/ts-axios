import { AxiosError } from '../src/helpers/error'
import axios, { AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', () => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on netword errors', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    const next = (reason: AxiosResponse | AxiosError) => {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()
    }
    return axios('/foo')
      .then(resolveSpy, rejectSpy)
      .then(next)
  })

  test('should reject when request timeout', done => {
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(err => {
      expect(err instanceof AxiosError).toBeTruthy()
      expect(err.message).toBe('Timeout of 2000 ms exceeded')
      done()
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
    })
  })

  test('should reject when validateStatus return false', done => {
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    }).catch(err => {
      expect(err instanceof AxiosError).toBeTruthy()
      expect(err.message).toBe('Request failed with status code 500')
      expect(err.response.status).toBe(500)
      done()
    })

    getAjaxRequest().then(requeset => {
      requeset.respondWith({
        status: 500
      })
    })
  })

  test('should resolve when validateStatus return true', done => {
    const rejectSpy = jest.fn()
    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    }).then(res => {
      expect(res.config.url).toBe('/foo')
      done()
    })

    getAjaxRequest().then(requeset => {
      requeset.respondWith({
        status: 300
      })
    })
  })

  test('should return object when resolved JSON', done => {
    axios('/foo').then(res => {
      expect(res.data).toEqual({ error: 0 })
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"error": 0}'
      })
    })
  })

  test('should return object when rejecting JSON', done => {
    axios('/foo').catch(err => {
      expect(err.response.data).toEqual({
        error: 'BAD USERNAME',
        code: 1
      })
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })
    })
  })

  test('should supply correct response', done => {
    axios.post('/foo').then(res => {
      expect(res).toMatchObject({
        data: {
          foo: 'bar'
        },
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        }
      })
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo":"bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    axios.post(
      '/foo',
      {
        prop: 'value'
      },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    )
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array buffer response', done => {
    const str2ab = (str: string) => {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }
    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(res => {
      expect(res.data.byteLength).toBe(22)
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })
    })
  })
})
