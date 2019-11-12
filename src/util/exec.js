import cp from '@/components'

export function copy(text) {
  if ('execCommand' in document) {
    const dom = document.createElement('input')
    dom.value = text 
    document.body.appendChild(dom)
    dom.select()
    document.execCommand('copy')
    dom.remove()
    cp.Message.success('复制成功')
  } else {
    cp.Message.error('复制失败')
  }
}
