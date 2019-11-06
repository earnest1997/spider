import { useEffect, useState, useCallback } from 'react'
import { findDOMNode } from 'react-dom'
import { throttle } from './optimization'
import { copy } from './exec'

export const getCurrentHookValue = (setHookFunction) => {
  return new Promise((resolve) => {
    setHookFunction((prev) => {
      resolve(prev)
      return prev
    })
  })
}

export function useLazyLoad(baseClassName) {
  const scroll = (imgDom) => {
    if (imgDom.every((img) => img.dataset.src === img.src)) {
      return
    }
    for (let img of imgDom) {
      if (img.getBoundingClientRect().top > 0 && img.dataset.src !== img.src) {
        img.src = img.dataset.src
      }
    }
  }
  useEffect(() => {
    const rootDom = document.getElementsByClassName(baseClassName)[0]
    if (!rootDom) {
      return
    }
    const imgDom = rootDom.getElementsByTagName('img')
    const scrollHandler = scroll.bind(null, Array.from(imgDom))
    document.addEventListener('scroll', scrollHandler)
    return () => {
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [baseClassName])
}

export function useClickOutSide(ref, handler) {
  useEffect(() => {
    const dom = findDOMNode(ref.current)
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    })
    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [handler, ref])
}

export function useScroll(distance) {
  const [isScrollToDistance, setScrollToDistance] = useState(false)
  const scrollHandler = useCallback(() => {
    const scrollDis = Math.max(
      document.body.scrollTop,
      document.documentElement.scrollTop
    )
    if (scrollDis >= distance) {
      setScrollToDistance(true)
    } else if (scrollDis < distance) {
      setScrollToDistance(false)
    }
  }, [distance]) // eslint-disable-line
  const throttledScroll = throttle(scrollHandler, 200)
  useEffect(() => {
    document.addEventListener('scroll', throttledScroll)
    return () => {
      return document.removeEventListener('scroll', throttledScroll)
    }
  }, [scrollHandler, throttledScroll])
  return isScrollToDistance
}

export function useCopy(selector = 'copy-code-btn') {
  useEffect(() => {
    const clickHanlder = (el) => {
      const index = el.dataset.index
      const code = document.getElementsByTagName('code')[index]
      const content = code && code.textContent
      copy(content)
    }
    const btn = document.getElementsByClassName(selector)[0]
    if (!btn.length) {
      console.log('没有该复制按钮')
      return
    }
    btn.addEventListener('click', clickHanlder)
    return () => {
      btn.removeEventListener('click', clickHanlder)
    }
  }, [selector])
}
