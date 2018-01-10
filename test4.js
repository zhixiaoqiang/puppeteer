const puppeteer = require('puppeteer')

function sleep(delay) {
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


async function a() {
  const browser = await puppeteer.launch()

  let page = await browser.newPage()

  await page.goto('https://juejin.im/timeline/frontend', {waitUntil: 'networkidle2'})
  await page.waitFor(2000)

  let tags = await page.evaluate(() => {
    let titles = [...document.querySelectorAll('.title-row .title')]
    return titles.map((o, i) => ({
      title: o.text,
      src: o.href
    }))
  })
  await page.close()

  // 打印最热的前五篇文章
  for (let index = 0; index < 2; index++) {
    page = await browser.newPage()
    await page.goto(tags[index].src, {waitUntil: 'networkidle2'})
    await page.waitFor(2000)
    //注入代码，慢慢把滚动条滑到最底部，保证所有的元素被全部加载
		let scrollEnable = true;
		let scrollStep = 500; //每次滚动的步长
		while (scrollEnable) {
			scrollEnable = await page.evaluate((scrollStep) => {
        document.querySelector('.main-header').style.display = 'none'
				let scrollTop = document.scrollingElement.scrollTop;
				document.scrollingElement.scrollTop = scrollTop + scrollStep;
				return document.body.clientHeight > scrollTop + 1080 ? true : false
			}, scrollStep);
			await sleep(200);
		}
		await page.waitForSelector(".comment-list", {waitUntil: 'networkidle2'}); //判断是否到达底部了
    await page.pdf({path: `${tags[index].title}.pdf`, printBackground: true})
    await page.close() 
  }
}

a()