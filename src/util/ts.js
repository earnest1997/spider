const { instanceMap } = require('../../bin/type.js')

function* enumerate(obj) {
  let index = 0
  for (let k in obj) {
    yield [index, k]
  }
  index++
}

function validate(type, args, funName) {
  for (let [index, key] in enumerate(type)) {
    console.log(type[key], args[index], 88)
    if (!type[key]) {
      return
    } else if (!type[key].startsWith('?') && !args[index]) {
      console.log(`${funName}:${key} is required`)
    } else if (Array.isArray(type[key]) && !type[key].includes(args[index])) {
      console.log(`${funName}:${key} should be oneof ${type[key]}`)
    } else if (
      !(args[index] instanceof instanceMap[type[key].replace('?', '')])
    ) {
      console.log(`${funName}:${key} should be ${type[key].replace('?', '')}`)
    }
  }
}

// /**
//  *
//  * @param {object} type
//  */
// exports.classType = (type,ctx) => {
//   return function classDecorator(){
//   return new Proxy(ctx, {
//     set: function(target, key, value) {
//       console.log(value,'val')
//     },
//   })
// }
// }

exports.functionType = (type) => {
  return function functionDecorator(target, name, descriptor) {
    const interceptors = {
      apply() {
        validate(type, arguments, name)
        return Reflect.apply(...arguments)
      }
    }
    const proxy = new Proxy(target[name], interceptors)
    descriptor.value = proxy
    return descriptor
  }
}
