const cheerio = require('cheerio');
const axios = require('axios');
const request = require('request')
const { default: Axios } = require('axios');
const fs = require('fs');
const url = require('url')
const path = require('path')
const puppeteer = require('puppeteer');
const {requestGet,fsDir,fsWrite,fsRead,lcWait} = require('./tools')


var index_key = 0
var filePath = `dir/${index_key}`
async function getWeb (){
  index_key += 1 
  filePath = `dir/${index_key}`
  fs.mkdirSync(filePath);

  fs.writeFile(`${filePath}/${index_key}.txt`,'', function(err) {
    if(err) {
        return console.log("创建txt失败",err);
    }
    console.log(`创建txt${filePath}/${index_key}.txt`);
});

  console.log(index_key)
  const browser = await puppeteer.launch({headless:true})
  const page = await browser.newPage();

  //监听拦截 #threadlisttableid tbody tr no-b-border xst pagead2.googlesyndication.com  images.nvshenim.info luntanx18.info
  await  page.setRequestInterception(true)
  page.on('request',interceptedRequest=>{
    let urlObj = url.parse(interceptedRequest.url())  
    if(
      urlObj.hostname == 'jo2.host8.info' 
      || urlObj.hostname == 'google-analytics.com' 
      || urlObj.hostname == 'www.luntanx18.info' 
      || urlObj.hostname == 'pagead2.googlesyndication.com'
      || urlObj.hostname == 'googlesyndication.com'
      || urlObj.hostname == 'hn.inspectlet.com'
      || urlObj.hostname == 'images.nvshenim.info'
      || urlObj.hostname == 'images.ailra.space'
      || urlObj.hostname == 'luntanx18.info'
      || urlObj.hostname == 'www.qitian288.xyz'
      || urlObj.hostname == 'qitian288.xyz'
      || urlObj.hostname == 'images.duoduose.info'
      || interceptedRequest.url().endsWith('.png')
      || interceptedRequest.url().endsWith('.jpg')
      || urlObj.hostname.indexOf('google')!=-1

      ){
      interceptedRequest.abort
    }else{
      interceptedRequest.continue()
    }
  })

    //超时处理
    // await page.setDefaultNavigationTimeout(0);

    page.goto(`https://yuanasnn.fun/forum-159-${index_key}.html`, {
    waitUntil: 'load',
        timeout: 0
    });


    await page.waitForSelector('#threadlisttableid tbody tr th .xst',{timeout:120000}).then(res=>{
      res
    }).catch(async err=>{
      console.log('找不到标签')
      await page.waitFor(1000);
      await browser.close();
    })

    page.on('console',function(...args){
      if(args[0]._text.slice(0,6) == 'innerH'){
        let pathSrc = `${args[0]._text.slice(8).replace(",","。")}`
        pathSrc = pathSrc.replace("?","")
        pathSrc = pathSrc.replace("...","")
        // let pathSrc = `${args[0]._text.slice(8).replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"")}`
        fsDir(`./${filePath}/${pathSrc}`)
      }
      if(args[0]._text.slice(0,6) == 'innerA'){
        let urlKey = args[0]._text.slice(8).replace(",","。")
        urlKey = args[0]._text.slice(8).replace("...","")
        // let urlKey = args[0]._text.slice(8).replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"")
        // urlKey = urlKey.replace("html",".html")
        // urlKey = urlKey.replace("https","https://")
        // urlKey = urlKey.replace("xyz",".xyz/")
        fsWrite(`${filePath}/${index_key}.txt`,`${urlKey},`)
      }
      if(args[0]._text.slice(0,6) == 'indexY'){
        // console.log(`${args[0]._text.slice(8)}`)
      }
      if(args[0]._text.slice(0,6) == 'itemSS'){
        // console.log(`${args[0]._text.slice(8)}`)
      }
    })

    await page.$$eval('#threadlisttableid tbody tr th .xst',(element)=>{
      element.forEach((item,index)=>{
        if( //是否排除 
        item.getAttribute('style') != 'font-weight: bold;color: #8F2A90;'
        //红粗字体 注释为 红色也要
        // && item.getAttribute('style') != 'font-weight: bold;color: #EE1B2E;' 
        && item.getAttribute('style') != 'font-weight: bold;'
        && item.getAttribute('style') != 'font-weight: bold;color: #3C9D40;'
        && item.getAttribute('style') != 'font-weight: bold;color: #2B65B7;'
        && item.getAttribute('style') != 'font-weight: bold;color: #EC1282;'
        && item.getAttribute('style') != 'color: #8F2A90;'
        && item.children.length != 1
        ){
          // console.log('https://douodou.xyz/'+ item.getAttribute('href'))
          let title = item.innerHTML
          console.log('innerH：',item.innerHTML)
          console.log('innerA：','https://yuanasnn.fun/'+ item.getAttribute('href'),item.innerHTML)
          console.log('indexY：',index)
          console.log('itemSS：',element.length)
          const webSrcs = 'https://yuanasnn.fun/'+ item.getAttribute('href')
          
        }
      })

    })

    // if(args[0]._text.slice(0,5) == 'zhubo'){
      //   fsWrite('haha.txt',`${args[0]._text.slice(8)}\n`)
      // }

      await setTimeout(async () => {
        await page.waitFor(1000);
        await browser.close();
        ReadList()
        console.log('开始下载图片')
        // getWeb()
      }, 3000);

  console.log('执行完成')
}





//获取详情页数据----------------------------------------------------------------------------------------------------------------
//记步数
var getInfoImgNum = 0
async function getInfoImg(pagePath,filesSrc,newTxtUrlArr){

    const browser = await puppeteer.launch({headless:true,defaultViewport: { width: 600, height: 400 },args: [`--window-size=${600},${400}`],})
    const page = await browser.newPage();

  //监听拦截 #threadlisttableid tbody tr no-b-border xst pagead2.googlesyndication.com  images.nvshenim.info luntanx18.info
  await  page.setRequestInterception(true)
  page.on('request',interceptedRequest=>{
    let urlObj = url.parse(interceptedRequest.url())  
    if(
      urlObj.hostname == 'jo2.host8.info' 
      || urlObj.hostname == 'google-analytics.com' 
      || urlObj.hostname == 'www.luntanx18.info' 
      || urlObj.hostname == 'pagead2.googlesyndication.com'
      || urlObj.hostname == 'googlesyndication.com'
      || urlObj.hostname == 'hn.inspectlet.com'
      || urlObj.hostname == 'images.nvshenim.info'
      || urlObj.hostname == 'images.ailra.space'
      || urlObj.hostname == 'luntanx18.info'
      || urlObj.hostname == 'www.qitian288.xyz'
      || urlObj.hostname == 'qitian288.xyz'
      || urlObj.hostname == 'images.duoduose.info'
      || interceptedRequest.url().endsWith('.png')
      || interceptedRequest.url().endsWith('.jpg')
      || urlObj.hostname.indexOf('google')!=-1

      ){
      //终止请求
      interceptedRequest.abort
    }else{
      //弹出
      interceptedRequest.continue()
    }
  })

  //超时参数
  page.goto(pagePath, {
    waitUntil: 'load',
    timeout: 0
  });

  await page.on('console',function(...args){
    async function fnData (){
      if(args[0]._text.slice(0,6) == 'imgarr'){
          let arrRul = args[0]._text.slice(7).split(",")
          let dataImg = await getArrImg(arrRul,filesSrc)
          console.log(dataImg)
          let starts = await startFn()
          console.log(starts)
          if(index_key == 13){
            process.exit()
            return
          }
          //详情页记步数
          getInfoImgNum = 0
          await getWeb()
      }
    }
    fnData()
  })

    //查找元素
    await page.waitForSelector('.pcb .t_fsz table img',{timeout:120000}).then(res=>{
      res
    }).catch(async err=>{
      console.log('找不到标签',pagePath)
      await page.waitFor(1000);
      await browser.close();
      startFn()
    })

    let elementArrImg1 = await page.$$eval('.pcb .t_fsz table img',(items)=>{
      let arrHref = []
      items.forEach(i=>{
          if(i.getAttribute('file')){
            if(i.getAttribute('file').slice(0,4) == 'http'){
              let fileUrl = i.getAttribute('file')
              if (fileUrl.charAt(fileUrl.length - 1) == "/") fileUrl = fileUrl.substr(0, fileUrl.length - 1); //删除末尾斜杆
              arrHref.push(fileUrl)
            }
          }else{
            if(i.getAttribute('src').slice(0,4) == 'http'){
              let srcUrl = i.getAttribute('src')
              if (srcUrl.charAt(srcUrl.length - 1) == "/") srcUrl = srcUrl.substr(0, srcUrl.length - 1);//删除末尾斜杆
              arrHref.push(srcUrl)
            }
          }
       })
       if(arrHref.length > 0){
        console.log("imgarr:"+ arrHref)
       }
    }).catch((err)=>{
      return `错误1：${err}`
    })

    async function getArrImg(imgs,filesSrc){
      return new Promise(async function (resolve, reject) {
      page.close(); 
      let counter = 0
      imgs.forEach(async (itemSrc,index) => {
        // console.log(index+'index:'+path.basename(`${url.parse(itemSrc).path}`))//path解析后缀
        // let webPath = `dir/${filesSrc}/${url.parse(itemSrc).path}`//url解析后缀
        let webPath = `${filePath}/${filesSrc}/${path.basename(`${url.parse(itemSrc).path}`)}` //文件路径 + path解析后缀
        // console.log(webPath)
        let page = `page${index}`
        page = await browser.newPage();
        page.on('response', async (response) => {
          const matches = /.*\.(jpg|JPG|png|PNG|jpeg|JPEG|svg|gif)$/.exec(response.url()); //注意，URL 后面的大小写
          if (matches && (matches.length === 2)) {
            const extension = matches[1];
            const buffer = await response.buffer();
            await fs.writeFileSync(webPath, buffer, 'base64');
            await page.waitFor(1000);
            await page.close(); 
            counter += 1;
            console.log('完成',"第"+counter,",共:"+imgs.length,response.ok(),response.url())
            if(response.ok() == false){
              // reject('response超时'+itemSrc +',',imgs.length+"张"+filesSrc)
              console.log('错误response:',response)
            }
            if(imgs.length == counter){
              await page.waitFor(1000);
              await browser.close();
              resolve('resolve加载完成：'+imgs.length+"张"+filesSrc)
            }
          }
        });
        await page.goto(itemSrc, {
          waitUntil: 'load',
          timeout: 0
        }).catch(async err=>{
          await page.waitFor(1000);
          await page.close();//关闭页面
          console.log('错误err:',itemSrc,err)
          setTimeout(async (err) => {
            await page.waitFor(1000);
            await browser.close();//关闭浏览器
            resolve('错误1reject:',err,itemSrc)
          }, 120000);
        });
      });
      });
    }
    

    async function startFn(){
      return new Promise((resolve, reject) => {
        if(newTxtUrlArr.length !== getInfoImgNum){
          getInfoImgNum++
          if(newTxtUrlArr.length == getInfoImgNum){
            resolve(`--------共${newTxtUrlArr.length}页,采集结束----------`)
            return
          }

          const indexKey1 = newTxtUrlArr[getInfoImgNum].indexOf("html")
          console.log('开始采集', getInfoImgNum+1 +"页",newTxtUrlArr[getInfoImgNum])
          getInfoImg(newTxtUrlArr[getInfoImgNum].substring(0,indexKey1+4),newTxtUrlArr[getInfoImgNum].substring(indexKey1+5),newTxtUrlArr)
        }
      });
    }
    
}


//读取文件
async function ReadList (){
  const file1 = await fsRead(`${filePath}/${index_key}.txt`)
  const txtUrlArr = file1.split(",")
  console.log('长度:',txtUrlArr.length)
  let newTxtUrlArr = txtUrlArr.slice(0,-1)

  const indexKey = newTxtUrlArr[0].indexOf("html")
  // let leftData = newTxtUrlArr.substring(indexKey+4)
  // let rightData = newTxtUrlArr.substring(0,indexKey+4)
  getInfoImg(newTxtUrlArr[0].substring(0,indexKey+4),newTxtUrlArr[0].substring(indexKey+5),newTxtUrlArr)

}

//获取URL
// getWeb()
// 获取图片
ReadList()