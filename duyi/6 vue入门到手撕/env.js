/**
 * @param {Object} obj
 * @param {string} path
 */

function observe(obj) {
  for(let key in obj) {
    var innerValue = obj[key]

    // 定义数组，用于存放依赖
    // let funcs = []
    // 使用Set 保证唯一
    let funcs = new Set()
    Object.defineProperty(obj, key, {
      get: function() {
        // 依赖收集 难点1：如何知道变量属性被哪个func调用  ==> autoRun 
        // if(window.__func && !func.includes(window.__func)) {
        //   funcs.push(window.__func)
        // }

        if(windw.__func && !funcs.has(windw.__func)) {
          funcs.add(windw.__func)
        }
        return innerValue
      },
      set: function(val) {
        // 派发更新
        innerValue = val
        // 自动调用依赖该属性的函数
      }
    })

  }
}

// An: 难点1
// 定义一个方法 autoRun 给调用的func 包一层
function autoRun(func) {
  window.__func = func
  func()
  window.__func = null
}

// function autoRun(func) {
//   window.__func.add(func)
//   func()
//   window.__func.remove(func)
// }



