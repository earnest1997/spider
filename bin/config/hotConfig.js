const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')

const juejinHotConfig={
  baseUrl:'https://juejin.im/welcome/frontend?sort=weekly_hottest',
  maxLength:3,
  baseSelector:'.entry-list',
  excludeChildSelector:'.ad-entry-list',
  data:{
  author:{
    selector: '.user-popover-box'
  },
  time:{
    selector:  '.meta-list .username + li'
  },
  title:{
    selector: '.info-row .title'
  },
  url:{
    baseUrl:'https://juejin.im',
    selector:'.info-row .title'
  }
  }
}

const hotMap=new Map()
hotMap.set('juejin',{...juejinBaseConfig,...juejinHotConfig})

module.exports={hotMap}