import axios from '../../src/index'

axios({
  method: 'post',
  url: '/extend/post',
  data: {
    msg: '只有config'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'url+config'
  }
})

// axios.request({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })

// axios.get('/extend/get')

// axios.options('/extend/options')

// axios.delete('/extend/delete')

// axios.head('/extend/head')

// axios.post('/extend/post', { msg: 'post' })

// axios.put('/extend/put', { msg: 'put' })

// axios.patch('/extend/patch', { msg: 'patch' })

interface ResponseData<T = any> {
  result: T
  code: number
  message: string
}

interface User {
  name: string
  age: number
}
function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(error => console.log(error))
}

async function test() {
  try {
    const user = await getUser<User>()
    if (user) {
      console.log(user.result.age)
    }
  } catch (error) {
    // do nothing
  }
}
test()
