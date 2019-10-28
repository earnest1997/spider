import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.scss'

function handleClick(id,type, push) {
  console.log(id, 'id')
  push(`/${type}/article/${id}`)
}

const ListItem = (props) => {
  const {
    history: { push },
    author,
    time,
    title,
    id,
    detail,
    source,
    type
  } = props
  return (
    <div className='list-item' onClick={() => handleClick(id,type, push)} key={id}>
      <div className='row row-01'>{title}</div>
      <div className='row row-02'>
        <i className='icon ion-md-wifi'></i>&nbsp;<span>来源于{source}</span>
        <span>{author}</span>
        <i className='icon ion-md-time'></i>&nbsp;
        <span>{time}</span>
      </div>
      <div className='row row-03' dangerouslySetInnerHTML={{__html:detail}}/>
    </div>
  )
}

export default withRouter(ListItem)
