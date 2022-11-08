import { Canceler, CancelExcutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExcutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    executor(reason => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(reason)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    // 这样断言和下面注释的意思是一样的
    let cancel!: Canceler
    const cancelToken = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token: cancelToken
    }
    // let cancel: Canceler
    // const cancelToken = new CancelToken(c => {
    //   cancel = c
    // })
    // return {
    //   cancel: cancel!,
    //   token: cancelToken
    // }
  }
}
