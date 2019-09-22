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

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapters = new FileSync(path.resolve(__dirname, './db.json'))
const db = low(adapters)

db.defaults({hotArticleList:[],articleDetail:[],searchList:[]}).write()

const { classType, functionType } = require(path.resolve(
  __dirname,
  '../util/ts.js'
))
/**
 *
 * @param {*} operation 可选值: search hot
 * @param {*} options keywords|...
 */

const options = {
  keywords: 'string'
}

class Spider {
  constructor(operation, options = { keywords: 'node' }) {
    this.operation = operation
    this.options = options
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
    for (let [k, v] of searchMap.entries()) {
      const {
        baseUrl,
        searchInput,
        searchBtn,
        baseSelector,
        maxLength,
        data
      } = v
      try {
        await page.goto(baseUrl)
        await page.type(searchInput, keywords, { delay: 100 }).catch((err) => {
          console.log(err, '2')
        })
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
        this.generateChild(listCount, data, rootElement, baseUrl, k)
      } catch (err) {
        console.log(err, '搜索失败')
      }
    }
  }
  // @functionType()
  generateChild(count, data, rootElement, baseUrl, k) {
    Array.from({ length: count }).forEach((item, index) => {
      let content = { id: k }
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
    })
  }

  async hotArticle() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    for (let [k, v] of Object.entries(searchMap)) {
      const { baseUrl } = v
      try {
        await page.goto(baseUrl)
        const _html = await page.content()
        const $ = cheerio.load(_html)
      } catch (error) {
        console.log(error, '获取文章列表失败')
      }
    }
  }

  // async searchArticle() {
  //   const browser = await puppeteer.launch({ headless: true })
  //   this.jianshuSearch(browser)
  //   // this.juejinSearch(browser)
  // }
  async jianshuSearch(browser) {
    const page = await browser.newPage()
    try {
      await page.goto('https://www.jianshu.com/')
      await page.type('.search-input', this.keywords, { delay: 100 }) //输入变慢像一个用户
      await page.click('.search-btn')
      console.log(9990)
      const waitForElement = await page.waitForSelector('.note-list')
      const resultCount = waitForElement.length
      const crawlCount = resultCount >= 4 ? 4 : resultCount
      Array.from({ length: crawlCount }).map(async (item, index) => {
        try {
          const author = await page.$eval(
            `.note-list>li:nth-child[${index}] .nickname`,
            (el) => el.innerHTML
          )
          const time = await page.$eval(
            `.note-list>li:nth-child[${index}] .time`,
            (el) => el.innerHTML
          )
          const title = await page.$eval(
            `.note-list>li:nth-child[${index}] .title`,
            (el) => el.innerHTML
          )
          const description = await page.$eval(
            `.note-list>li:nth-child[${index}] .abstract`,
            (el) => el.innerHTML
          )
          const url = await page.$eval(
            `.note-list>li:nth-child[${index}] .title`,
            (el) => el.href
          )

          return { author, time, title, description, url }
        } catch (err) {}
      })
    } catch (err) {
      console.log(err, '获取页面元素失败')
    }
  }
  async juejinSearch(browser) {
    console.log(9990)
    try {
      const page = await browser.newPage()
      await page.goto('https://juejin.im/')
      await page.focus('.search-input')
      await page.type(this.keywords, { delay: 100 }) //输入变慢像一个用户
      await page.click('.search-icon')
      const waitForElement = await page.waitForSelector('.main-list')
      const resultCount = waitForElement.item(0).childNodes.length
      const childArr = Array.from({ length: resultCount }).filter((item) =>
        item.innerHTML.test(/class="entry"/)
      )
      console.log(childArr)
      //   const crawlCount=resultCount>=4?4:resultCount
      // childArr.length=crawlCount
      //   childArr.map(async(item,index)=>{
      //     const author=await page.$eval(`.main-list>li:nth-child[${index}] .nickname`,el=>el.innerHTML)
      //    const time=await page.$eval(`.main-list>li:nth-child[${index}] .time`,el=>el.innerHTML)
      //    const title=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.innerHTML)
      //    const description=await page.$eval(`.main-list>li:nth-child[${index}] .abstract`,el=>el.innerHTML)
      //    const url=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.href)
      //    return ({author,time,title,description,url})
    } catch (err) {
      console.log(err, 999)
    }

    // return await Promise.all([juejinSearch,jianshuSearch])
  }

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

// const _Spider=classType(options,Spider)
const spider = new Spider('search')
spider.start()

module.exports = { db }
