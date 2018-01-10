// 引入puppeteer
const puppeteer = require('puppeteer');
// 一个异步的方法getPic
async function getPic() {
  // 等待打开chrome并将实例赋值给browser
  // headless为false：显示浏览器的执行过程，为true则不会看到浏览器
  const browser = await puppeteer.launch({headless: false});
  // 等待浏览器打开新的页面，并将页面对象赋值给page
  const page = await browser.newPage();
  // 等待页面跳转到百度
  await page.goto('http://baidu.com');
  // 设置页面的大小，如不设置可能截图不全
  await page.setViewport({width: 1000, height: 500})
  // 等待将页面保存为baidu.png文件并存在同级目录下
  await page.screenshot({path: 'baidu.png'});
  // 等待浏览器关闭
  await browser.close();
}
// 运行方法
getPic();