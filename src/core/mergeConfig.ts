import { deepMerge, isPlainObject } from '../helpers/util'
import { AxiosRequestConfig } from '../types'

const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return val2 !== undefined ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (val2 !== undefined) {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  // 这里应该时有一个假设：用到这个策略，val1只有两种可能，要不是undefined，要不是普通对象
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysFromVal2 = ['data', 'params', 'url']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null) as AxiosRequestConfig
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!(key in config2)) {
      mergeField(key)
    }
  }

  function mergeField(key: string) {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
