import React, { useState, useContext,useEffect,useCallback,useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import {Hover} from 'perspective.js'
import { context } from '@/client/store'
import {withRouter} from 'react-router-dom'
import { Input } from '../Input'
import './index.scss'

const Header = ({history}) => {
  const [isInputVisible, setIsInputVisible] = useState(false)
  const {getSearchList}=useContext(context)
  const headerRef=useRef()
  const handleEnter =useCallback((e, isInputVisible, setIsInputVisible, getSearchList)=>{
    if (e.nativeEvent.keyCode === 13) {
      setIsInputVisible(!isInputVisible)
      getSearchList(e.target.value)
      history.push(`/search?q=${e.target.value}`)
    }
  },[history])
  const initAnimation=useCallback((dom)=>{
    console.log(dom)
    new Hover(dom,{
  max:1,
  scale:1.1,
  perspective:500,
  layers:[
    {
      multiple:0.1,
      reverseTranslate:true
    },{
      multiple:0.2,
      reverseTranslate:true
    }
  ]
    })
  },[])
  useEffect(()=>{
    // initAnimation(headerRef.current)
  },[initAnimation])
  return (
    <div className='header' ref={headerRef}>
      <div className='row row-01'  data-hover-layer='0'>
        <i
          className='icon ion-md-search'
          onClick={() => {
            setIsInputVisible(!isInputVisible)
          }}
        ></i>

        <CSSTransition
          in={isInputVisible}
          className='input'
          timeout={1000}
          unmountOnExit
        >
          {(isInputVisible && (
            <Input
              onKeyUp={(e) =>
                handleEnter(
                  e,
                  isInputVisible,
                  setIsInputVisible,
                  getSearchList
                )
              }
            />
          )) || <></>}
        </CSSTransition>
      </div>
      <h2 className='row row-02' data-hover-layer='1'>FE News</h2>
    </div>
  )
}

export default withRouter(Header)
