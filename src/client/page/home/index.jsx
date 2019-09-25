import React from 'react'
import {connect} from '../../../util/store'
// import {functionType} from '../../util/ts'
class Home extends React.PureComponent{

render(){
  const {hotArticleList=[]}=this.props
  return <div className='home'>{
    hotArticleList.map(item=><div>{item}</div>)
  }
  </div>
}
}

export default connect(state=>{
  state.hotArticleList
})(Home)