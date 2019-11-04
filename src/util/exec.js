import { Message } from '@/client/components'

export function copy(text) {
  if ('execCommand' in document) {
    const dom = document.createElement('input')
    dom.value = text
    dom.select()
    dom.style.display = 'none'
    document.body.appendChild(dom)
    document.execCommand('copy')
    Message.success('复制成功')
  } else {
    Message.error('复制失败')
  }
}
