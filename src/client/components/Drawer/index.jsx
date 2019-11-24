import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { createPortal } from 'react-dom'
import {getRootNode ,useClickOutSide,useDisableScroll } from 'util'
import './index.scss'

const prefixCls = 'component-drawer'
const maskCls = `${prefixCls}-mask`
const contentCls = `${prefixCls}-content`
const rootCls = `${prefixCls}-root`

export const Drawer = ({ children, visible, toggleVisible }) => {
  useClickOutSide(contentCls, toggleVisible, visible)
  useDisableScroll(visible)
  const container = getRootNode(rootCls)
  return createPortal(
    <CSSTransition in={visible} unmountOnExit timeout={400}>
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
