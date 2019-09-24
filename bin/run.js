const process=require('child_process')

setInterval(()=>{
process.exec('node ./index.js')
},24*60*60*2)