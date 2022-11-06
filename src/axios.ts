import Axios from './core/Axios'
import { extend } from './helpers/util'
import { AxiosInstance } from './types'

function createInstance(): AxiosInstance {
  const context = new Axios()
  // 按照我的理解，const instance = Axios.prototype.request.bind(context)是等价的
  // todo: 这里是不是绑定到instance会更好？
  const instance = context.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
