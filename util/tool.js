const flatten=(arg)=>{
  return arg.reduce((prev,next)=>{
    return prev.concat(Array.isArray(next) && flatten(next) || next)
  },[])
}

const genID =(length = 5) => {
  return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
  }

module.exports={
  flatten,
  genID
}