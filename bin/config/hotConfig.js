const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')

const juejinHotConfig={
  baseUrl:'https://juejin.im/welcome/frontend?sort=weekly_hottest',
  maxLength:12,
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
  },
    cssSource:"https://b-gold-cdn.xitu.io/v3/static/css/0.8601f73e886b71530583.css"     
  }
}

const hotMap=new Map()
hotMap.set('juejin',{...juejinBaseConfig,...juejinHotConfig})

module.exports={hotMap}