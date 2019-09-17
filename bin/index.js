#!/usr/bin/env node

const URL = require('url')
const fs = require('fs-extra')
const process = require('process')
const path = require('path')
const shelljs = require('shelljs')
const cheerio = require('cheerio')
const axios = require('axios')
const puppeteer = require('puppeteer-core')
/**
 *
 * @param {*} url
 * @param {*} storePath store path
 */
class Spider {
  constructor(url, storePath, keywords) {
    this.url = url
    this.storePath = storePath
    this.keywords = keywords
    this.entry()
  }
  entry() {
    this.ceateReq()
    this.crawl()
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
  const browser=await puppeteer.launch({headless:true})
  const jianshuSearch= new Promise(async(resolve,reject)=>{
  const page=await browser.newPage()
  await page.goto('https://www.jianshu.com/')
  await page.focus('.search-input')
  await page.type(this.keywords,{delay:100}) //输入变慢像一个用户
  await page.click('.search-btn')
  try{
  const waitForElement=await page.waitForSelector(".note-list")
  const resultCount=waitForElement.length
  const crawlCount=resultCount>=4?4:resultCount
  Array.from({length:crawlCount}).map(async(item,index)=>{
   const author=await page.$eval(`.note-list>li:nth-child[${index}] .nickname`,el=>el.innerHTML)
  const time=await page.$eval(`.note-list>li:nth-child[${index}] .time`,el=>el.innerHTML)
  const title=await page.$eval(`.note-list>li:nth-child[${index}] .title`,el=>el.innerHTML)
  const description=await page.$eval(`.note-list>li:nth-child[${index}] .abstract`,el=>el.innerHTML)
  const url=await page.$eval(`.note-list>li:nth-child[${index}] .title`,el=>el.href)
  resolve({author,time,title,description,url})
  })
  }
  catch(err){
    console.log(err,'获取页面元素失败')
    reject('获取页面元素失败')
  }
})
const juejinSearch=new Promise(async(resolve,reject)=>{
  const page=await browser.newPage()
  await page.goto('https://juejin.im/')
  await page.focus('.search-input')
  await page.type(this.keywords,{delay:100}) //输入变慢像一个用户
  await page.click('.search-icon')
  const waitForElement=await page.waitForSelector(".main-list")
  const resultCount=waitForElement.item(0).length
  const childArr=Array.from(waitForElement.item(0).childNodes).filter(item=>item.innerHTML.test(/class="entry"/))

  const crawlCount=resultCount>=4?4:resultCount
childArr.length=crawlCount
  childArr.map(async(item,index)=>{
    const author=await page.$eval(`.main-list>li:nth-child[${index}] .nickname`,el=>el.innerHTML)
   const time=await page.$eval(`.main-list>li:nth-child[${index}] .time`,el=>el.innerHTML)
   const title=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.innerHTML)
   const description=await page.$eval(`.main-list>li:nth-child[${index}] .abstract`,el=>el.innerHTML)
   const url=await page.$eval(`.main-list>li:nth-child[${index}] .title`,el=>el.href)
   resolve({author,time,title,description,url})
   })
})

  }

  async crawl() {
    const data =await axios.get('https://www.jianshu.com')
    console.log(data.data,8)
    fs.writeFileSync(path.resolve(__dirname,'./content.js'),"module.exports="+JSON.stringify(data.data), 'utf-8'); 
    // const $ = cheerio.load(data)
    // const content = fs
    //   .readFileSync(path.resolve(__dirname, 'content.js'), 'utf-8')
    //   .toString()
    // console.log(_html)
  }
}

new Spider('https://jianshu.com/').crawl()

