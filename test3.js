// 百度自动搜索

const puppeteer = require('puppeteer')

async function auto (obj) {
  let browser = await puppeteer.launch({headless: false})

  let page = await browser.newPage()

  await page.goto(obj.src)
  await page.waitFor(2000)
  await page.type(obj.inputId, obj.inputText, {delay: obj.delay})

  await page.click(obj.submitId)

  await obj.pageSize && page.setViewport(obj.pageSize)

  await page.screenshot({path: obj.saveImgPath || `${obj.inputText}.png`, fullPage: true})

}

let data = {
  src: 'http://baidu.com',
  inputId: '#kw',
  inputText: '纳兹',
  delary: 100,
  submitId: '#su',
  saveImgPath: '纳兹很帅的.png',
}
auto(data)