import React from 'src/client/page/home/react'
import {connect} from 'src/client/page/home/util/store'
import {functionType} from '../../util/ts'
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