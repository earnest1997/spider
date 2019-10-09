import React, { useState, useContext } from 'react'
import { CSSTransition } from 'react-transition-group'
import { context } from '@/client/store'

import '../Input'
import './index.scss'
import { Input } from '../Input'

function handleEnter(e, isInputVisible, setIsInputVisible, getSearchList) {

  if (e.nativeEvent.keyCode === 13) {
    setIsInputVisible(!isInputVisible)
    getSearchList(e.target.value)
  }
}
const Header = (props) => {
  const [isInputVisible, setIsInputVisible] = useState(false)
  const {getSearchList}=useContext(context)
  return (
    <div className='header'>
      <div className='row row-01'>
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
      <h2 className='row row-02'>FE News</h2>
    </div>
  )
}

export default Header
