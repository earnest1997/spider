import React, { useState} from 'react'
import './index.scss'

export const Input = (props) => {
  const [value,setValue]=useState('')
  return (
    <input
      value={value}
      onChange={e => {
        setValue(e.target.value)
      }}
      {...props}
    />
  )
}

