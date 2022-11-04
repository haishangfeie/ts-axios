import axios from '../../src/index'

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: ['bar', 'baz']
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: {
//       bar: 'bar'
//     }
//   }
// })

// const data = new Date()
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     data
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: '@:$, '
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: 'foo',
//     baz: null
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get#hash',
//   params: {
//     foo: 'foo'
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// })

axios({
  method: 'post',
  url: '/base/post',
  data: {
    bar: 'baz1'
  }
})

axios({
  method: 'post',
  url: '/base/post',
  data: {
    bar: 'baz2'
  },
  headers:{
    'content-type':'application/json',
    'Accept':'application/json, text/plain, */*'
  }
})

const arr = new Int32Array([21, 32])
axios({
  method: 'post',
  url: '/base/buffer',
  data: arr
})

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)

axios({
  method: 'post',
  url: '/base/post',
  // 如果data是URLSearchParams对象或者FormData，浏览器是可以自动设置合适的content-type的
  data: searchParams
})
