import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancle:Cancel', () => {
  test('should return correct result when message is specified', () => {
    const msg = 'Operation has been canceled.'
    expect(new Cancel(msg).message).toBe(msg)
  })

  test('should return true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should return true if value is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
