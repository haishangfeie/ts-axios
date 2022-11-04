import { isPlainObject } from './util'

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

export function processHeader(headers: any, data: any): any {
  nomalizatedHeaderName(headers, 'Content-Type')
  if (!headers) {
    headers = {}
  }
  if (isPlainObject(data)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
