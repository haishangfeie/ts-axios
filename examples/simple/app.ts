import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get#abc',
  params: {
    a: { g1: 1, g2: 2 }
  }
})
