import { isPlainObject, isDate, isURLSearchParams } from './util'

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

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  const hashIndex = url.indexOf('#')
  if (hashIndex > -1) {
    url = url.slice(0, hashIndex)
  }
  if (!params) {
    return url
  }
  let serializatedParams
  if (paramsSerializer) {
    serializatedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializatedParams = params.toString()
  } else {
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

    serializatedParams = tempValues.join('&')
  }

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

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combinURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
