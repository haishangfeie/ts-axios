import { buildURL } from './helpers/url'
import { axiosRequestConfig } from './types/index'
import xhr from './xhr'

export default function axios(config: axiosRequestConfig) {
  processConfig(config)
  xhr(config)
}

function processConfig(config: axiosRequestConfig) {
  config.url = transformURL(config)
}

function transformURL(config: axiosRequestConfig) {
  const { url, params } = config
  return buildURL(url, params)
}
