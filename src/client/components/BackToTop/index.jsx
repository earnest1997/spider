import React from 'react'
import { img } from '@/static'
import { useScroll } from 'util'
import { CSSTransition } from 'react-transition-group'
import './index.scss'

const clickHandler = () => {
  const topNode = document.createElement('div')
  // topNode.style.cssText+=';width:1px;height:1px'
  document.body.prepend(topNode)
  topNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
  topNode.remove()
}

export const BackToTop = () => {
  const visible = useScroll(1300)
  return (
    <CSSTransition in={visible} unmountOnExit timeout={300}>
      <img src={img.up} onClick={clickHandler} className='backtotop' />
    </CSSTransition>
  )
}
