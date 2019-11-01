import React, {
  useState,
  useImperativeHandle,
  createRef,
  forwardRef,
  useEffect
} from 'react'
import { createPortal, unmountComponentAtNode, render } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import './index.scss'

const prefixCls = 'component-message'
const Message = forwardRef(({ info, type }, ref) => {
  const [visible, setVisible] = useState(false)
  const [infos,setInfo]=useState([])
  const container = document.createElement('div')
  container.className = `${prefixCls}-wrapper`

  const maxInstanceCount=6
  useEffect(() => {})
 const hide = () => {
  setVisible(false)
}
  const remove=()=>{
    const _infos=[...infos]
    _infos.shift()
    setInfo([..._infos])
  }

  const add=()=>{
    setInfo([[...infos],[...[info]]])
  if(infos.length+1>=length){
    remove()
  }
  }

  const clean=()=>{
    setTimeout(remove,100)
  }

  useImperativeHandle(ref, () => ({
    hide:hide,
   add: add,
   remove: remove
  }))
const renderInfoNode=info=>( <CSSTransition in={visible} className='input' timeout={300} unmountOnExit>
<div className={classNames(`${prefixCls}-${type}`)}>{info}</div>
</CSSTransition>)
  return createPortal(
   <>{infos.map(info=>renderInfoNode(info))}</> 
    ,container
  )
})

function renderMessage(type, info) {
  const ref = createRef()
  const rootNode = document.body
  const rootContainer = document.createElement('div')
  rootNode.appendChild(rootContainer)

  
  render(<Message ref={ref} type={type} info={info}/>, rootContainer)
  setTimeout(() => {
    ref.current.clean()
    unmountComponentAtNode(rootContainer)
    document.removeChild(rootContainer)
  }, 100)
}

Message.success = function(info) {
  renderMessage('success', info)
}

Message.error = function(info) {
  renderMessage('error', info)
}

Message.warning = function(info) {
  renderMessage('warning', info)
}
