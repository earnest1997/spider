const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')

const searchMap = new Map()

const jianSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-btn'
}

const jueSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-icon'
}

searchMap.set('jianshu', { ...jianSearchConfig, ...jianshuBaseConfig })
searchMap.set('juejin', { ...jueSearchConfig, ...juejinBaseConfig })

module.exports = { searchMap }
