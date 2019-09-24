const flatten=(arg)=>{
  return arg.reduce((prev,next)=>{
    return prev.concat(Array.isArray(next) && flatten(next) || next)
  },[])
}

module.exports={
  flatten
}