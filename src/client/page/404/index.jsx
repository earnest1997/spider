import React from 'react'
import {Link} from 'react-router-dom'
import img from '@/static/404.png'
import './index.scss'

export const NotFound = () => (
  <div className='notfound'>
  <img src={img} className='col col-01'/>
  <div className='col col-02'>
    <h1>404</h1>
    <h2>页面不存在</h2>
    <Link to='/'><h4>返回首页</h4></Link>
    </div>
  </div>
)
