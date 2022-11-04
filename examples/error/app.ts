import axios, { AxiosError } from '../../src/index'

// 404
axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch((error: AxiosError) => {
    console.log('error.message', error.message)
    console.log('error.code', error.code)
    console.log('error.config', error.config)
    console.log('error.isAxiosError', error.isAxiosError)
    console.log('error.request', error.request)
    console.log('error.response', error.response)
  })

// 有50%概率触发500错误
axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch((error: AxiosError) => {
    console.log('error.message', error.message)
    console.log('error.code', error.code)
    console.log('error.config', error.config)
    console.log('error.isAxiosError', error.isAxiosError)
    console.log('error.request', error.request)
    console.log('error.response', error.response)
  })

// 用来模拟网络错误，在发送请求前设置网络离线
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => {
      console.log(`res:`, res)
    })
    .catch((error:AxiosError) => {
      console.log('error.message', error.message)
      console.log('error.code', error.code)
      console.log('error.config', error.config)
      console.log('error.isAxiosError', error.isAxiosError)
      console.log('error.request', error.request)
      console.log('error.response', error.response)
    })
}, 5000)

// 模拟超时
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch((error:AxiosError) => {
    console.log('error.message', error.message)
    console.log('error.code', error.code)
    console.log('error.config', error.config)
    console.log('error.isAxiosError', error.isAxiosError)
    console.log('error.request', error.request)
    console.log('error.response', error.response)
  })
