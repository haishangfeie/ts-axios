import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/header'
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 如果data是URLSearchParams对象或者FormData，浏览器是可以自动设置合适的content-type的
    const {
      data = null,
      method = 'GET',
      url = '',
      headers,
      responseType,
      timeout,
      cancelToken
    } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      const { status, readyState, statusText } = request
      if (readyState !== 4) {
        return
      }
      // 超时或者网络异常时会为0，这个在别的地方处理了，这里直接return
      if (status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = request.responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        config,
        request,
        headers: responseHeaders,
        status,
        statusText
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 超时触发
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      const { status } = response.request

      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${status}`,
            config,
            status,
            request,
            response
          )
        )
      }
    }
  })
}
