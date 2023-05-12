const jsdom = require("jsdom");
const { JSDOM } = jsdom;

console.log("running");
function scrapeURL(htmlBody, baseURL) {
  const base = new URL(baseURL);
  const { window } = new JSDOM(htmlBody);
  const links = window.document.querySelectorAll("a");

  let results = [];
  for (i of links) {
    if (i.href[0] === "/") {
      results.push(base.href.slice(0, -1) + i.href);
    }
    try {
      new URL(i);
      results.push(i.href);
    } catch {}
  }
  return results;
}

function normalizeURL(url) {
  const newURL = new URL(url);
  const hostPath = newURL.host + newURL.pathname;
  if (hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

async function crawlPage(absoluteURL, currentURL, pages) {
  const base = new URL(absoluteURL);
  const current = new URL(currentURL);
  const normalizedCurrentURL = normalizeURL(currentURL);

  if (base.hostname !== current.hostname) {
    return pages;
  }
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL] += 1;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;
  let text = "";
  console.log(`crawling: ${currentURL}`);
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`error with code: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`content type is not html : ${contentType}`);
      return pages;
    }
    text = await response.text();
  } catch (err) {
    console.log(`error fetching: ${err.message}, on page:${currentURL}`);
  }
  const newLinks = scrapeURL(text, absoluteURL);

  for (const link of newLinks) {
    pages = await crawlPage(absoluteURL, link, pages);
  }
  return pages;
}

module.exports = {
  normalizeURL,
  scrapeURL,
  crawlPage,
};
