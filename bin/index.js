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

  async ceateReq() {
  const browser=await puppeteer.launch({headless:true})
  const page=await browser.newPage()
  await page.goto('https://www.jianshu.com/')
  await page.focus('.search-input')
  await page.type(this.keywords,{delay:100}) //输入变慢像一个用户
  await page.click('.search-btn')
  const waitForElement=page.waitForSelector(".note-list")
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

