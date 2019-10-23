import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.scss'

function handleClick(id, push) {
  console.log(id, 'id')
  push(`article/${id}`)
}

const ListItem = (props) => {
  const {
    history: { push },
    author,
    time,
    title,
    id,
    detail,
    source
  } = props
  return (
    <div className='list-item' onClick={() => handleClick(id, push)} key={id}>
      <div className='row row-01'>{title}</div>
      <div className='row row-02'>
        <i className='icon ion-md-wifi'></i>&nbsp;<span>来源于{source}</span>
        <span>{author}</span>
        <i className='icon ion-md-time'></i>&nbsp;
        <span>{time}</span>
      </div>
      <div className='row row-03'>{detail}</div>
    </div>
  )
}

export default withRouter(ListItem)
