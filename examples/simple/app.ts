// import axios from '../../src/index'
import axios from 'axios'

axios({
  method: 'get',
  url: '/simple/get#abc',
  params: {
    a: { g1: 1, g2: 2 }
  }
})
