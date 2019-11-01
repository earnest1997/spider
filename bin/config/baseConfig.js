const jianshuBaseConfig = {
  baseUrl: 'https://www.jianshu.com/',
  baseSelector: '.note-list>li',
  maxLength: 4,
  data: {
    baseSelectorToGetClassName:
      'article',
    author: {
      selector: '.nickname'
    },
    time: {
      selector: '.time'
    },
    title: {
      selector: '.title'
    },
    url: {
      selector: '.title'
    },
    detail: {
      baseSelector: 'div[role="main"]>div section:first-child',
      content: {
        selector: 'article'
      },
      time: {
        selector: 'time'
      }
    }
  }
}
const juejinBaseConfig = {
  baseUrl: 'https://juejin.im/',
  baseSelector: '.main-list>li',
  maxLength: 4,
  data: {
    baseClassName: 'article-content',
    author: {
      selector: '.user-popover-box a'
    },
    time: {
      selector: '.meta-list li:nth-child(3)'
    },
    title: {
      selector: '.title-row span'
    },
    url: {
      selector: '.title-row a'
    },
    detail: {
      baseSelector: 'main article',
      content: {
        selector: 'div[itemprop="articleBody"]'
      },
      time: {
        selector: 'time'
      }
    }
  }
}
const sourceMap = {
  jiashu: '简书',
  juejin: '掘金'
}
const baseConfigMap = new Map()
baseConfigMap.set('jianshu', jianshuBaseConfig)
baseConfigMap.set('juejin', juejinBaseConfig)
module.exports = {
  jianshuBaseConfig,
  juejinBaseConfig,
  baseConfigMap,
  sourceMap
}
