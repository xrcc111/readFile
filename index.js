
// const fs = require("fs");
// fs相当于filequeue而且能更好的控制并发
const FileQueue = require('filequeue');

const fq = new FileQueue(10)

// 异步读取上级目录下的所有文件
function main(curpath, keyWords) {
  return new Promise((resolve, reject) => {
    fq.readdir(curpath, (err, files) => {
      if (err) reject(err)
      if (files && files.length > 0) {
        resolve(handleSort(curpath, files, keyWords))
      }
    })
  })
}

// 把读取的文件进行分类处理
async function handleSort(curpath, files, keyWords) {
  for (let i = 0; i < files.length; i++) {
    isFileOrDir(curpath + files[i], keyWords)
  }
}


// 判断当前读取的是路径还是文件
function isFileOrDir(pathUrl, keyWords) {
  return new Promise((resolve, reject) => {
    fq.stat(pathUrl, async (err, data) => {
      if (err) reject(err)
      // 如果是就去读取文件
      if (data.isFile()) {
        // Document为关键字
        resolve(findFile(pathUrl, keyWords))
      }
      // 如果是文件夹的话就去找下一级
      if (data.isDirectory()) {
        await main(pathUrl + '/')
      }

    })
  })
}


// 如果该文件下的文件想要的关键字就去反馈文件路径
function findFile(pathUrl, keyWords) {
  return new Promise((resolve, reject) => {
    fq.readFile(pathUrl, "utf8", (err, dataStr) => {
      // 判断是否读取成功
      if (err) reject(err)
      console.log("读取文件成功")
      if (dataStr && dataStr.indexOf(keyWords) !== -1) {
        console.log(pathUrl)
        resolve(pathUrl)
      }
    })
  })
}

// 默认目录
main('./', 'Document')




