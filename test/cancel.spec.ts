import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('cancel', () => {
  const CancelToken = axios.CancelToken
  const Cancel = axios.Cancel

  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  describe('when called before sending request', () => {
    test('should rejects Promise whit a Cancle object', () => {
      const source = CancelToken.source()
      source.cancel('Operation has been canceled.')
      getAjaxRequest().then(req => {
        req.respondWith({
          status: 200
        })
      })
      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(error => {
          expect(error).toEqual(expect.any(Cancel))
          expect(error.message).toBe('Operation has been canceled.')
        })
    })
  })

  describe('when called after request has been sent', () => {
    test('should rejects Promise with a Cancel object', () => {
      const source = CancelToken.source()
      getAjaxRequest().then(req => {
        source.cancel('Operation has been canceled.')
        setTimeout(() => {
          req.respondWith({
            status: 200
          })
        }, 100)
      })
      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(error => {
          expect(error).toEqual(expect.any(Cancel))
          expect(error.message).toBe('Operation has been canceled.')
        })
    })

    test('calls abort on request object', () => {
      const source = CancelToken.source()
      let request: any
      getAjaxRequest().then(req => {
        source.cancel('Operation has been canceled.')
        request = req
      })
      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(error => {
          expect(error).toEqual(expect.any(Cancel))
          expect(error.message).toBe('Operation has been canceled.')
          expect(request.statusText).toBe('abort')
        })
    })
  })

  describe('when called after response has been received', () => {
    test('should no cause unhandled rejection', done => {
      const source = CancelToken.source()
      getAjaxRequest().then(req => {
        req.respondWith({
          status: 200,
          statusText: 'OK'
        })
      })
      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .then(() => {
          source.cancel('')
          window.addEventListener('unhandledrejection', () => {
            done.fail('Unhandled rejection')
          })
          setTimeout(done, 100)
        })
    })
  })
})
