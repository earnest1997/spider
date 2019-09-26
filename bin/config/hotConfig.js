const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')

const juejinHotConfig={
  baseUrl:'https://juejin.im/welcome/frontend?sort=weekly_hottest',
  maxLength:20,
  baseSelector:'.entry-list',
  author: '.meta-list .username',
  time: '.meta-list .username + li',
  title:'.info-row .title'
}

const hotMap=new Map()
hotMap.set('juejin',{...juejinBaseConfig,juejinHotConfig})

module.exports={hotMap}