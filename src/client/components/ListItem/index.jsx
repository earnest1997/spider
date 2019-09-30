import React from 'react'
import {withRouter}from 'react-router-dom'
function handleClick(id){
  const {history} = this.props
  history.push({pathname:'article',param:id})
    }

const ListItem=({author,time,title,id,detail,source})=>{
  return  <div className='list-item' onClick={()=>handleClick(id)}>
  <div className='row row-01'>
    <span>来源于{source}</span>
    <span>.{author}</span>
    <span>.{time}</span>
  </div>
  <div className='row row-02'>{title}</div>
  <div className='row row-03'>{detail}</div>
</div>
}

export default withRouter(ListItem)