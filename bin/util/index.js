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

function fixZero(date){
  return (date+'').padStart(2,'0')
}

function dateFormat(time,format){
  const date=new Date(time)
  return format.replace(/yyyy/gi,date.getFullYear())
  .replace(/MM/gi,fixZero(date.getMonth()+1))
  .replace(/dd/gi,fixZero(date.getDate()))
  .replace(/hh/gi,fixZero(date.getHours()))
  .replace(/mm/gi,fixZero(date.getMinutes()))
  .replace(/ss/gi,fixZero(date.getSeconds()))
}

function filterClass(html) {
  const reg = /class=\\"[\w-]+\\"/g
  return (html.match(reg) && html.replace(reg, '')) || html
}

function filterHtmlTag(html) {
  const reg = /(\<\/?[a-z]+[^\>]*\>|\\n|\s)/g
  return (html.match(reg) && html.replace(reg, '')) || html
}

module.exports={
  flatten,
  genID,
  filterObjWithInvalidVal,
  compose,
  omit,
  mergeDeep,
  dateFormat,
  filterClass,
  filterHtmlTag
}