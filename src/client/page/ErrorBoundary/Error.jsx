import React from 'react'
import {errorMap} from '@/client/constants'

export const Error=({errCode})=>(
  <div className='error'>
    <h1>页面出错了:{errorMap[errCode]}</h1>
  </div>
)