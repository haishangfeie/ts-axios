import { isObject } from 'lodash'
import { isDate } from './util'

const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/gi, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  const hashIndex = url.indexOf('#')
  if (hashIndex > -1) {
    url = url.slice(0, hashIndex)
  }
  if (!params) {
    return url
  }
  const tempValues: string[] = []

  Object.keys(params).forEach(key => {
    let values = params[key]

    if (values === null || values === undefined) {
      return
    }

    if (Array.isArray(values)) {
      key += '[]'
    } else {
      values = [values]
    }

    values.forEach((value: unknown) => {
      if (isDate(value)) {
        value = value.toISOString()
      } else if (isObject(value)) {
        value = JSON.stringify(value)
      }
      tempValues.push(`${encode(key)}=${encode(value as string)}`)
    })
  })

  const serializatedParams = tempValues.join('&')

  if (serializatedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializatedParams
  }
  return url
}
