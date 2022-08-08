const fs = require('fs');
const path = require('path');
const { compilation } = require("webpack");
const SingleEntryPlugin=require('webpack/lib/SingleEntryPlugin')

let childCompilationObj
module.exports = class SwPlugin {
  constructor() {
    this.options = {
      entry: path.join(__dirname, '../src/client/scripts/sw.js'),
      filename:'sw.js'
    };
  }
  handleMake(compilation, compiler) {
    const childCompiler = compilation.createChildCompiler('sw-plugin', {
      filename: this.options.filename,
    });

    const childEntryCompiler = new SingleEntryPlugin(
      compiler.context,
      this.options.entry
    );
    childEntryCompiler.apply(childCompiler);
  //  此阶段拿不到fileDependencies😓😓
    childCompiler.runAsChild((err,childCompilation)=>{
    //  childCompilationObj=Array.from(childCompilation.fileDependencies)
    })
    // Fix for "Uncaught TypeError: __webpack_require__(...) is not a function"
    // Hot module replacement requires that every child compiler has its own
    // cache. @see https://github.com/ampedandwired/html-webpack-plugin/pull/179
    childCompiler.hooks.compilation.tap(
      'sw-plugin-compilation',
      (compilation2) => {
        if (compilation2.cache) {
          if (!compilation2.cache['sw-plugin']) {
            compilation2.cache['sw-plugin'] = {};
          }
          compilation2.cache = compilation2.cache['sw-plugin'];
        }
      }
    );

    // Compile and return a promise.
    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync('sw-plugin-make', (compilation, callback) => {
      // if (this.warnings.length) {
      //   const array = []
      //   array.push.apply(compilation.warnings, this.warnings)
      // }

      this.handleMake(compilation, compiler)
        .then(() => {
          callback();
        })
        .catch(() => {
          callback(new Error('Something went wrong during the make event.'));
        });
    });
    compiler.hooks.afterCompile.tap('change-file-dependency',(compilation,callback)=>{
      // compilation.fileDependencies=compilation.fileDependencies.concat(childCompilationObj)
      // console.log(compilation.fileDependencies.constructor,999)
      compilation.fileDependencies.add(this.options.entry)
      // callback()
    })
    // 这个阶段拿不到filedependencies
    compiler.hooks.watchRun.tapAsync('watch-run',(watching,cb)=>{
      const changedFiles = watching.watchFileSystem.watcher.mtimes;
      console.log(9,Object.keys(changedFiles))
      cb()
    })
    compiler.hooks.emit.tapAsync('emit', (compilation, cb) => {
      let source = compilation.assets[this.options.filename].source().toString();
      // console.log(assetsList, 99);
      delete compilation.assets[this.options.filename]
      let assetsList = Object.keys(compilation.assets);
      const excludeReg=/\.(map|hot-update\.json)$/
      const listReg = /(cacheList\s*=)\s*\[.*\]/;
      
      assetsList=assetsList.filter(path=>!excludeReg.test(path))
      source = source.replace(listReg, ($1,$2)=>$2+JSON.stringify(assetsList));
      compilation.assets[this.options.filename] = {
        source: () => source,
        size: () => source.length,
      };
      fs.writeFileSync('test.js',source)
      cb();
    });
  }
};
