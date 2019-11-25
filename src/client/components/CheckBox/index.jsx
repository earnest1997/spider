import React, { useState, useEffect } from 'react'
import {classNames} from 'util'
import './index.scss'

const prefixCls = 'component-checkbox'
const checkedCls = `${prefixCls}-checked`
const disabledCls = `${prefixCls}-disabled`

export const CheckBox = ({ handleChange, disable, checked }) => {
  const [isChecked, setChecked] = useState()
  useEffect(() => {
    if (isChecked !== checked && checked!== undefined) {
      setChecked(checked)
    }
  }, [checked, isChecked])
  const onChange = () => {
    if (typeof handleChange === 'function') {
      handleChange()
    }
    setChecked(!isChecked)
  }
  return (
    <span
      className={classNames(prefixCls, {
        [checkedCls]: !!isChecked,
        [disabledCls]: !!disable
      })}
    >
       <i className='icon ion-md-checkmark' />
      <input type='checkbox' onChange={onChange} checked={!!isChecked}/>
    </span>
  )
}
