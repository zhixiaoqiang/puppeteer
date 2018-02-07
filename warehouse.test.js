const puppeteer = require('puppeteer');

// 全局参数
const GLOBAL_DATA = {
  warehouse_url: '***',
  odev_loginUrl: '***',
  odev_chooseRoleUrl: '***',
  role: '***'
}

// 延时执行
let timeout = function(delay) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          try {
              resolve(1)
          } catch (e) {
              reject(0)
          }
      }, delay)
  })
}
// 打开浏览器
puppeteer.launch({headless: false}).then(async browser => {
  let page = await browser.newPage()
  await page.goto(GLOBAL_DATA.warehouse_url)
  // 等待右侧加载出来确定加载完成
  await page.waitForSelector(".right", {waitUntil: 'networkidle2'});
  // 加载完成后获取浏览器属性，并且获取menu，根据menu判断是否选过角色
  let pageProps = await page.evaluate(() => {
    let screenW = window.screen.availWidth,
    screenH = window.screen.height,
    menu = document.querySelector('.menu')
    return {
      screenW,
      screenH,
      menu
    }
  })
  // 设置页面大小
  await page.setViewport({width: pageProps.screenW, height: pageProps.screenH})
  // 截图当前页面
  await page.screenshot({path: './warehouse/warehouse-in.png', fullPage: true})

  // 当前是否是财务经理角色
  let isFinance = await page.evaluate(async (GLOBAL_DATA) => {
    let role = document.querySelector('.head').innerText
    if (role.indexOf(GLOBAL_DATA.role) > -1) {
      await page.screenshot({path: './warehouse/warehouse-in3.png', fullPage: true})
      return true
    }
    return false
  }, GLOBAL_DATA)
  // 没选过角色就调到登录页
  if (pageProps.menu || isFinance) {
    
  } else {
    page = await browser.newPage()
    await page.goto(GLOBAL_DATA.odev_loginUrl)
    await page.setViewport({width: pageProps.screenW, height: pageProps.screenH})
    await page.waitFor(1500)
    await page.screenshot({path: './warehouse/odev-in.png', fullPage: true})
    await page.type('[placeholder=请输入手机号码]', '***', {delay: 50})
    await page.type('[placeholder=请输入验证码]', '11', {delay: 50})
    await page.screenshot({path: './warehouse/odev-end.png', fullPage: true})
    await page.click('.login-button')
    await page.waitFor(1000)
    await page.screenshot({path: './warehouse/choose-in.png', fullPage: true})

    // 选择响应角色后点击登录
    await page.evaluate((GLOBAL_DATA) => {
      let list = [...document.querySelectorAll('.role')],
      curRole = list.filter(v => v.innerText === GLOBAL_DATA.role)
      if (curRole.length) {
        curRole[0].click()
      }
    }, GLOBAL_DATA)

    await page.screenshot({path: './warehouse/choose-end.png', fullPage: true})
    await page.click('a')

    page = await browser.newPage()
    await page.goto(GLOBAL_DATA.warehouse_url)
    await page.setViewport({width: pageProps.screenW, height: pageProps.screenH})
    // 等待muen加载出来，确定为已加载完成
    await page.waitForSelector(".menu", {waitUntil: 'networkidle2'})
    await page.screenshot({path: './warehouse/warehouse-in2.png', fullPage: true})

  }  
})
