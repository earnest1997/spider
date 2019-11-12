const fs = require('fs-extra')
const path = require('path')
const { dateFormat } = require(path.resolve(
  __dirname,
  '../util/index.js'
))
exports.ErrorLog = class {
  constructor() {
    this.logDb = []
  }
  push(error, keywords, description) {
    this.logDb.push({ error, keywords, description })
    return this
  }
  end() {
    let log = {}
    const createTime = dateFormat(Date.now(),'yyyy-MM-dd:hh:mm:ss')
    log.createTime = createTime
    log.errors = this.logDb
    fs.writeJsonSync(path.resolve(__dirname, './error.json'), log)
  }
}
