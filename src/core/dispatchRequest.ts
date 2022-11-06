import { transformRequest, transformResponse } from '../helpers/data'
import { processHeader } from '../helpers/header'
import { buildURL } from '../helpers/url'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import xhr from './xhr'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  const promise = xhr(config).then(res => transformResponseData(res))
  return promise
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  // 这个必须要在transformRequestData前调用，因为transformRequestData可以改写data
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig) {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig) {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers, data } = config
  return processHeader(headers, data)
}

function transformResponseData(resoponse: AxiosResponse): AxiosResponse {
  resoponse.data = transformResponse(resoponse.data)
  return resoponse
}
