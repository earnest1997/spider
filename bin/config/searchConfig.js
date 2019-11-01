const { jianshuBaseConfig, juejinBaseConfig } = require('./baseConfig')
const {mergeDeep} =require('../../src/util/tool.js')
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
  maxLength:3
}

searchMap.set('juejin', mergeDeep({...juejinBaseConfig},{...jueSearchConfig}))
searchMap.set('jianshu',mergeDeep({...jianshuBaseConfig},{...jianSearchConfig}))

const searchConfig={minLength:1,maxLength:5}
module.exports = { searchMap,searchConfig }
