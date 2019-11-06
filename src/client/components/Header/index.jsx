import React, { useContext, useEffect, useCallback, useRef } from 'react'
import { Hover } from 'perspective.js'
import { context } from '@/client/store'
import { withRouter } from 'react-router-dom'
import { Input } from '../Input'
import { useScroll } from '@/util'
import './index.scss'

const Header = ({ history }) => {
  const { getSearchList } = useContext(context)
  const headerRef = useRef()
  const handleEnter = useCallback(
    (e, getSearchList) => {
      if (e.nativeEvent.keyCode === 13) {
        getSearchList(e.target.value)
        history.push(`/search?q=${e.target.value}`)
      }
    },
    [history]
  )
  const initAnimation = useCallback((dom) => {
    new Hover(dom, {
      max: 1,
      scale: 1.1,
      perspective: 500,
      layers: [
        {
          multiple: 0.1,
          reverseTranslate: true
        },
        {
          multiple: 0.2,
          reverseTranslate: true
        }
      ]
    })
  }, [])
  useEffect(() => {
    console.log(window.getComputedStyle(headerRef.current).height,9000)
    // initAnimation(headerRef.current)
  }, [initAnimation])

  const isSwitchHeader = useScroll(333.5)
  const classNames = !isSwitchHeader
    ? 'header header-pc'
    : 'header header-mobile'
  const placeholder = <div style={{ height: 400, width: '100vw' }}></div>
  return (
    <>
      {isSwitchHeader && placeholder}
      <div className={classNames} ref={headerRef}>
        <div className='row row-01' data-hover-layer='0'>
          <i className='icon ion-md-search'></i>

          <Input onKeyUp={(e) => handleEnter(e, getSearchList)} />
        </div>
        <h2 className='row row-02' data-hover-layer='1'>
          FE News
        </h2>
      </div>
    </>
  )
}

export default withRouter(Header)
