function printReport(pages) {
  console.log(
    "======================================================================"
  );
  sortedArray = Object.entries(pages).sort((a, b) => b[1] - a[1]);

  for (const entry of sortedArray) {
    console.log(`Found ${entry[1]} internal links to ${entry[0]}`);
  }
}

module.exports = { printReport };
