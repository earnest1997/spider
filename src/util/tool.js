const child=require('child_process')
const flatten=(arg)=>{
  return arg.reduce((prev,next)=>{
    return prev.concat(Array.isArray(next) && flatten(next) || next)
  },[])
}

const genID =(length = 5) => {
  return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
  }

function* enumerate(obj) {
    let index = 0
    for (let k in obj) {
      yield [index, k]
    }
    index++
  }

function filterHtmlTag(html){
  const reg=/(\<\/?[a-z]+[^\>]*\>|\\n|\s)/g
  return html.match(reg)&&html.replace(reg,'') || html
}

function filterClass(html){
  const reg=/class=\\"[\w-]+\\"/g
  return html.match(reg)&&html.replace(reg,'') || html
}

function filterObjWithInvalidVal(objArr){
  return objArr.filter(obj=>Object.values(obj).every(val=>!!val))
  // return objArr
}

function compose(...f){
  if(f.length===1){
    return f()
  }else{
    return f.reduce((a,b)=>(...args)=>a(b(...args)))
  }
}

function execPromise(command) {
  return new Promise(function(resolve, reject) {
      child.exec(command, (error, stdout) => {
          if (error) {
              reject(error);
              return;
          }
console.log(88899)
          resolve(stdout.trim());
      });
  });
}

module.exports={
  flatten,
  genID,
  enumerate,
  filterHtmlTag,
  filterClass,
  filterObjWithInvalidVal,
  compose,
  execPromise
}