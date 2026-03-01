import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    page.on('requestfailed', request => {
        console.log('BROWSER REQUEST FAILED:', request.url(), request.failure()?.errorText);
    });

    console.log('Navigating to http://localhost:3000...');
    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });

        const html = await page.content();
        console.log('DOM length:', html.length);

        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('Root content length:', rootContent.length);
        if (rootContent.length === 0) {
            console.log('Root is EMPTY.');
        } else {
            console.log('Root contains HTML.');
        }
    } catch (e) {
        console.error('Navigation failed:', e);
    }

    await browser.close();
})();
