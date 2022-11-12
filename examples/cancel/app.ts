import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios({
  method: 'get',
  url: '/cancel/get',
  cancelToken: source.token
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message)
    }
  })

setTimeout(() => {
  source.cancel('Operation canceled by the user.')

  axios({
    method: 'post',
    url: '/cancel/post',
    data: { a: 1 },
    cancelToken: source.token
  })
    .then(res => {
      console.log(`res:`, res)
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        console.log(error.message)
      }
    })
}, 100)

let cancel: Canceler
axios({
  method: 'get',
  url: '/cancel/get',
  cancelToken: new CancelToken(c => (cancel = c))
})
  .then(res => {
    console.log(`res:`, res)
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled-2', error.message)
    }
  })

setTimeout(() => {
  cancel()
}, 200)
