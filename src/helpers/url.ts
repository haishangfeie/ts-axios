import { isPlainObject, isDate } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

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
      }
      // todo: 这里用isPlainObject合适吗？
      // 如果不是普通对象，例如这里是数组怎么办？
      // axios({
      //   method: 'get',
      //   url: '/base/get?foo=bar',
      //   params: {
      //     bar: [[1],2,3]
      //   }
      // })
      else if (isPlainObject(value)) {
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

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)

  return (
    currentOrigin.host === parsedOrigin.host && currentOrigin.protocol === parsedOrigin.protocol
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
