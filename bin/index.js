#!/usr/bin/env node

const fs = require('fs-extra')
const process = require('process')
const path = require('path')
const shelljs = require('shelljs')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const db = require(path.resolve(__dirname,'./db.js'))
const { searchMap } = require(path.resolve(
  __dirname,
  './config/searchConfig.js'
))
const { baseConfigMap,sourceMap } = require(path.resolve(
  __dirname,
  './config/baseConfig.js'
))
console.log(db,'db')
// tool
const { flatten,genID,filterContent } = require(path.resolve(__dirname,'../src/util/tool.js'))


const { functionType } = require(path.resolve(__dirname, '../src/util/ts.js'))
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
    // this[`${this.operation}Article`](this.options)
    this.searchArticle(this.options)
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
          data,
          isNewTab
        } = v
        await page.goto(baseUrl)
        await page.type(searchInput, keywords, { delay: 100 }).catch((err) => {
          console.log(err, '2')
        })

        await page.click(searchBtn).catch((err) => {
          console.log(err, '3')
        })
        if(isNewTab){
        await new Promise(resolve => page.once('popup', resolve))
        const pages=await browser.pages()
        await page.goto(pages.slice(-1)[0].url())
        }
        await page.waitForSelector(baseSelector).catch((err) => {
          console.log(err, '4')
        })
        const _html = await page.content()
        fs.writeFile(path.resolve(__dirname,'./content.html'),'module.exports'+_html)
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
        this.fetchArticleDetail(flattenArr)
  }
  // @functionType(type.IgenerateChild)
  generateChild(count, data, rootElement, baseUrl, k) {
    db.set('searchResList',[])
    const searchResList= Array.from({ length: count }).map((item, index) => {
      const id=genID()
      let content = { source: sourceMap[k],id }
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
      db.get('searchResList').push(content)
    .write()
      return { url: content.url, k,id,author:content.author,title:content.title }
    })
   return searchResList
  }

  async fetchArticleDetail(arg) {
    const browser = await puppeteer.launch({ headless: true })
    const abstractLength=250
    for(let [index,item] of Object.entries(arg)){
      const { url, k,id,author,title }=item 
        const detail = { source: sourceMap[k] ,id,author,title}
        const {  data:{detail: detailConfig} } = baseConfigMap.get(k)
        const page = await browser.newPage()
        await page.goto(url).catch(err=>{console.log(err,'页面跳转失败')})
        const { baseSelector: detailBaseSelector } = detailConfig
        const a=await page.content()
        console.log(a,url,'juju')
        await page.waitForSelector(detailBaseSelector,{visible:true}).catch(err=>{console.log(err,'fetch1 err')})
        const content = await page.content().catch(err=>{console.log(err,'fetch2 err')})
        const $ = cheerio.load(content,{
          decodeEntities: false
        })
        const rootElement = $(detailBaseSelector)
        const _detailConfig = { ...detailConfig }
        delete _detailConfig.baseSelector
        for (let [k, v] of Object.entries(_detailConfig)) {
          if(!rootElement.find(v.selector).html()){
            console.log(v,'v')
            continue
          }
          detail[k] = filterContent(rootElement.find(v.selector).html())
        }
        const abstract=`${detail.content.substring(0,abstractLength)}...`
        db.set(`searchResList[${index}].detail`,abstract).write()
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
// npm run node s @keywords _node
const operationMap={
  s:"search",
  h:"hot"
}
let argArr=[...process.argv]
const operation=operationMap[argArr[2]]
const optionsKeyArr=argArr.filter(item=>item.startsWith('@'))
const optionsValArr=argArr.filter(item=>item.startsWith('_'))
let options={}
for(let [k,v] of Object.entries(optionsKeyArr)){
  const key=v.replace('@','')
  console.log(key,k,'bhbh')
options[key]=optionsValArr[k].replace('_','')
}
console.log(options,'op')
const spider = new Spider(operation,options)
spider.start()


