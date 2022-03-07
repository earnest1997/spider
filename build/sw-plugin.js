const fs=require('fs')

module.exports = class SwPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      let assetsList = Object.keys(compilation.assets)
      console.log(assetsList,99)
      let source = compilation.assets['sw.js'].source().toString();
      assetsList=assetsList.filter(item=>!item.endsWith('sw.js'))
      // const prefix = 'http://localhost:3001'
      // .map((src) =>
      //   src.startsWith('.') ? src.replace(/^\./, prefix) : `${prefix}/${src}`
      // ).filter(item=>!item.endsWith('sw.js'));
      const keyReg = /(cacheKey\s*=\s*)'\w+?'/;
      const listReg = /(cacheList\s*=)\s*\[.*\]/;
      const newCacheKey = Date.now().toString();
      source = source.replace(keyReg, ($1,$2)=>$2+`'${newCacheKey}'`);
      source = source.replace(listReg, ($1,$2)=>$2+JSON.stringify(assetsList));
      compilation.assets['sw.js'] = {
        source: () => source,
        size: () => source.length,
      };
      fs.writeFileSync('test.js',source)
      cb();
    });
  }
};
