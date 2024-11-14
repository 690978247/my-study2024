
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


function isPromiseLike(obj) {
  return typeof obj?.then === 'function'

}

class MyPromise{
  #value
  #state = PENDING
  #handlers =[]
  constructor(execute) {
    // 此处需要使用箭头函数 固定this指向
    const resolve = (val) => {
      this.#setState(FULFILLED, val)
    }

    const reject = (reason) => {
      this.#setState(REJECTED, reason)
    }
    try {
      execute(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING)  return
    this.#state = state
    this.#value = value
    // 执行handler
    this.#runTask()
  }

  #runTask() {
    // 加入微任务
    queueMicrotask(() => {
      if(this.#state !== PENDING) {
        this.#handlers.forEach(cb => cb()) 
        this.#handlers = []
      }
    })
  }



  /* 添加 then 方法 */
  then(onFulFilled, onRejected) {
    return new MyPromise((resolve, reject) => {
        // pending 状态
        this.#handlers.push(
          () => {
            try {
              const cb = this.#state === FULFILLED ? onFulFilled : onRejected
              const res = typeof cb === 'function' ? cb(this.#value) : this.#value

              // 判断是否符合Promise A+规范
              if(isPromiseLike(res)) {
                res.then(resolve, reject)
              } else {
                resolve(res)
              }
            } catch (err) {
              reject(err)
            }
          }
        ) 

        this.#runTask()
    })
  }
}


const p = new MyPromise((resolve, reject) => {
  console.log('999')
  // resolve(1)
  reject(2)
  // setTimeout(() => {
  //   // resolve(111)
  //   reject(222)
  // }, 1000)
})


; (async () => {

  try {
    const res = await p
    console.log('1111', res)
  } catch (err){
    console.log('2222', err)
  }


})()
