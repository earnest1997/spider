import React, { useEffect, useCallback, useRef, useState } from 'react'
import { Hover } from 'perspective.js'
import { withRouter, Link } from 'react-router-dom'
import { useScroll, useDeviceScreen } from 'util'
import { connect } from '@/store'
import cp from '@/components'
import './index.scss'

const Header = ({ history, getSearchList, location }) => {
  const headerRef = useRef()
  const [val, setVal] = useState()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const handleMenuClick = useCallback(
    () => setDrawerVisible((prev) => !prev),
    []
  )
  const handleChange = (e) => {
    setVal(e.target.value)
  }
  const handleEnter = useCallback(
    (e) => {
      if (e.nativeEvent.keyCode === 13 || e.type === 'click') {
        if (!e.target.value) {
          return
        }
        setVal('')
        if (location.pathname.includes('search')) {
          getSearchList(e.target.value)
          return
        }
        history.push({
          pathname: '/search',
          query: { q: e.target.value },
          state: { keywords: e.target.value }
        })
      }
    },
    [getSearchList, history, location.pathname]
  )
  const handleItemClick = useCallback(() => {
    setDrawerVisible(!drawerVisible)
  }, [drawerVisible])
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
    if (window.sessionStorage.keywords) {
      setVal(window.sessionStorage.keywords)
    }
    // initAnimation(headerRef.current)
  }, [initAnimation])

  const isSwitchHeader = useScroll(333.5)
  const [isSmallScreen] = useDeviceScreen()
  const classNames = !isSwitchHeader
    ? 'header header-banner'
    : 'header header-bar'
  let style = isSwitchHeader
    ? { height: 400, width: '100vw' }
    : { height: 115, width: '100vw' }
  const placeholder = <div style={style}></div>
  return (
    <>
      {isSwitchHeader && placeholder}
      <div className={classNames} ref={headerRef}>
        <div className='row row-01' data-hover-layer='0'>
          {isSmallScreen && isSwitchHeader ? (
            <i className='icon ion-md-menu' onClick={handleMenuClick} />
          ) : (
            <i className='icon ion-md-search' />
          )}
          <input
            onKeyUp={(e) => handleEnter(e)}
            onClick={(e) => handleEnter(e)}
            value={val}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <h2 className='row row-02' data-hover-layer='1'>
          FE News
        </h2>
        <cp.Drawer visible={drawerVisible} toggleVisible={handleMenuClick}>
        <div className='menu-mobile'>
          <Link to='/' onClick={handleItemClick}>
            首页
          </Link>
          </div>
        </cp.Drawer>
      </div>
    </>
  )
}

export default withRouter(
  connect((store) => ({ getSearchList: store.getSearchList }))(Header)
)
