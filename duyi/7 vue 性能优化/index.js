
function hasChanged(x, y) {
  if (x === y) {
    return x === 0 && 1 / x !== 1 / y
  } else {
    return x === x || y === y 
  }
}

var a = [1]

var c = a
var d = a

// console.log(c, d, c === d)
console.log(hasChanged(c, d))