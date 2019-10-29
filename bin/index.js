#!/usr/bin/env node

const fs = require('fs-extra')
const process = require('process')
const path = require('path')
const shelljs = require('shelljs')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const db = require(path.resolve(__dirname, './db.js'))
// 配置
const { searchMap } = require(path.resolve(
  __dirname,
  './config/searchConfig.js'
))
const { baseConfigMap, sourceMap } = require(path.resolve(
  __dirname,
  './config/baseConfig.js'
))
const { hotMap } = require(path.resolve(__dirname, './config/hotConfig.js'))
// tool
const {
  flatten,
  genID,
  filterObjWithInvalidVal,
  compose,
} = require(path.resolve(__dirname, './tool.js'))

const srcHtml = path.resolve(__dirname, '../src/index.tpl.html')
// @classType(type.Ispider)
class Spider {
  /**
   *
   * @param {*} operation 可选值: search hot
   * @param {*} options keywords|...
   */
  constructor(operation, options = { keywords: 'node' }) {
    this.operation = operation
    this.options = options
    // return new Proxy(this, {
    //   set: (target, key, value) => {
    //     return true
    //   }
    // })
  }
  start() {
    console.log(this.operation,this.options,9088)
    db.set('test','sss')
    this[`${this.operation}Article`](this.options)
    // fs.truncateSync(path.resolve(__dirname,'./db.json'),0,function(){console.log('unset db')})
    // this.searchArticle(this.options)
  }

  createStorePath() {
    if (!fs.existsSync(this.storePath)) {
      shelljs.mkdir(path)
    } else if (!fs.statSync(path).isDirectory) {
      throw new Error('storepath must be dir')
    }
    if (shelljs.error()) {
      console.log('dir create fail')
    }
  }
// 搜索文章
  async searchArticle() {
    const { keywords } = this.options
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    let urlsWithKeys = []
    console.log('seach',1)
    for (let [k, v] of searchMap.entries()) {
      const {
        baseUrl,
        searchInput,
        searchBtn,
        baseSelector,
        maxLength,
        data,
        isNewTab,
      } = v
      await page.goto(baseUrl)
      await page.type(searchInput, keywords, { delay: 100 }).catch((err) => {
        console.log(err, '2')
      })

      await page.click(searchBtn).catch((err) => {
        console.log(err, '3')
      })
      if (isNewTab) {
        await new Promise((resolve) => page.once('popup', resolve))
        const pages = await browser.pages()
        await page.goto(pages.slice(-1)[0].url())
      }
      await page.waitForSelector(baseSelector).catch((err) => {
        console.log(err, '4')
      })
      const _html = await page.content()
      const urlsWithKey = this.formatParam(
        _html,
        baseSelector,
        maxLength,
        data,
        baseUrl,
        k
      )
      urlsWithKeys.push(urlsWithKey)
    }
    const flattenArr = compose(
      filterObjWithInvalidVal,
      flatten
    )(urlsWithKeys)
    this.fetchArticleDetail(
      flattenArr,
      'searchResList',
      'searchArticleDetailList'
    )
  }
// 获取热门文章
  async fetchHotArticle() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    let urlsWithKeys = []
    for (let [k, v] of hotMap.entries()) {
      const { baseUrl, maxLength, baseSelector, data, cssSource} = v
      const cssLink = `<link href="${cssSource}" rel="stylesheet">`
      const htmlContent = fs.readFileSync(srcHtml, 'utf-8').replace(/<title>/, ($1) => {
          return cssLink + $1
        })
      fs.writeFile(srcHtml, htmlContent,'utf-8')
      page.goto(baseUrl)
      await page.waitForSelector(baseSelector).catch((err) => {
        console.log(err, `hot baseselector timeout`)
      })
      const _html = await page.content()
      const urlsWithKey = this.formatParam(
        _html,
        baseSelector,
        maxLength,
        data,
        baseUrl,
        k,
        'hotResList'
      )
      urlsWithKeys.push(urlsWithKey)
    }
    const flattenArr = compose(
      filterObjWithInvalidVal,
      flatten
    )(urlsWithKeys)
    this.fetchArticleDetail(flattenArr, 'hotResList', 'hotArticleDetailList')
  }

  /**
   * 获取首页列表数据前格式化参数
   * @param {string} _html 爬取页面的html
   * @param {string} baseSelector 父级选择器
   * @param {number} maxLength 最大爬取数量
   * @param {object} data 爬去的数据
   * @param {string} baseUrl 网站地址
   * @param {string} k 网站源
   * @param {string} listName 列表名称
   */

  formatParam(
    _html,
    baseSelector,
    maxLength,
    data,
    baseUrl,
    k,
    listName
  ) {
    const $ = cheerio.load(_html, {
      decodeEntities: false,
    })
    const rootElement = $(baseSelector)
    const articleLength = rootElement.children().length
    const listCount = articleLength < maxLength ? articleLength : maxLength
    let urlsWithKey = this.generateList(
      listCount,
      data,
      rootElement,
      baseUrl,
      k,
      listName
    )
    return urlsWithKey
  }

  // @functionType(type.IgenerateList)
  /**
   * 写入列表数据
   * @param {number} count 最大列表长度
   * @param {object} data 需要爬的数据
   * @param {node} rootElement 根元素
   * @param {string} baseUrl 页面父级地址
   * @param {string} 网站源
   * @param {string} listName 列表名称 写入数据库
   */
  generateList(count, data, rootElement, baseUrl, k, listName) {
    const resList = Array.from({ length: count }).map((item, index) => {
      const id = genID()
      let content = { source: sourceMap[k], id }
      for (let k in data) {
        const { selector, baseUrl: _baseUrl = '' } = data[k]
        if (k !== 'url') {
          content[k] = rootElement
            .find(selector)
            .eq(index)
            .text()
        } else {
          const url = rootElement
            .find(selector)
            .eq(index)
            .attr('href')
          const rootUrl = _baseUrl ? _baseUrl : baseUrl
          content[k] = url
            ? `${rootUrl.slice(0, baseUrl.length - 1)}${url}`
            : undefined
        }
      }
      return {
        url: content.url,
        k,
        id,
        author: content.author,
        title: content.title,
        time: content.time,
      }
    })
    const validResList = filterObjWithInvalidVal(resList)
    db.set(listName, validResList).write()
    return filterObjWithInvalidVal(validResList)
  }
/**
 * 获取文章详情
 * @param {object} data 爬取详情需要的数据
 * @param {string} listName 首页列表名称
 * @param {string} detailListName 详情列表
 */
  async fetchArticleDetail(data, listName, detailListName) {
    console.log('eash','3')
    db.set(detailListName, []).write()
    const browser = await puppeteer.launch({ headless: true })
    const abstractLength = 250
    for (let [index, item] of Object.entries(data)) {
      const { url, k, id, author, title,className } = item
      const detail = { source: sourceMap[k], id, author, title }
      const {
        data: { detail: detailConfig },
      } = baseConfigMap.get(k)
      const page = await browser.newPage()
      await page.goto(url).catch((err) => {
        console.log(err, '页面跳转失败')
      })
      const { baseSelector: detailBaseSelector } = detailConfig
      await page
        .waitForSelector(detailBaseSelector, { visible: true })
        .catch((err) => {
          console.log(err, 'fetch1 err')
        })
      const content = await page.content().catch((err) => {
        console.log(err, 'fetch2 err')
      })
      const $ = cheerio.load(content, {
        decodeEntities: false,
      })
      const rootElement = $(detailBaseSelector)
      const _detailConfig = { ...detailConfig }
      delete _detailConfig.baseSelector
      for (let [k, v] of Object.entries(_detailConfig)) {
        if (!rootElement.find(v.selector).html()) {
          continue
        }
        detail[k] = rootElement.find(v.selector).html()
      }
      const { content: _content } = detail
      const abstract = `${_content.substring(0, abstractLength)}...`
      db.set(`${listName}[${index}].detail`, abstract).write()
      db.get(detailListName)
        .push({ content: _content, id, author, title,className })
        .write()
    }
  }
}
// npm run node s @keywords _node
// 根据命令行参数执行对应的命令
const operationMap = {
  s: 'search',
  h: 'fetchHot',
}
let argArr = [...process.argv]
const operation = operationMap[argArr[2]]
const optionsKeyArr = argArr.filter((item) => item.startsWith('@'))
const optionsValArr = argArr.filter((item) => item.startsWith('_'))
let options = {}
for (let [k, v] of Object.entries(optionsKeyArr)) {
  const key = v.replace('@', '')
  options[key] = optionsValArr[k].replace('_', '')
}
const spider = new Spider(operation, options)
spider.start()
