const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MOCKUPS_DIR = path.join(__dirname);
const FILES = [
  { name: '01-escenico', file: '01-escenico.html' },
  { name: '02-servicios', file: '02-servicios.html' },
  { name: '03-showcase', file: '03-showcase.html' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const { name, file } of FILES) {
    const htmlPath = path.join(MOCKUPS_DIR, file);
    const outputPath = path.join(MOCKUPS_DIR, `${name}.png`);

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Load the local HTML file
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a bit for fonts and animations
    await new Promise(r => setTimeout(r, 1500));

    // Take full page screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    console.log(`✓ ${name}.png generated`);
    await page.close();
  }

  await browser.close();
  console.log('Done! All mockups rendered.');
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
