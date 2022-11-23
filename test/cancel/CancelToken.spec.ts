import { Canceler } from '../../src/types'
import CancelToken from '../../src/cancel/CancelToken'
import Cancel from '../../src/cancel/Cancel'

describe('cancel:CancelToken', () => {
  describe('reason', () => {
    test('should returns a Cancel if cancellation has been requested', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      const msg = 'Operation has been canceled'
      cancel!(msg)
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe(msg)
    })

    test('should has no side effect if call cancellation for multi times', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('cancel1')
      cancel!('cancel2')
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe('cancel1')
    })

    test('should return undefined if cancellation has not been requested', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      expect(token.reason).toBeUndefined()
    })
  })

  describe('promise', () => {
    test('should returns a Promise that resolves when cancellation is requested', done => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('reason')

      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe('reason')
        done()
      })
    })
  })

  describe('throwIfRequested', () => {
    test('should throws if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Operation has been canceled.')

      try {
        token.throwIfRequested()
        fail('Expected throwIfRequest to throw.')
      } catch (error) {
        if (!(error instanceof Cancel)) {
          fail('Expected throwIfRequest to throw a Cancel,but test threw ' + error + '.')
        }
        expect(error.message).toBe('Operation has been canceled.')
      }
    })

    test('should does not throw if cancellation has not been requested.', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('should returns an object containing token and cancel function', () => {
      const source = CancelToken.source()
      expect(source.token instanceof CancelToken).toBeTruthy()
      expect(source.cancel instanceof Function).toBeTruthy()
      expect(source.token.reason).toBeUndefined()
      source.cancel('Operation has been canceled.')

      // 也可以这样写：
      // expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason instanceof Cancel).toBeTruthy()
      expect(source.token.reason!.message).toBe('Operation has been canceled.')
    })
  })
})
