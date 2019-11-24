import React, { useState, useEffect, useRef } from 'react'
import { createPortal, render, unmountComponentAtNode } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { getRootNode, classNames, omit, useDisableScroll } from 'util'
import './index.scss'

const prefixCls = 'component-modal'
const titleCls = `${prefixCls}-title`
const contentCls = `${prefixCls}-content`
const rootCls = `${prefixCls}-root`
const btnWrapperCls = `${prefixCls}-btn`
const okBtnCls = `${prefixCls}-btn-ok`
const cancelBtnCls = `${prefixCls}-btn-cancel`
const confirmBtnCls = `${prefixCls}-btn-confrim`
const maskCls = `${prefixCls}-mask`
const wrapperCls = `${prefixCls}-wrapper`
const centeredContentCls = `${contentCls}-centered`
const closeBtnCls = `${prefixCls}-close`
const leftIconCls = `${closeBtnCls}-left`
const offsetTitleCls = `${titleCls}-offset`

const ModalNode = ({
  visible,
  title,
  children,
  handleOk,
  handleCancel,
  size,
  okText,
  cancelText,
  confirmText,
  modalType,
  width,
  isOkBtnVisible,
  isCancelBtnVisible,
  isCenterContent
}) => {
  const sizeCls = size && `${prefixCls}-${size}`
  const typeCls = modalType && `${prefixCls}-${modalType}`
  const [defaultVisible, setVisible] = useState()
  const modalRef = useRef()
  useEffect(() => {
    setVisible(visible)
  }, [visible])
  useDisableScroll(defaultVisible, setVisible)
  // btn click handler
  const onOk = () => {
    setVisible(false)
    if (typeof handleOk === 'function') {
      onOk()
    }
  }
  const onCancel = () => {
    setVisible(false)
    if (typeof handleCancel === 'function') {
      onCancel()
    }
  }
  // btn render
  const isBtnVisible = isOkBtnVisible || isCancelBtnVisible || modalType
  let okBtn = <button className={okBtnCls}>{okText}</button>
  let cancelBtn = <button className={cancelBtnCls}>{cancelText}</button>
  let confirmBtn = <button className={confirmBtnCls}>{confirmText}</button>
  okBtn = !isOkBtnVisible
    ? React.cloneElement(okBtn, { hidden: true })
    : React.cloneElement(okBtn, { onClick: onOk })
  cancelBtn = !isCancelBtnVisible
    ? React.cloneElement(cancelBtn, { hidden: true })
    : React.cloneElement(cancelBtn, { onClick: onCancel })
  confirmBtn = !modalType
    ? React.cloneElement(confirmBtn, { hidden: true })
    : React.cloneElement(confirmBtn, {
        onClick: () => setVisible(!defaultVisible)
      })

  // icon render
  const iconMap = {
    success: 'checkmark',
    info: 'information',
    error: 'close',
    confirm: 'help'
  }
  const setTransformOrigin = (e) => {
    if (!modalRef.current) {
      return
    }
    const { left, top } = modalRef.current.getBoundingClientRect()
    const transformX = e.pageX - left
    const transformY = e.pageY - top
    modalRef.current.style[
      'transformOrigin'
    ] = `${transformX}px ${transformY}px`
  }
  return (
    <CSSTransition in={defaultVisible} unmountOnExit timeout={400}>
      <div
        className={classNames(prefixCls, sizeCls, typeCls)}
        onClick={setTransformOrigin}
        ref={modalRef}
      >
        <div className={maskCls} />
        <div className={wrapperCls} style={{ width }}>
          <span
            className={classNames(closeBtnCls, {
              [leftIconCls]: !!modalType,
              [`${closeBtnCls}-${modalType}`]: !!modalType
            })}
            onClick={onCancel}
          >
            <i className={`icon ion-md-${iconMap[modalType] || 'close'}`} />
          </span>
          {title && (
            <div className={classNames(titleCls, { [offsetTitleCls]: !!modalType })}>
              {title}
            </div>
          )}
          <div
            className={classNames(contentCls, {
              [centeredContentCls]: isCenterContent
            })}
          >
            {children}
          </div>
          {isBtnVisible && (
            <div className={btnWrapperCls}>
              {okBtn}
              {cancelBtn}
              {confirmBtn}
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  )
}
export const Modal = ({ children, ...restProps }) => {
  const node = <ModalNode {...restProps}>{children}</ModalNode>
  return createPortal(node, getRootNode(rootCls))
}

Modal.confirm = (props) => {
  const validProps = omit(props, [
    'handleOk',
    'handleCancel',
    'okText',
    'cancelText'
  ])
  const { content, modalType, ...restProps } = validProps
  const node = (
    <Modal
      {...{
        visible: true,
        modalType,
        ...restProps
      }}
    >
      {content}
    </Modal>
  )
  const container = document.createElement('div')
  render(node, container)
}

Modal.success = (props) => {
  Modal.confirm({ ...props, modalType: 'success' })
}

Modal.error = (props) => {
  Modal.confirm({ ...props, modalType: 'error' })
}

Modal.warning = (props) => {
  Modal.confirm({ ...props, modalType: 'warning' })
}

Modal.info = (props) => {
  Modal.confirm({ ...props, modalType: 'info' })
}

Modal.destroyAll = () => {
//  const res= unmountComponentAtNode(getRootNode(rootCls))
//  console.log(res,9)
const root=getRootNode(rootCls)
if(document.body.contains(root)){
  document.body.style.overflow='auto'
  root.remove()
}
}

Modal.defaultProps = {
  size: 'medium',
  okText: '确定',
  cancelText: '取消',
  confirmText: '知道啦',
  width: 420,
  isCenterContent: true
}
