import { parseHeaders } from './helpers/header'
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    // 如果data是URLSearchParams对象或者FormData，浏览器是可以自动设置合适的content-type的
    const { data = null, method = 'GET', url = '', headers, responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      const { status, readyState, statusText } = request
      if (readyState !== 4) {
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
      resolve(response)
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
