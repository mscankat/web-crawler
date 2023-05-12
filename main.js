const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  console.log(process.argv.length);
  if (process.argv.length < 3) {
    console.log("no website");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many input");
  }
  console.log("starting crawl");
  const usrInput = process.argv[2];
  const pages = await crawlPage(usrInput, usrInput, {});
  for (const page of Object.entries(pages)) {
    console.log(page);
  }
  printReport(pages);
}
main();
