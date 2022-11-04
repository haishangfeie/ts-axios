import axios from '../../src/index'

// 404
axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch(error => {
    console.log('error', error)
  })

// 有50%概率触发500错误
axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch(error => {
    console.log('error', error)
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
    .catch(error => {
      console.log('error', error)
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
  .catch(error => {
    console.log('error', error)
  })
