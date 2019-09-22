/**
 * 
 * @param {object} type 
 */
exports.classType=(type,target)=>{
return new Proxy(target.prototype,{
   set:function(target,key,value){
   if(!(value in type)){
     throw new Error(`${key} should be one of ${value}`)
   }else if(!typeof value === type[key]){
     throw new Error(`${key} should be ${type[key]}`)
   }
  }
})
}

exports.functionType=type=>{
  return function functionDecorator(target,name,descriptor){
    descriptor.set=function(value){
      if(!(value in type)){
        throw new Error(`${name} should be one of ${type}`)
      }
    }
  }
}