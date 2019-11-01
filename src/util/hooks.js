import { useEffect } from 'react'

export function useLazyLoad(baseClassName) {
  const scroll = (imgDom) => {
    if(imgDom.every(img=>img.dataset.src === img.src)){
      return
    }
    for(let img of imgDom){
    if (
      img.getBoundingClientRect().top > 0 &&
      img.dataset.src !== img.src
    ) {
      img.src = img.dataset.src
    }
  }
  }
  useEffect(() => {
    const rootDom = document.getElementsByClassName(baseClassName)[0]
    if(!rootDom){
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
