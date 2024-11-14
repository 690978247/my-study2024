
#### vue 判断数据没有变化源码

``` vue

function hasChanged(x, y) {
  if (x === y) {
    return x === 0 && 1 / x !== 1 / y
  } else {
    return x === x || y === y 
  }
}

```
