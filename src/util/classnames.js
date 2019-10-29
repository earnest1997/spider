export const classNames = (...arg) => {
  let _class = []
  for (let classname of arg) {
    if (typeof classname === 'string') {
      _class.push(classname)
    } else if (classname instanceof Object) {
      const classArr = Object.entries(classname)
        .filter((item) => item[1])
        .map((item) => item[0])
      _class=_class.concat(classArr)
    }
  }
  return _class.join(' ')
}
