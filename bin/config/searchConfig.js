const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')
const {mergeDeep} =require('../util/index.js')
const searchMap = new Map()

const jianSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-btn',
  isNewTab: true,
  maxLength:2
}

const jueSearchConfig = {
  searchInput: '.search-input',
  searchBtn: '.search-icon',
  isNewTab: false,
  maxLength:4
}

searchMap.set('juejin', mergeDeep({...juejinBaseConfig},{...jueSearchConfig}))
searchMap.set('jianshu',mergeDeep({...jianshuBaseConfig},{...jianSearchConfig}))

const searchConfig={minLength:1,maxLength:13}
module.exports = { searchMap,searchConfig }
