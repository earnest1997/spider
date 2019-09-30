const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')

const searchMap = new Map()

const jianSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-btn',
  isNewTab: true,
  // baseSelector: '.search-content .note-list>li'
}

const jueSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-icon',
  isNewTab: false
}

searchMap.set('jianshu', {  ...jianshuBaseConfig,...jianSearchConfig })
searchMap.set('juejin', {  ...juejinBaseConfig,...jueSearchConfig })

module.exports = { searchMap }
