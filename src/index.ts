import { transformRequest } from './helpers/data'
import { processHeader } from './helpers/header'
import { buildURL } from './helpers/url'
import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'

export default function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  // 这个必须要在transformRequestData前调用，因为transformRequestData可以改写data
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig) {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig) {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers, data } = config
  return processHeader(headers, data)
}
