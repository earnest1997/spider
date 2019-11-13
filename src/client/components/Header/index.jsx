import React, { useEffect, useCallback, useRef } from 'react'
import { Hover } from 'perspective.js'
import { withRouter } from 'react-router-dom'
import { Input } from '../Input'
import { useScroll } from 'util'
import cp from '@/components'
import './index.scss'

const Header = ({ history }) => {
  const headerRef = useRef()
  const handleEnter = useCallback(
    (e) => {
      if (e.nativeEvent.keyCode === 13) {
        if (!e.target.value) {
          cp.Message.warning('请输入关键字')
          return
        }
        history.push({
          pathname: `/search?q=${e.target.value}`,
          state: { keywords: e.target.value }
        })
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
    console.log(window.getComputedStyle(headerRef.current).height, 9000)
    // initAnimation(headerRef.current)
  }, [initAnimation])

  const isSwitchHeader = useScroll(333.5)

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
          <i className='icon ion-md-search' />
          <Input onKeyUp={(e) => handleEnter(e)} />
        </div>
        <h2 className='row row-02' data-hover-layer='1'>
          FE News
        </h2>
      </div>
    </>
  )
}

export default withRouter(Header)
