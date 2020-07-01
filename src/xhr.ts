import { axiosRequestConfig } from './types'
function xhr(config: axiosRequestConfig): void {
  const { data = null, method = 'GET', url = '' } = config
  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)
  request.send()
}
