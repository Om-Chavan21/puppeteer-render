const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
  console.log("Starting the scraping process...");

  const browser = await puppeteer.launch({ headless: true });
  console.log("Browser launched successfully.");

  const page = await browser.newPage();
  console.log("New page created.");

  // Navigate the page to a URL.
  try {
    await page.goto("https://developer.chrome.com/", {
      waitUntil: "load",
      timeout: 60000,
    });
    console.log("Navigated to https://developer.chrome.com/");
  } catch (error) {
    console.error("Failed to navigate:", error);
    await browser.close();
    return res.status(500).send("Navigation error");
  }

  page.setDefaultNavigationTimeout(60000);
  console.log("Default navigation timeout set to 60 seconds.");

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });
  console.log("Viewport size set to 1080x1024.");

  // Type into search box.
  try {
    await page
      .locator(".devsite-search-field")
      .fill("automate beyond recorder");
    console.log('Typed "automate beyond recorder" into the search box.');
  } catch (error) {
    console.error("Error filling search box:", error);
    await browser.close();
    return res.status(500).send("Search box error");
  }

  // Wait and click on first result.
  try {
    await page.locator(".devsite-result-item-link").click();

    console.log("Clicked on the first search result.");
  } catch (error) {
    console.error("Error clicking on the search result:", error);
    await browser.close();
    return res.status(500).send("Click error");
  }

  // Locate the full title with a unique string.
  try {
    const textSelector = await page
      .locator("text/Customize and automate")
      .waitHandle();

    const fullTitle = await textSelector?.evaluate((el) => el.textContent);
    console.log("Extracted title:", fullTitle);

    // Print the full title.
    res.send(fullTitle);
  } catch (error) {
    console.error("Error extracting title:", error);
    res.status(500).send(`Title extraction error: ${error}`);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
};

module.exports = { scrapeLogic };
