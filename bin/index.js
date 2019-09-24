#!/usr/bin/env node

const URL = require('url')
const fs = require('fs-extra')
const process = require('process')
const path = require('path')
const shelljs = require('shelljs')
const cheerio = require('cheerio')
const axios = require('axios')
const puppeteer = require('puppeteer')
const { searchMap } = require(path.resolve(
  __dirname,
  './config/searchConfig.js'
))
const { baseConfigMap } = require(path.resolve(
  __dirname,
  './config/baseConfig.js'
))
// db
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapters = new FileSync(path.resolve(__dirname, './db.json'))
const db = low(adapters)
// tool
const { flatten,genID } = require(path.resolve(__dirname,'../util/tool'))

db.defaults({ hotArticleList: [], articleDetail: [], searchList: [] }).write()

const { functionType } = require(path.resolve(__dirname, '../util/ts.js'))
const type = require('./type.js')
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
    this[`${this.operation}Article`](this.options)
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

  async searchArticle() {
    const { keywords } = this.options
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    let urlsWithKeys=[]
  for(let [k, v] of searchMap.entries()){
        const {
          baseUrl,
          searchInput,
          searchBtn,
          baseSelector,
          maxLength,
          data
        } = v
        await page.goto(baseUrl)
        await page.type(searchInput, keywords, { delay: 100 }).catch((err) => {
          console.log(err, '2')
        })
        console.log(baseUrl,88999)
        await page.click(searchBtn).catch((err) => {
          console.log(err, '3')
        })
        await page.waitForSelector(baseSelector).catch((err) => {
          console.log(err, '4')
        })
        const _html = await page.content()
        const $ = cheerio.load(_html, {
          decodeEntities: false
        })
        const rootElement = $(baseSelector)
        const articleLength = rootElement.length
        const listCount = articleLength < maxLength ? articleLength : maxLength
        const urlsWithKey = this.generateChild(
          listCount,
          data,
          rootElement,
          baseUrl,
          k
        )
        urlsWithKeys.push(urlsWithKey)
      }
        const flattenArr= flatten(urlsWithKeys)
        console.log(flattenArr,8899)
        this.fetchArticleDetail(flattenArr)
  }
  // @functionType(type.IgenerateChild)
  generateChild(count, data, rootElement, baseUrl, k) {
    return Array.from({ length: count }).map((item, index) => {
      const id=genID()
      let content = { source: k,id }
      for (let k in data) {
        const { selector } = data[k]
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
          content[k] = `${baseUrl.slice(0, baseUrl.length - 1)}${url}`
        }
      }
      db.get('hotArticleList')
        .push(content)
        .write()
      return { url: content.url, k,id,author:content.author,title:content.title }
    })
  }

  async fetchArticleDetail(arg) {
    const browser = await puppeteer.launch({ headless: true })
    for(let item of arg){
      const { url, k,id,author,title }=item 
        const detail = { source: k ,id,author,title}
        const {  data:{detail: detailConfig} } = baseConfigMap.get(k)
        const page = await browser.newPage()
        page.goto(url)
        const { baseSelector: detailBaseSelector } = detailConfig
        await page.waitForSelector(detailBaseSelector).catch(err=>{console.log(err,'fetch1 err')})
        const content = await page.content().catch(err=>{console.log(err,'fetch2 err')})
        const $ = cheerio.load(content,{
          decodeEntities: false
        })
        const rootElement = $(detailBaseSelector)
        const _detailConfig = { ...detailConfig }
        delete _detailConfig.baseSelector
        for (let [k, v] of Object.entries(_detailConfig)) {
          detail[k] = rootElement.find(v.selector).html()
        }
        db.get('articleDetail')
          .push(detail)
          .write()
    }
  }


  // async fetchHotest


  // async searchArticle() {
  //   const browser = await puppeteer.launch({ headless: true })
  //   this.jianshuSearch(browser)
  //   // this.juejinSearch(browser)
  // }
  // async jianshuSearch(browser) {
  //   const page = await browser.newPage()
  //   try {
  //     await page.goto('https://www.jianshu.com/')
  //     await page.type('.search-input', this.keywords, { delay: 100 }) //输入变慢像一个用户
  //     await page.click('.search-btn')
  //     console.log(9990)
  //     const waitForElement = await page.waitForSelector('.note-list')
  //     const resultCount = waitForElement.length
  //     const crawlCount = resultCount >= 4 ? 4 : resultCount
  //     Array.from({ length: crawlCount }).map(async (item, index) => {
  //       try {
  //         const author = await page.$eval(
  //           `.note-list>li:nth-child[${index}] .nickname`,
  //           (el) => el.innerHTML
  //         )
  //         const time = await page.$eval(
  //           `.note-list>li:nth-child[${index}] .time`,
  //           (el) => el.innerHTML
  //         )
  //         const title = await page.$eval(
  //           `.note-list>li:nth-child[${index}] .title`,
  //           (el) => el.innerHTML
  //         )
  //         const description = await page.$eval(
  //           `.note-list>li:nth-child[${index}] .abstract`,
  //           (el) => el.innerHTML
  //         )
  //         const url = await page.$eval(
  //           `.note-list>li:nth-child[${index}] .title`,
  //           (el) => el.href
  //         )

  //         return { author, time, title, description, url }
  //       } catch (err) {
  //         console
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err, '获取页面元素失败')
  //   }
  // }
  // async juejinSearch(browser) {
  //   console.log(9990)
  //   try {
  //     const page = await browser.newPage()
  //     await page.goto('https://juejin.im/')
  //     await page.focus('.search-input')
  //     await page.type(this.keywords, { delay: 100 }) //输入变慢像一个用户
  //     await page.click('.search-icon')
  //     const waitForElement = await page.waitForSelector('.main-list')
  //     const resultCount = waitForElement.item(0).childNodes.length
  //     const childArr = Array.from({ length: resultCount }).filter((item) =>
  //       item.innerHTML.test(/class="entry"/)
  //     )
  //     console.log(childArr)
  //     //   const crawlCount=resultCount>=4?4:resultCount
  //     // childArr.length=crawlCount
  //     //   childArr.map(async(item,index)=>{
  //     //     const author=await page.$eval(`.main-list>li:nth-child[${index}] .nickname`,el=>el.innerHTML)
  //     //    const time=await page.$eval(`.main-list>li:nth-child[${index}] .time`,el=>el.innerHTML)
  //    const title=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.innerHTML)
  //    const description=await page.$eval(`.main-list>li:nth-child[${index}] .abstract`,el=>el.innerHTML)
  //    const url=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.href)
  //    return ({author,time,title,description,url})
  //   } catch (err) {
  //     console.log(err, 999)
  //   }

  //   // return await Promise.all([juejinSearch,jianshuSearch])
  // }

  // async crawl() {
  //   const data = await axios.get('https://www.jianshu.com')
  //   console.log(data.data, 8)
  //   fs.writeFileSync(
  //     path.resolve(__dirname, './content.js'),
  //     'module.exports=' + JSON.stringify(data.data),
  //     'utf-8'
  //   )
  // const $ = cheerio.load(data)
  // const content = fs
  //   .readFileSync(path.resolve(__dirname, 'content.js'), 'utf-8')
  //   .toString()
  // console.log(_html)
  // }
}

const end=process.argv.length
let argArr=process.argv.slice(2,end-1)
const optionsKeyArr=argArr.filter(item=>item.startsWith('--'))
const optionsValArr=argArr.filter(item=>!item.startsWith('--'))
let options={}
for(let [k,v] of Object.entries(optionsKeyArr)){
  const key=v.replace('-','')
options[key]=optionsValArr[k]
}
const spider = new Spider('search',options)
spider.start()

module.exports = { db }
