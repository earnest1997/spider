import React from 'react'
import { connect } from 'util/store'
import ListItem from '@/client/components'
// import {functionType} from '../../util/ts'
class Home extends React.PureComponent {

  render() {
    const { hotArticlesList = [] } = this.props
    console.log(hotArticlesList, 909)
    return (
      <div className='home'>
        <HotList list={hotArticlesList} handleClick={this.handleClick}/>
      </div>
    )
  }
}

function HotList({ list }) {
  return list.map(item => (
   <ListItem {...item}/>
  ))
}

export default connect((state) => ({
  hotArticlesList: state.hotArticlesList,
}))(Home)
