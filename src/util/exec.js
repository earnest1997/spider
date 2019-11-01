export function copy(text, onSuccess, onError) {
  if ('execCommand' in document) {
    const dom = document.createElement('input')
    dom.value = text
    dom.select()
    dom.style.display = 'none'
    document.body.appendChild(dom)
    document.execCommand('copy')
    onSuccess()
  } else {
    onError()
  }
}
