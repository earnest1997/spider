export function triggerEvent(el,type){
if('createEvent' in document){
  document.createEvent('HtmlEvents')
  // type bubble cancelble
  el.initEvent(type,false,true)
  el.dispatchEvent(el)
}
}