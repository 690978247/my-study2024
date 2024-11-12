/* 细节处理 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function runMicrotasks(fn) {
  if (typeof queueMicrotask === 'function') {
    // 存在 queueMicrotask 方法 注册微任务
    queueMicrotask(fn)
  } else if (typeof process === 'object' && typeof process.nextTick === 'function') {
    // nodejs 环境 注册微任务
    process.nextTick(fn)
  } else if (typeof MutationObserver === 'function') {
    // 创建微任务队列
    const obsever = new MutationObserver(fn)
    const text = document.createTextNode('')
    obsever.observe(text, {
      characterData: true
    })
    text.data = '1'
  } else {
    setTimeout(fn)
  }
}

function isPromiseLike(obj) {
  return obj && typeof obj.then === 'function'
}

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
    // if(this.#state !== PENDING) {
    //   this.#handlers.forEach((cb) => cb())
    //   this.#handlers = []
    // }
    // 处理微任务渲染问题 注意兼容性
    runMicrotasks(() => {
      if (this.#state !== PENDING) {
        this.#handlers.forEach((cb) => cb())
        this.#handlers = []
      }
    })

  }

  // .then 方法
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
        // pending 使用异步函数时状态为pending, 需要等待状态变更后才执行
        // 将函数保存在#handler中
        this.#handlers.push(() => {
          try {
            const cb = this.#state === FULFILLED ? onFulfilled : onRejected
            const res = typeof cb === 'function' ? cb(this.#value): this.#value
            // 如果返回的是一个Promise,则调用promise.then()
            // 判断是否符合Promise A+规范
            if(isPromiseLike(res)) {
              res.then(resolve, reject)
            } else {
              resolve(res)
            }
          } catch (err) {
            reject(err)
          }

         
        })

        // this.#handler()
        this.#runTask()

    })
  }
}

const p = new Promise((resolve, reject) => {
  // resolve(1)
  reject(1)
})

; (async () => {

  try {
    const res = await p
    console.log('1111', res)
  } catch (err){
    console.log('2222', err)
  }


})()

// 1. 处理微任务问题 
// p.then(
//   () => {
//     console.log('success')
//   },
//   () => {
//     console.log('error')
//   }
// )

// console.log('end')

// 2. Promise 返回Promise

// const p1 = p.then(
//   () => {
//     return new MyPromise((resolve, reject) => {
//       // resolve(2)
//       reject(2)
//     })
//   },
//   () => {
//     console.log('error')
//   }
// )

// p1.then((res) => {
//   console.log('p1 ===>', res)
// }, (error) => {
//   console.log('p1 error', error)
// })
