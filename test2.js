const puppeteer = require('puppeteer');

// 一个延迟的方法，防止页面跳转完后没有加载完页面而打印出loading的页面
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
// 打印pdf必须启动无头的浏览器，成功后执行一个打印页面的回调函数
puppeteer.launch().then(async browser => {
    let page = await browser.newPage();

    await page.goto('http://es6.ruanyifeng.com/#README');
    await timeout(2000);

    // 将当前页面的Dom对象处理后取到相关信息为下一步的自动化做准备
    // page.evaluate: 向页面注入函数，这里是得到Dom对象数组并赋值给aTags
    let aTags = await page.evaluate(() => {
        // ...是es6的扩展运算符自行查阅
      let as = [...document.querySelectorAll('ol li a')];
    //   遍历Dom对象返回只包含有用信息的新的数组
      return as.map((a) =>{
          return {
            href: a.href.trim(),
            name: a.text
          }
      });
    });
    // 将第一个目录的内容保存为目录名.pdf文件并放置到es6-pdf文件夹下
    // 注意：必须提前建好es6-pdf文件夹，否则会报错
    await page.pdf({path: `./es6-pdf/${aTags[0].name}.pdf`, printBackground: true});
    // 关闭页面
    page.close()

    // 循环打印从第二个目录到最后一个目录的内容
    for (let i = 1; i < aTags.length; i++) {
      page = await browser.newPage()
    // 数组中的每一个对象赋值给a
      let a = aTags[i];

      await page.goto(a.href);

      await timeout(2000);

      await page.pdf({path: `./es6-pdf/${a.name}.pdf`, printBackground: true});

      page.close();
    }

    browser.close();
});