import React from 'react'
import {connect} from 'util/store'
class Home extends React.PureComponent{
render(){
  const {hotArticles=[]}=this.props
  return <div className='home'>{
    hotArticles.map(item=><div>{item}</div>)
  }
  </div>
}
}

export default connect(state=>{
  hotArticles:state.hotArticles
})(Home)