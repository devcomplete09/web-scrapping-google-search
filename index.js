const puppeteer = require('puppeteer');
const fs = require('fs');

const scanForLinks = (page) => {
  return page.evaluate(() => {
    const aWithBr = document.querySelectorAll('a:has(br)');
    const hrefs = [];

    for (const anchor of aWithBr) {
      if (anchor.hasAttribute('href')) {
        hrefs.push(anchor.getAttribute('href'));
      }
    }

    return hrefs;
  });
}

const run = async (searchBy) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log(`Starting to search by: ${searchBy.searchText}`);
  const url = `https://www.google.com/search?q=${searchBy.searchText}`;
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  const hrefs = await scanForLinks(page);

  let stream = fs.createWriteStream(searchBy.fileName, { 'flags': 'a' });
  stream.once('open', () => {
    for (const href of hrefs) {
      stream.write(href + "\n");
    }
  });

  await browser.close();
};


const searchFor = [
  { searchText: 'web development', fileName: 'webDevelopment.txt' },
  { searchText: 'javascript tutorials', fileName: 'jsTutorials.txt' },
  { searchText: 'nodejs tutorials', fileName: 'nodejsTutorials.txt' }
]


for (const searchBy of searchFor) {
  run(searchBy);
}