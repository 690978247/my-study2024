/* 完善.then */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


class MyPromise {
  // 使用 # 定义私有变量
  #state = PENDING
  #value
  #handlers = []
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
    // .then 异步状态变更后执行回调函数
    this.#runTask()
    
  }

  #runTask() {
    if(this.#state !== PENDING) {
      this.#handlers.forEach((cb) => cb())
      this.#handlers = []
    }
  }

  // .then 方法
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
        // pending 使用异步函数时状态为pending, 需要等待状态变更后才执行
        // 将函数保存在#handler中
        this.#handlers.push(() => {
          try {
            const cb = this.#state === FULFILLED ? onFulfilled : onRejected
            // const res = cb(this.#value)
            const res = typeof cb === 'function' ? cb(this.#value): this.#value
            resolve(res)
          } catch (err) {
            reject(err)
          }

         
        })

        // this.#handler()
        this.#runTask()

    })
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve(1)
  // reject(2222)
  // throw new Error('Error')

  // setTimeout(() => {
  //   resolve(1)
  //   // reject(2)
  // }, 300)
})

p.then(
  () => {
    console.log('success')
  },
  () => {
    console.log('error')
  }
)

console.log('end')

// p.then(
//   (res) => {
//     console.log('success', res)
//     return 2
//   },
//   (err) => {
//     console.log('err', err)
//   }
// ).then(
//   (res) => {
//     console.log('inner', res)
//   }
// )

// p.then((res) => {
//   console.log('outer2', res)
// })

// 测试 null 穿透
// p.then(
//   null,
//   (err) => {
//     console.log('err', err)
//   }
// ).then(
//   (res) => {
//     console.log('第二个then',res)
//   }
// )

// 原生Promise
// const p = new Promise((resolve, reject) => {
//   // resolve(1)
//   // reject(1)
//   setTimeout(() => {
//     resolve(1)
//   }, 1000)
// })

// p.then(
//   () => {
//     console.log('success')
//   },
//   () => {
//     console.log('error')
//   }
// )

// console.log('end')

// p.then(
//   null,
//   (err) => {
//     console.log('err', err)
//   }
// ).then(
//   (res) => {
//     console.log('第二个then',res)
//   }
// )
