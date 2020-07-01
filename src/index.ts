import { axiosRequestConfig } from './types/index'
import xhr from './xhr'

export default function axios(config: axiosRequestConfig) {
  xhr(config)
}
