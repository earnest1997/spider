/**
 * 扁平化数组
 * @param {*} arg 
 */
function flatten(arg){
  return arg.reduce((prev,next)=>{
    return prev.concat(Array.isArray(next) && flatten(next) || next)
  },[])
}
/**
 * 生成唯一ID
 * @param {*} length 
 */
function genID (length = 5) {
  return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
  }
/**
 * 生成可以获得index的可枚举对象
 * @param {*} obj 
 */
function* enumerate(obj) {
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
function filterHtmlTag(html){
  const reg=/(\<\/?[a-z]+[^\>]*\>|\\n|\s)/g
  return html.match(reg)&&html.replace(reg,'') || html
}
/**
 * 过滤类名
 * @param {*} html 
 */
function filterClass(html){
  const reg=/class=\\"[\w-]+\\"/g
  return html.match(reg)&&html.replace(reg,'') || html
}
/**
 * 过滤含有无效值的对象
 * @param {*} objArr 
 */
function filterObjWithInvalidVal(objArr){
  return objArr.filter(obj=>Object.values(obj).every(val=>!!val))
  // return objArr
}
/**
 * 合并多个函数
 * @param  {...any} f 
 */
function compose(...f){
  if(f.length===1){
    return f()
  }else{
    return f.reduce((a,b)=>(...args)=>a(b(...args)))
  }
}
/**
 * 判读是否是对象
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * 深层合并对象  caution! 传入的对象必须是对象的拷贝而不能直接将引用传进来
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
/**
 * 过滤掉对象中的属性
 * @param {Array} property 
 * @param {object} obj 
 */
function omit(property,obj){
  const _obj={...obj}
for(let k in _obj){
  if(property.includes(k)){
    Reflect.deleteProperty(_obj,k)
  }
}
return _obj
}
/**
 * 调用多个函数
 */
function createChainedFunction() {
  var args = arguments;
  return function chainedFunction() {
    for (var i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments);
      }
    }
  };
}

module.exports={
  flatten,
  genID,
  enumerate,
  filterHtmlTag,
  filterClass,
  filterObjWithInvalidVal,
  compose,
  mergeDeep,
  omit,
  createChainedFunction
}