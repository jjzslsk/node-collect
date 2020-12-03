const axios = require('axios');
const querystring = require('querystring');
const request = require('request')
const fs = require('fs');
const url = require('url')
const path = require('path');
const { resolve } = require('path');

//文件读取
function fsRead(path){
  return new Promise((resolve, reject) => {
    fs.readFile(path,{flag:'r',encoding:'utf-8'},function(err,data){
      if(err){
        console.log('读取失败')
        reject(err)
      }else{
        console.log('读取成功')
        resolve(data)
      }
    })
  });
}

//异步写入，追加 (换行)
function fsWrite(path,content){
  return new Promise((resolve, reject) => {
    fs.writeFile(path,content,{flag:'a',encoding:'utf-8'},function(err,data){
      if(err){
        console.log('写入失败')
        reject(err)
      }else{
        console.log('写入成功')
        resolve(data)
      }
    })
  });
}

//创建目录
function fsDir(path){
  return new Promise ((resolve,reject)=>{
    fs.mkdir(path,function(err){
      if(err){
        reject(err)
      }else{
        resolve('成功创建目录')
      }
    })
  })
}

//获取页面数据
function requestGet (url = '',param = ''){
  return new Promise(function (resolve, reject) {
    request.get(url,param,function(err,response,body){
      if(err){
        resolve({response,body})
      }else{
        reject(err)
      }
    })
  });
}

//延迟函数
function lcWait(timeout){
  return new Promise ((resolve,reject) =>{
    setTimeout(() => {
      console.log('执行延迟函数')
      resolve('执行延迟函数,延迟：',timeout)
    }, timeout);
  })
}

module.exports = {requestGet,fsDir,fsWrite,fsRead,lcWait}




// 测试方法 ---------------------------------------------------------
async function spider(){
  //获取所有页面总页数
  let allPageNum = await getNum()
  for (let index = 0; index <= allPageNum.length; index++) {
    await lcWait(4000*index)
    getListPage(index)
  }
}

//读取列表
async function getListPage(pageNum){
  let httpUrl = 'http://www.qwe.com/list?page=' + pageNum
  let res = await axios.get(httpUrl)
  // cheerio解析html文档
  let $ = cheerio.load(res.data)
  $('#home a').each(async (i,element)=>{
    let href = $(element).attr('href')
    let title = $(element).find('.title').text()
    //创建目录
    fsDir()
    await lcWait(50*i)
    parsePage(href,title)
  })
}

//获取每个页面数据
async function parsePage(imgUrl,title){
  let res  = await axios.get(imgUrl)
   let $ = cheerio.load(res.data)
   $('#post_content p img').each(async (i,item)=>{
       let src = $(item).attr('src')
      let extName = path.extname(`${src}`)
      //图片写入的路径和名字
      await lcWait(50)
      let webPath = `img/${title}-${i}${extName}`
       let ws = fs.createWriteStream(webPath)
       axios.get(src,{responseType:'stream'}).then(res=>{
          res.data.pipe(ws)
          console.log('加载中',webPath)
          res.data.on('close',function(){
              ws.close()
              console.log('加载完成')
          })
       })
   })
}

// spider()
// end----------------------------------------------------------