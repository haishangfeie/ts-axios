import cookie from '../helpers/cookie'
import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/header'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
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
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
    configureRequest()
    addEvents()
    processHeaders()
    processCancel()
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

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
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
        const responseData =
          request.responseType === 'text' ? request.responseText : request.response
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

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (withCredentials || isURLSameOrigin(url)) {
        if (xsrfCookieName) {
          const val = cookie.read(xsrfCookieName)
          if (val && xsrfHeaderName) {
            headers[xsrfHeaderName] = val
          }
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
  })
}
