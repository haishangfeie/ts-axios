import { flattenHeaders } from '../helpers/header'
import { buildURL, combinURL, isAbsoluteURL } from '../helpers/url'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import transform from './transform'
import xhr from './xhr'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  const promise = xhr(config).then(res => transformResponseData(res))
  return promise
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  // 这里内部默认行为是会调用processHeader，这个方法是要求外部保证headers是对象，且存在的，这里之所以可以确保headers存在，是因为进入这里之前合并了默认项，而默认项里headers是存在的。但是如果传入了headers是null这时headers就不存在了
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AxiosRequestConfig) {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combinURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(response: AxiosResponse): AxiosResponse {
  response.data = transform(response.data, response.headers, response.config.transformResponse)
  return response
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
