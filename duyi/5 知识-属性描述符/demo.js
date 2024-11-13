var aGoods = {
  pic: '',
  title: '',
  desc: '',
  sellNumber: '',
  favorRate: '',
  price: 3
}

class UIGoods {
  
  constructor(g) {
    // this.data = g
    Object.defineProperty(this, 'data', {
      // value: g,
      // writable: false,
      configurable: false,
      get: function() {
        return g
      },
      set: function() {
        console.log('set')
        throw new Error('该属性不能赋值！')
      }
    })

    let innerChooseValue = 0
    // 扩展属性值 choose
    Object.defineProperty(this, 'choose', {
      get: function () {
        return innerChooseValue
      },
      set: function (val) {
        if(typeof val !== 'number') {
           throw new Error('choose 必须是数字类型')
        }

        if(parseInt(val) !== val) {
          throw new Error('choose 必须是整数')
        }

        if(val < 0) {
          throw new Error('choose 必须大于等于0')
        }

        innerChooseValue = val 
      },
      configurable: false
    })
    
    // 扩展属性值 totalPrice
    // Object.defineProperty(this, 'totalPrice', {
    //   get: function () {
    //     return this.data.price * this.choose
    //   },
    // })

  }
    // es6 写法 扩展属性值 totalPrice
  // get totalPrice() {
  //   return this.choose * this.data.price
  // }

  get isChoose () {
    return this.choose > 0
  }
}

var g = new UIGoods(aGoods)
// g.data = '123'
g.choose = 2
console.log('tttt', g.totalPrice)
console.log(g.choose)
console.log(g)