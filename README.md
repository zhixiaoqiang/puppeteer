# Chrome的自动化之旅--Puppeteer

##### 一、 [实现网站截图](#1)

##### 二、 [保存阮一峰es6为pdf](#2)

##### 三、 [将懒加载的页面保存为pdf](#3)

***

### 啥 ?
通过puppeteer让浏览器自动去做一些事情
> [Puppetter](https://github.com/GoogleChrome/puppeteer/blob/HEAD/docs/api.md): 一个可以操控Chrome的node库，且可以做爬虫哦~~

##### 功能有下（打钩为已尝试）：
- [x] 1. 将网页生成为PDF/图片
- [ ] 2. 爬取SPA应用，并生成预渲染内容（即服务端渲染）
- [ ] 3. 可以从网站抓取内容（爬虫）
- [ ] 4. 自动化表单提交、UI测试、键盘输入等（自动登录xx网站）
- [ ] 5. 帮你创建一个最新的自动化测试环境（chrome），可以直接在此运行测试用例
- [ ] 6. 捕获站点的时间线，以便追踪你的网站，帮助分析网站性能问题

### <span id='1'>实现网站截图<span>

##### 1. 项目中安装puppeteer
```
  yarn add puppeteer(如果装了yarn)
  npm i puppeteer(如果有cnpm请用cnpm)
```
##### 2. 新建test.js并复制如下代码
```
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
```
##### 3. 运行test
```
当前项目下执行
node test.js
```

到这里为止，如果你看到项目文件里多了一个baidu.png文件，恭喜你，你已经入门了。

### <span id='2'>接下来外我们来抓取阮一峰的es6文档</span>
> 附上地址 http://es6.ruanyifeng.com/#README

##### 新建一个test2.js
对关键代码进行注释：可看test.js的注释
```
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
puppeteer.launch({headless: false}).then(async browser => {
    let page = await browser.newPage();

    await page.goto('http://es6.ruanyifeng.com/#README');
    await timeout(2000);

    // 将当前页面的Dom对象处理后取到相关信息为下一步的自动化做准备
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
    await page.pdf({path: `.es6-pdf/${aTags[0].name}.pdf`});
    // 关闭页面
    page.close()

    // 循环打印从第二个目录到最后一个目录的内容
    for (let i = 1; i < aTags.length; i++) {
      page = await browser.newPage()
    // 数组中的每一个对象赋值给a
      let a = aTags[i];

      await page.goto(a.href);

      await timeout(2000);

      await page.pdf({path: `.es6-pdf/${a.name}.pdf`});

      page.close();
    }
    
    browser.close();
});
```

***
### API
### puppeteer
    .launch(obj) 启动浏览器
    obj: 
        headless: true/false 是否显示浏览器
        timeout: 15000 设置超时时间
        ignoreHTTPSErrors: true 如果是https页面会忽略https错误
        devtools: false 打开开发者工具, 当此值为true时, headless总为false

#### browser
    .newPage() 新开一个页面
    .close()   关闭页面

#### page
    .goto(href) 跳转到某个地址
    
    .screenshot(obj) 将网页保存为图片
        obj:
            path: src 保存图片
            fullPage: true 截全屏
            type: 'png' 文件类型
            clip: { 指定区域截图，clip和fullPage两者只能设置一个
              x: 0,
              y: 0,
              width: 1000,
              height: 40
            }
    
    .pdf(obj) 将网页保存为pdf
        obj: 
            path: src 保存pdf
            format: 'A4' 保存为A4格式
            printBackground: true 打印背景图形 默认为空
    
    .evaluate(pageFun, ...args) 在浏览器中执行函数，相当于在控制台中执行函数
    
    .type(selector, text[, option]) 获取输入框焦点并输入文字
        // 实例：选择#id元素，输入百度一下(每个字延迟100ms)
        page.type('#id', '百度一下', {delay: 100})
        
    .click(selector[, option]) 点击元素
    
    .keyboard.press() 模拟键盘按下某个按键，目前mac上组合键无效为已知bug
    
    .waitFor() 页面等待，可以是时间、某个元素、某个函数
    
    .frames() 获取当前页面所有的 iframe，然后根据 iframe 的名字精确获取某个想要的 iframe
    
    iframe.$('.srchsongst') 获取 iframe 中的某个元素
    
    iframe.$eval() 相当于在 iframe 中运行 document.queryselector 获取指定元素，并将其作为第一个参数传递
    
    iframe.$$eval 相当于在 iframe 中运行 document.querySelectorAll 获取指定元素数组，并将其作为第一个参数传递


### 结语
感谢纳兹

<span style='margin-bottom:50px'></span>