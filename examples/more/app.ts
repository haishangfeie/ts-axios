import axios, { AxiosRequestConfig } from '../../src/index'
import 'nprogress/nprogress.css'
import Nprogress from 'nprogress'
import qs from 'qs'
// document.cookie = 'a=b'

// axios.get('/more/get').then(res => {
//   console.log('res', res)
// })

// axios
//   .post(
//     'https://127.0.0.1:8088/more/server2',
//     {},
//     {
//       withCredentials: true
//     }
//   )
//   .then(res => {
//     console.log('res', res)
//   })

// const instance = axios.create({
//   xsrfCookieName:'XSRF-TOKEN-D',
//   xsrfHeaderName:'X-XSRF-TOKEN-D'
// })
// instance.get('/more/get').then(res => {
//   console.log('res', res)
// })

// const instance2 = axios.create({
//   timeout: 10000
// })

// function calculatePercentage(loaded: number, total: number) {
//   return Math.floor(loaded * 1.0) / total
// }

// function loadProgressBar() {
//   const setupStartProgress = () => {
//     instance2.interceptors.request.use(config => {
//       Nprogress.start()
//       return config
//     })
//   }
//   const setupUpdateProgress = () => {
//     const update = (e: ProgressEvent) => {
//       console.log(e)
//       Nprogress.set(calculatePercentage(e.loaded, e.total))
//     }
//     instance2.defaults.onDownloadProgress = update
//     instance2.defaults.onUploadProgress = update
//   }

//   const setupStopProgress = () => {
//     instance2.interceptors.response.use(
//       res => {
//         Nprogress.done()
//         return res
//       },
//       error => {
//         Nprogress.done()
//         return Promise.reject(error)
//       }
//     )
//   }
//   setupStartProgress()
//   setupUpdateProgress()
//   setupStopProgress()
// }
// loadProgressBar()

// const downloadEl = document.querySelector('#download')
// downloadEl!.addEventListener('click', e => {
//   instance2
//     .get('/more/download', {
//       responseType: 'blob'
//     })
//     .then(res => {
//       const { data, headers } = res
//       const match = headers['content-disposition'].match(new RegExp('(^|;\\s*)(filename=)([^;]*)'))
//       const fileName = match ? match[3] : 'unknow'

//       // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
//       //const blob = new Blob([JSON.stringify(data)], ...)
//       const blob = new Blob([data], { type: headers['content-type'] })
//       let dom = document.createElement('a')
//       let url = window.URL.createObjectURL(blob)
//       dom.href = url
//       dom.download = decodeURI(fileName)
//       dom.style.display = 'none'
//       document.body.appendChild(dom)
//       dom.click()
//       dom.parentNode!.removeChild(dom)
//       window.URL.revokeObjectURL(url)
//     })
// })

// const uploadEl = document.querySelector('#upload')
// uploadEl!.addEventListener('click', e => {
//   const data = new FormData()
//   const fileEl = document.querySelector('#file') as HTMLInputElement
//   if (fileEl.files) {
//     data.append('file', fileEl.files[0])
//     instance2.post('/more/upload', data)
//   }
// })

// axios
//   .post(
//     '/more/post',
//     {
//       a: 1
//     },
//     {
//       auth: {
//         username: 'FE',
//         password: '123456'
//         // password: '123451'

//       }
//     }
//   )
//   .then(res => {
//     console.log('res', res)
//   })

// axios
//   .get('/more/304')
//   .then(res => {
//     console.log('res', res)
//   })
//   .catch(error => {
//     console.log(error)
//   })

// axios
//   .get('/more/304', {
//     validateStatus(status) {
//       return status >= 200 && status < 400
//     }
//   })
//   .then(res => {
//     console.log('res', res)
//   })
//   .catch(error => {
//     console.log(error.message)
//   })

// axios
//   .get('/more/get', {
//     params: new URLSearchParams('a=b&c=d')
//   })
//   .then(res => {
//     console.log('res', res)
//   })

// axios
//   .get('/more/get', {
//     params: {
//       a: 1,
//       b: 2,
//       c: ['a', 'b', 'c']
//     }
//   })
//   .then(res => {
//     console.log('res', res)
//   })

// const instance3 = axios.create({
//   paramsSerializer(params) {
//     return qs.stringify(params, {
//       arrayFormat: 'brackets'
//     })
//   }
// })
// instance3
//   .get('/more/get', {
//     params: {
//       a: 1,
//       b: 2,
//       c: ['a', 'b', 'c']
//     }
//   })
//   .then(res => {
//     console.log('res', res)
//   })

// const instance4 = axios.create({
//   baseURL: 'https://dummyimage.com/'
// })
// instance4.get('120x600')

// instance4.get('https://api.thecatapi.com/v1/images/search?limit=1', {
//   timeout: 5000
// })

function getA() {
  return axios.get('/more/getA')
}
function getB() {
  return axios.get('/more/getB')
}

axios.all([getA(), getB()]).then(
  axios.spread(function(resA, resB) {
    console.log(resA.data)
    console.log(resB.data)
  })
)

axios.all([getA(), getB()]).then(([resA, resB]) => {
  console.log(resA.data)
  console.log(resB.data)
})

const fakeConfig: AxiosRequestConfig = {
  baseURL: 'https://www.baidu.com/',
  url: '/user/12345',
  params: {
    idClient: 1,
    idTest: 2,
    testString: 'thisIsATest'
  }
}

console.log(axios.getUri(fakeConfig))
