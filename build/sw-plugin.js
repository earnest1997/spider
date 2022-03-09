const fs=require('fs')
const path=require('path')

module.exports = class SwPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      let assetsList = Object.keys(compilation.assets)
      // let source = compilation.assets['sw.js'].source().toString();
      console.log(assetsList,99)
      
      const swFilePath=path.resolve(__dirname,'../src/client/scripts/sw.js')
      fs.readFile(swFilePath,'utf-8',function(err,data){
        assetsList=assetsList.filter(item=>!item.endsWith('sw.js'))
        const keyReg = /(cacheKey\s*=\s*)'\w+?'/;
        const listReg = /(cacheList\s*=)\s*\[.*\]/;
        const newCacheKey = Date.now().toString();
        data = data.replace(keyReg, ($1,$2)=>$2+`'${newCacheKey}'`);
        data = data.replace(listReg, ($1,$2)=>$2+JSON.stringify(assetsList));
        fs.writeFile(path.join(__dirname, '../dist/sw.js'),data,function(err){
          if(!err)
          fs.writeFileSync('test.js',data)
            console.log("写入sw.js成功！")
            
        })
      })
      cb();
    });
  }
};
