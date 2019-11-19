import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { classNames } from 'util'
import { ENTER } from '@/constants'
import './index.scss'

const prefixCls = 'component-pagination'
const itemPrefixCls = `${prefixCls}-item`
const activePrefixCls = `${itemPrefixCls}-active`
const btnPrefixCls = `${prefixCls}-btn`
const disabledBtnPrefixCls = `${btnPrefixCls}-disabled`
const hiddenPrefixCls=`${prefixCls}-hidden`
const maxItemCount = 5
function Item({ index, current, handleChange, pageCount }) {
  if (index === maxItemCount - 2 && pageCount > maxItemCount) {
    return (
      <li>
        <a>...</a>
      </li>
    )
  } else if (index === maxItemCount - 1 && pageCount > maxItemCount) {
    return (
      <li onClick={(e) => handleChange(e, index)}>
        <a>{pageCount}</a>
      </li>
    )
  }
  const pos = Math.floor(current / 5) * 5 + 1
  return (
    <li
      onKeyUp={(e) => handleChange(e, index)}
      onClick={(e) => handleChange(e, index)}
      className={classNames(itemPrefixCls, {
        [activePrefixCls]: current === index + pos - 1
      })}
    >
      <a>{index + pos}</a>
    </li>
  )
}

function Btn({ itemRender, type, available, current, handleChange }) {
  let btn
  const onChange = available ? handleChange : () => {}
  if (typeof itemRender === 'function') {
    btn = React.createElement(itemRender, {
      type,
      className: classNames(btnPrefixCls, {
        [`${disabledBtnPrefixCls}-btn`]: !available
      })
    })
  } else {
    btn =
      type === 'prev' ? (
        <a>
          <i className='icon ion-md-arrow-back' />
        </a>
      ) : (
        <a>
          <i className='icon ion-md-arrow-forward' />
        </a>
      )
  }
  const _current = type === 'prev' ? current - 1 : current + 1
  return (
    <li
      onClick={(e) => {
        onChange(e, _current)
      }}
      onKeyUp={(e) => {
        onChange(e, _current)
      }}
      className={classNames(btnPrefixCls, {
        [disabledBtnPrefixCls]: !available
      })}
    >
      {btn}
    </li>
  )
}
const CPagination = (
  { total, itemRender, pageSize, onChange, current,visible,...restProps },
  ref
) => {
  const [_current, setCurrent] = useState(0)
  const pageCount = Math.ceil(total / pageSize)
  const itemCount = useMemo(() => {
    const sub = pageCount - (_current + 1)
    const tail = pageCount % maxItemCount
    return sub < tail ? tail : maxItemCount
  }, [_current, pageCount])
  const handleChange = useCallback(
    (e, index) => {
      if (e.type === 'click' || e.keyCode === ENTER) {
        if (current !== undefined) {
          return
        } else {
          setCurrent(index)
        }
        if (typeof onChange === 'function') {
          onChange(current || index)
        }
      }
    },
    [current, onChange]
  )
  const prevBtnRender =
    typeof itemRender === 'function' && itemRender.bind(null, 'prev')
  const nextBtnRender =
    typeof itemRender === 'function' && itemRender.bind(null, 'next')
  const isPrevAvailable = useMemo(()=>_current > 0,[_current])
  const isNextAvailable =useMemo(()=>{ return _current < pageCount - 1},[_current, pageCount])
  return (<ul className={classNames(prefixCls,{[hiddenPrefixCls]:!visible})} {...restProps}>
      <Btn
        itemRender={prevBtnRender}
        type='prev'
        available={isPrevAvailable}
        current={_current}
        handleChange={handleChange}
      />
      {Array.from({ length: itemCount }).map((_, index) =>
        React.cloneElement(
          <Item
            key={index}
            index={index}
            current={_current}
            handleChange={handleChange}
          />,
          { className: itemPrefixCls }
        )
      )}
      <Btn
        itemRender={nextBtnRender}
        type='next'
        available={isNextAvailable}
        current={_current}
        handleChange={handleChange}
      />
    </ul>
  )
}
function propsAreEqual(prevProps, nextProps) {
  const {onChange,...prevRestProps } = prevProps
  const { onChange:_,...nextRestProps } = nextProps
  return JSON.stringify(prevRestProps) === JSON.stringify(nextRestProps)
}
export const Pagination = React.memo(CPagination, propsAreEqual)

Pagination.displayName = 'Pagination'

// Pagination.defaultProps = {
//   total: 50,
//   pageSize: 3
// }
