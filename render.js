const fs = require("fs");
const toHTML = require("./render-core.js")

let mdFile = process.argv[2];
let mdFileContent = fs.readFileSync(mdFile, 'utf8');
let result = toHTML(mdFileContent);
fs.writeFileSync(mdFile.replace(".md", ".html"), result);