import { useEffect } from 'react'
import { findDOMNode } from 'react-dom'

export function handleClickOutSide(ref, handler) {
  useEffect(() => {
    console.log(888,ref,ref.current)
    const dom =findDOMNode(ref.current)
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    })
    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [])
}
