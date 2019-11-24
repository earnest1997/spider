import React, {
  createRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect
} from 'react'
import { createPortal, render, unmountComponentAtNode } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import {getRootNode} from 'util'
import './index.scss'

const prefixCls ='component-message'
const rootCls = `${prefixCls}-root`

export const Message = forwardRef(({ type, children, visible }, ref) => {
  const messageCls = classNames(prefixCls, type && `${prefixCls}-${type}`)
  const iconCls = classNames(
    `${prefixCls}-icon`,
    `icon ion-ios-${
      {
        info: 'alert',
        success: 'checkmark-circle',
        error: 'close-circle'
      }[type]
    }`
  )
  const [privateVisible, setPrivateVisible] = useState(false)
  useEffect(() => {
    setPrivateVisible(visible)
  }, [visible])
  useImperativeHandle(ref, () => ({
    hide: () => {
      setPrivateVisible(false)
    }
  }))
  return createPortal(
    <CSSTransition
      classNames={prefixCls}
      timeout={400}
      in={privateVisible}
      unmountOnExit
    >
      <div className={messageCls}>
        <i className={iconCls} />
        <span className={`${prefixCls}-content`}>{children}</span>
      </div>
    </CSSTransition>,
    getRootNode(rootCls)
  )
})

function renderMessage({ type, children, duration = 3000 }) {
  let mountNode = document.createElement('div')
  const ref = createRef()
  render(
    <Message type={type} ref={ref} visible>
      {children}
    </Message>,
    mountNode
  )
  setTimeout(() => {
    ref.current.hide()
    setTimeout(() => {
      unmountComponentAtNode(mountNode)
      mountNode = undefined
    }, 400)
  }, duration)
}


Message.info = (content, duration) => {
  renderMessage({ type: 'info', children: content, duration })
}

Message.success = (content, duration) => {
  renderMessage({ type: 'success', children: content, duration })
}

Message.error = (content, duration) => {
  renderMessage({ type: 'error', children: content, duration })
}

Message.displayName = 'Message'

Message.defaultProps = {
  type: 'info'
}
