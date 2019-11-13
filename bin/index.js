#!/usr/bin/env node

const fs = require('fs-extra')
const process = require('process')
const path = require('path')
const shelljs = require('shelljs')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const axios = require('axios')
const async = require('async')
const { Readable } = require('stream')
const db = require(path.resolve(__dirname, './db/index.js'))
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
  omit,
  filterHtmlTag
} = require(path.resolve(__dirname, './util/index.js'))
// 错误记录
const { ErrorLog } = require(path.resolve(__dirname, './log/index.js'))

const srcHtml = path.resolve(__dirname, '../src/index.tpl.html')

class Spider {
  /**
   *
   * @param {*} operation 可选值: search hot
   * @param {*} options keywords|...
   */
  constructor(operation, options = { keywords: 'node' }) {
    this.operation = operation
    this.options = options
  }
  start() {
    this[this.operation](this.options)
    this.ErrorLog = new ErrorLog()
    if (this.operation.startsWith('search')) {
      db.set('searchResList', [])
      db.set('searchArticleDetailLis', [])
    }
  }

  cleanDb() {
    fs.truncateSync(path.resolve(__dirname, './db.json'), 0, function() {
      console.log('unset db')
    })
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
    for (let [k, v] of searchMap.entries()) {
      const {
        baseUrl,
        searchInput,
        searchBtn,
        baseSelector,
        maxLength,
        data,
        isNewTab
      } = v
      await page.goto(baseUrl)
      await page.type(searchInput, keywords, { delay: 100 }).catch((err) => {
        this.ErrorLog.push(err, { searchInput }, '搜索关键字失败')
      })

      await page.click(searchBtn).catch((err) => {
        this.ErrorLog.push(err, { searchBtn }, '点击搜索按钮失败')
      })
      if (isNewTab) {
        await new Promise((resolve) => page.once('popup', resolve))
        const pages = await browser.pages()
        await page.goto(pages.slice(-1)[0].url())
      }
      await page.waitForSelector(baseSelector).catch((err) => {
        this.ErrorLog.push(err, { baseSelector }, '等待搜索列表父级元素失败')
      })
      const _html = await page.content()
      const urlsWithKey = this.formatParam(
        _html,
        baseSelector,
        maxLength,
        data,
        baseUrl,
        k,
        'searchResList'
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
      const { baseUrl, maxLength, baseSelector, data, cssSource } = v
      const cssLink = `<link href="${cssSource}" rel="stylesheet">`
      const htmlContent = fs.readFileSync(srcHtml, 'utf-8')
      if (!htmlContent.includes(cssLink)) {
        const htmlContentWithCss = htmlContent.replace(/<title>/, ($1) => {
          return cssLink + $1
        })
        fs.writeFile(srcHtml, htmlContentWithCss, 'utf-8')
      }
      await page.goto(baseUrl).catch((err) => {
        this.ErrorLog.push(err, { baseUrl }, '跳转热门页面失败')
      })
      await page.waitForSelector(baseSelector).catch((err) => {
        this.ErrorLog.push(err, { baseSelector }, '等待热门页面父级元素失败')
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

  formatParam(_html, baseSelector, maxLength, data, baseUrl, k, listName) {
    const $ = cheerio.load(_html, {
      decodeEntities: false
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
      const _data = omit(['baseClassName', 'baseSelectorToGetClassName'], data)
      const {
        baseClassName = 'empty',
        baseSelectorToGetClassName = 'empty'
      } = data
      for (let k in _data) {
        const { selector, baseUrl: _baseUrl = '' } = _data[k]
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
        baseClassName,
        baseSelectorToGetClassName
      }
    })
    const validResList = filterObjWithInvalidVal(resList)
    db.set(listName, [...db.get(listName), ...validResList]).write()
    return validResList
  }
  /**
   * 设置code标签的classname
   * @param {string} content
   */
  setCodeClass(content) {
    const reg01 = /(<code(\s+)class=('|")[\s\S]+?)(?=('|"))/g
    const reg02 = /(<[^\/]*?class=('|"))[\s\S]+?"[\s\S]*?(?=>复制代码)/g
    if (content.match(reg01) && content.match(reg02)) {
      let index = 0
      content = content.replace(reg01, ($1) => {
        const classname = ` code-0${index++}`
        return $1 + classname
      })
      content = content.replace(reg02, ($1) => {
        const classname = `n copy-0${index++}"`
        return $1.substr(0, $1.length - 2) + classname
      })
    }
    return content
  }
  /**
   * 请求图片地址爬取图片
   * @param {string} _html
   */
  async fetchArticleImg(_html) {
    const reg = /(?<=data-src=")[\s\S]+?(?=")/g
    let urls = _html.match(reg)
    for (let i = urls.length; i > 0; i -= 5) {
      const limit = Math.min(5, i)
      await async.mapLimit(urls, limit, async (url) => {
        const res = await axios
          .get(url, { headers: { responseType: 'stream' } })
          .catch((err) => {
            this.ErrorLog.push(err, { url }, '获取详情页图片失败')
          })
        let suffix = res.headers && res.headers['content-type']
        suffix = suffix.split('/').pop()
        suffix = suffix.includes('webp') ? '' : `.${suffix}`
        const file = fs.createWriteStream(
          path.resolve(__dirname, './db/image/' + Date.now() + suffix),
          { encoding: 'binary' }
        )
        const inStream = new Readable()
        inStream.push(res.data)
        inStream.push(null)
        inStream.pipe(file)
      })
    }
  }
  /**
   * 获取文章详情
   * @param {object} data 爬取详情需要的数据
   * @param {string} listName 首页列表名称
   * @param {string} detailListName 详情列表
   */
  async fetchArticleDetail(data, listName, detailListName) {
    const browser = await puppeteer.launch({ headless: true })
    const abstractLength = 250
    for (let [index, item] of Object.entries(data)) {
      const {
        url,
        k,
        id,
        author,
        title,
        baseClassName,
        baseSelectorToGetClassName
      } = item
      const detail = { source: sourceMap[k], id, author, title }
      const {
        data: { detail: detailConfig }
      } = baseConfigMap.get(k)
      const page = await browser.newPage()
      await page.goto(url).catch((err) => {
        this.ErrorLog.push(err, { url }, '文章详情页面跳转失败')
      })
      const { baseSelector: detailBaseSelector } = detailConfig
      await page
        .waitForSelector(detailBaseSelector, { visible: true })
        .catch((err) => {
          this.ErrorLog.push(
            err,
            { detailBaseSelector },
            '等待详情页面父级元素失败'
          )
        })
      const content = await page.content().catch((err) => {
        this.ErrorLog.push(err, { url }, '获取详情页面内容失败')
      })
      const $ = cheerio.load(content, {
        decodeEntities: false
      })
      // Todo 爬取图片无法打卡
      // await this.fetchArticleImg(content)
      const rootElement = $(detailBaseSelector)
      const _baseClassName =
        baseClassName !== 'empty'
          ? baseClassName
          : rootElement.find(baseSelectorToGetClassName) &&
            rootElement.find(baseSelectorToGetClassName).attr('class')
      const _detailConfig = { ...detailConfig }
      delete _detailConfig.baseSelector
      for (let [k, v] of Object.entries(_detailConfig)) {
        if (!rootElement.find(v.selector).html()) {
          continue
        }
        detail[k] = rootElement.find(v.selector).html()
      }
      const { content: _content } = detail
      const abstract = `${filterHtmlTag(_content).substring(
        0,
        abstractLength
      )}...`
      db.set(`${listName}[${index}].detail`, abstract).write()
      const detailContent = this.setCodeClass(_content)
      db.get(detailListName)
        .push({
          content: detailContent,
          id,
          author,
          title,
          baseClassName: _baseClassName
        })
        .write()
    }
    this.endExec()
  }
  // 执行脚本完毕
  endExec() {
    this.ErrorLog.end()
    if (process.send) {
      process.send('end')
    }
    process.exit(0)
  }
}

// node './bin/index.js' s @keywords _node
// 根据命令行参数执行对应的命令
(function getArgStart() {
  const operationMap = {
    s: 'searchArticle',
    h: 'fetchHotArticle',
    c: 'cleanDb'
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
})()
