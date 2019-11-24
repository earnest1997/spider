/**
 * 扁平化数组
 * @param {*} arg
 */
export function flatten(arg) {
  return arg.reduce((prev, next) => {
    return prev.concat((Array.isArray(next) && flatten(next)) || next)
  }, [])
}
/**
 * 生成唯一ID
 * @param {*} length
 */
export function genID(length = 5) {
  return Number(
    Math.random()
      .toString()
      .substr(3, length) + Date.now()
  ).toString(36)
}
/**
 * 生成可以获得index的可枚举对象
 * @param {*} obj
 */
export function* enumerate(obj) {
  let index = 0
  for (let k in obj) {
    yield [index, k]
  }
  index++
}
/**
 * 过滤html标签
 * @param {*} html
 */
export function filterHtmlTag(html) {
  const reg = /(\<\/?[a-z]+[^\>]*\>|\\n|\s)/g
  return (html.match(reg) && html.replace(reg, '')) || html
}
/**
 * 过滤类名
 * @param {*} html
 */
export function filterClass(html) {
  const reg = /class=\\"[\w-]+\\"/g
  return (html.match(reg) && html.replace(reg, '')) || html
}
/**
 * 过滤含有无效值的对象
 * @param {*} objArr
 */
export function filterObjWithInvalidVal(objArr) {
  return objArr.filter((obj) => Object.values(obj).every((val) => !!val))
  // return objArr
}
/**
 * 合并多个函数
 * @param  {...any} f
 */
export function compose(...f) {
  if (f.length === 1) {
    return f()
  } else {
    return f.reduce((a, b) => (...args) => a(b(...args)))
  }
}
/**
 * 判读是否是对象
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 深层合并对象  caution! 传入的对象必须是对象的拷贝而不能直接将引用传进来
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
/**
 * 过滤掉对象中的属性
 * @param {Array} property
 * @param {object} obj
 */
export function omit(obj,property) {
  const _obj = { ...obj }
  for (let k in _obj) {
    if (property.includes(k)) {
      Reflect.deleteProperty(_obj, k)
    }
  }
  return _obj
}
/**
 * 调用多个函数
 */
export function createChainedFunction() {
  var args = arguments
  return function chainedFunction() {
    for (var i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments)
      }
    }
  }
}

function fixZero(date) {
  return (date + '').padStart(2, '0')
}
/**
 * 格式化日期
 * @param {string} time
 * @param {string} format
 */
export function dateFormat(time, format) {
  const date = new Date(time)
  return format
    .replace(/yyyy/gi, date.getFullYear())
    .replace(/MM/gi, fixZero(date.getMonth() + 1))
    .replace(/dd/gi, fixZero(date.getDate()))
    .replace(/hh/gi, fixZero(date.getHours()))
    .replace(/mm/gi, fixZero(date.getMinutes()))
    .replace(/ss/gi, fixZero(date.getSeconds()))
}
/**
 * 判断是否爬到数据
 * @param {object} obj
 */
export function isEmptyData(obj) {
  if (Array.isArray(obj) && !obj.length) {
    return true
  } else if (Object.values(obj).every((val) => !val)) {
    return true
  }
  return false
}
/**
 * 引入多个文件
 * @param {function} r
 */
export function importAll(r,reg) {
  let cache = {}
  r.keys()
    .filter((item) => {
      if(reg){
        return reg.test(item) && item !== './index.js'
      }
      return item !== './index.js'})
    .forEach((key) => {
      const start = key.indexOf('/')
      let end
      if (key.indexOf('/') !== key.lastIndexOf('/')) {
        end = key.lastIndexOf('/')
      } else {
        end = key.lastIndexOf('.')
      }
      const _key = key.substring(start + 1, end)
      cache[_key] = r(key).default ? r(key).default : (r(key)[_key] || r(key))
    })
  return cache
}
/**
 * 获取portal的容器节点
 * @param {string} prefixCls 
 */
export function getRootNode(prefixCls) {
  let node = document.getElementsByClassName(prefixCls)[0]
  if (!node) {
    node = document.createElement('div')
    node.classList.add(prefixCls)
    document.body.appendChild(node)
  }
  return node
}

// exports = {
//   flatten,
//   genID,
//   enumerate,
//   filterHtmlTag,
//   filterClass,
//   filterObjWithInvalidVal,
//   compose,
//   mergeDeep,
//   omit,
//   createChainedFunction,
//   dateFormat,
//   isEmptyData
// }
