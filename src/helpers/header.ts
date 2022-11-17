import { Method } from '../types'
import { deepMerge, isPlainObject } from './util'

function nomalizatedHeaderName(headers: any, nomalizatedName: string): any {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== nomalizatedName && name.toUpperCase() === nomalizatedName.toUpperCase()) {
      headers[nomalizatedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  // headers是必须要有值的，否则什么都不做
  nomalizatedHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): Record<string, any> {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  const lines = headers.split('\r\n')
  lines.forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    let value = vals.join(':').trim()
    parsed[key] = value
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['get', 'delete', 'options', 'head', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
