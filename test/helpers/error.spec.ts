import { AxiosError, createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
  test('should create an Error with message, config, code, request, response, and isAxiosError', () => {
    const message = 'error message'
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const code = 'error code'
    const response: AxiosResponse = {
      data: {
        foo: 'baz'
      },
      headers: null,
      config,
      request,
      status: 200,
      statusText: 'OK'
    }
    const error = createError(message, config, code, request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error instanceof AxiosError).toBe(true)
    expect(error.message).toBe(message)
    expect(error.config).toBe(config)
    expect(error.code).toBe(code)
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBe(true)
  })
})
