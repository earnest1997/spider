import { useEffect, useState, useRef, useCallback } from 'react'
import { findDOMNode } from 'react-dom'
import cp from '@/components'
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
    if (!baseClassName) {
      return
    }
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

export function useClickOutSide(ref, handler, addition = true) {
  useEffect(() => {
    if (!addition) {
      return
    }
    let dom
    if (!ref.hasOwnProperty('current')) {
      dom = document.getElementsByClassName(ref)[0]
    } else {
      dom = findDOMNode(ref.current)
    }
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    })
    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [handler, ref, addition])
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
/**
 * 挂载组件的时候发起请求
 * @param {*} req
 * @param {*} isLoading
 * @param  {...any} arg
 */
export function useRequest(req, isLoading, ...arg) {
  const [data, setData] = useState()
  const loadingRef = useRef()
  useEffect(() => {
    if (isLoading) loadingRef.current = cp.Loading.show()
    req(...arg)
      .then((res) => {
        if (res && res.data) {
          setData(res.data)
        }
      })
      .finally(() => {
        if (isLoading) loadingRef.current.hide()
      })
  }, []) // eslint-disable-line
  return [data, setData]
}
const resizeHandler = (isSmallScreen, setScreen) => {
  if (window.innerWidth < 768) {
    if (isSmallScreen === true) {
      return
    }
    setScreen(true)
  } else if (window.innerWidth > 768) {
    if (isSmallScreen === false) {
      return
    }
    setScreen(false)
  }
}
export function useDeviceScreen() {
  const [isSmallScreen, setScreen] = useState()
  const resize = resizeHandler.bind(null, isSmallScreen, setScreen)
  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resizeHandler)
  }, []) // eslint-disable-line
  return [isSmallScreen, setScreen]
}
export function useDisableScroll(addition) {
  useEffect(() => {
    if (addition) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [addition])
}
