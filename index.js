const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News "Newest" page
  await page.goto("https://news.ycombinator.com/newest");

  // Extract the article timestamps
  const articles = await page.$$eval('.athing', nodes => {
    return nodes.map(node => {
      const title = node.querySelector('.titleline a')?.innerText || 'No title';
      const ageElement = node.nextElementSibling?.querySelector('.age a');
      const timestamp = ageElement ? ageElement.innerText : 'Unknown';
      return { title, timestamp };
    });
  });

  // Function to convert relative timestamps to absolute timestamps
  const parseTime = (timeString) => {
    const now = new Date();
    const [value, unit] = timeString.split(" ");
    if (unit.includes("minute")) return new Date(now - value * 60000);
    if (unit.includes("hour")) return new Date(now - value * 3600000);
    if (unit.includes("day")) return new Date(now - value * 86400000);
    return now; // Default to now if format is unexpected
  };

  // Convert timestamps to Date objects
  const parsedArticles = articles.map(article => ({
    ...article,
    date: parseTime(article.timestamp)
  }));

  // Check if articles are sorted from newest to oldest
  let isSorted = parsedArticles.every((article, index, arr) => {
    return index === 0 || arr[index - 1].date >= article.date;
  });

  console.log(isSorted ? "✅ Articles are sorted correctly!" : "❌ Articles are NOT sorted correctly!");

  // Close the browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();


// // EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// const { chromium } = require("playwright");

// async function sortHackerNewsArticles() {
//   // launch browser
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   // go to Hacker News
//   await page.goto("https://news.ycombinator.com/newest");
// }

// (async () => {
//   await sortHackerNewsArticles();
// })();
