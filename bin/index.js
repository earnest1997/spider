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
    db.set('searchResList',[]).write()
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
options[key]=optionsValArr[k].replace('_','')
}
const spider = new Spider(operation,options)
spider.start()


