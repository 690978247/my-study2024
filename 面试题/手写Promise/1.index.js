/* Promise 开始 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


class MyPromise {
  // 使用 # 定义私有变量
  #state = PENDING
  #value
  constructor(executor) {
    const resolve = (val) => {
      this.#setState(FULFILLED, val)
    }

    const reject = (reason) => {
      this.#setState(REJECTED, reason)
    }

    // 添加try catch 防止报错
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  #setState(state, value) {
    if(this.#state !== PENDING) return
    this.#state = state
    this.#value = value
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve(1)
  // reject(2222)
  // throw new Error('Error')
})
console.log(p)

// 原生Promise
// const p = new Promise((resolve, reject) => {
//   resolve(1)
//   // reject(1)
// })
