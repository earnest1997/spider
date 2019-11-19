import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { createPortal } from 'react-dom'
import { useClickOutSide } from 'util'
import './index.scss'

const prefixCls = 'component-drawer'
const maskCls = `${prefixCls}-mask`
const contentCls = `${prefixCls}-content`
const rootCls = `${prefixCls}-root`
function getRootNode() {
  let root = document.getElementsByClassName(rootCls)[0]
  if (!root) {
    root = document.createElement('div')
    root.className = rootCls
    document.body.append(root)
  }
  return root
}
export const Drawer = ({ children, visible, toggleVisible }) => {
  useClickOutSide(contentCls, toggleVisible, visible)
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflowY='scroll'
    }
  }, [visible])
  const container = getRootNode()
  return createPortal(
    <CSSTransition in={visible} unmountOnExit timeout={300}>
      {
        <div className={prefixCls}>
          <div className={maskCls} />
          <div className={contentCls}>{children}</div>
        </div>
      }
    </CSSTransition>,
    container
  )
}
