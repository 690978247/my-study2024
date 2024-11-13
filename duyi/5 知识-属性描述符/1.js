var obj = {}

var innerValue = undefined
Object.defineProperty(obj, 'a', {
  get: function() {
    return innerValue
  },
  set: function(val) {
    innerValue = val
  }
})

obj.a = obj.a + 2
console.log(obj.a)