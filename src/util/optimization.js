export function throttle(fun, delay) {
  let last, timer
  return function() {
    let self = this,
      args = arguments,
      now = +new Date()

    if (last && now < last + delay) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fun.apply(self, args)
      }, delay)
    } else {
      last = now
      fun.apply(self, args)
    }
  }
}
