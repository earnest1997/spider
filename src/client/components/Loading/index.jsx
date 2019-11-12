import React, {
  createRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react'
import { render, unmountComponentAtNode, createPortal } from 'react-dom'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import './index.scss'

const prefixCls ='component-loading'

export const Loading = forwardRef(
  ({ className, text, visible, children, full, ...restProps }, ref) => {
    const [privateVisible, setPrivateVisible] = useState(false)
    useEffect(() => {
      setPrivateVisible(visible)
    }, [visible])
    useImperativeHandle(ref, () => ({
      hide: () => {setPrivateVisible(false)}
    }))
    const maskCls = classNames(
      `${prefixCls}-mask`,
      children && `${prefixCls}-mask-withchildren`,
      full && `${prefixCls}-mask-full`,
      className
    )
    const iconCls = classNames(`${prefixCls}-icon`)
    const textCls = classNames(`${prefixCls}-text`)
    return (
      <>
        <CSSTransition
          in={privateVisible}
          unmountOnExit
          classNames={`${prefixCls}-mask`}
          timeout={300}
        >
          <div className={maskCls} {...restProps}>
            <div className={prefixCls}>
              <div className={`${prefixCls}-icon-wrapper`}>
                <div className={iconCls}></div>
              </div>
              <span className={textCls}>{text}</span>
            </div>
          </div>
        </CSSTransition>
        {children}
      </>
    )
  }
)
function getRootNode() {
  const rootCls = `${prefixCls}-root`
  let node = document.getElementsByClassName(rootCls)[0]
  if (!node) {
    node = document.createElement('div')
    node.classList.add(rootCls)
    document.body.appendChild(node)
  }
  return node
}
function LoadingFull(_, ref) {
  return createPortal(<Loading visible full ref={ref} />, getRootNode())
}

const FancyLoadingFull = forwardRef(LoadingFull)

Loading.show = () => {
  let mountNode = document.createElement('div')
  const ref = createRef()
  render(<FancyLoadingFull ref={ref} />, mountNode)
  return {
    hide() {
      ref.current.hide()
      setTimeout(() => {
        unmountComponentAtNode(mountNode)
        mountNode = undefined
      }, 300)
    }
  }
}

Loading.defaultProps = {
  text: '加载中...'
}



