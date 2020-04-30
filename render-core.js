const taskList = require('./markdownItPlugins/markdownitTaskPlugin');
const MarkdownIt = require('markdown-it');
const codeBlock = require('./markdownItPlugins/markdownitCodeBlockPlugin');
const code = require('./markdownItPlugins/markdownitCodeRenderer');
const blockQuote = require('./markdownItPlugins/markdownitBlockQuoteRenderer');
const tableRenderer = require('./markdownItPlugins/markdownitTableRenderer');
const htmlBlock = require('./markdownItPlugins/markdownitHtmlBlockRenderer');
const codeBackticks = require('./markdownItPlugins/markdownitBackticksRenderer');
const codeBlockManager = require('./codeBlockManager');
// const $ = require("jquery");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const $ = require('jquery')(dom.window);
const fs = require('fs');

const markdownitHighlight = new MarkdownIt({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-',
  highlight(codeText, type) {
    return codeBlockManager.createCodeBlockHtml(type, codeText);
  }
});
const markdownit = new MarkdownIt({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-'
});

// markdownitHighlight
markdownitHighlight.block.ruler.at('code', code);
markdownitHighlight.block.ruler.at('table', tableRenderer, {
  alt: ['paragraph', 'reference']
});
markdownitHighlight.block.ruler.at('blockquote', blockQuote, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownitHighlight.block.ruler.at('html_block', htmlBlock, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownitHighlight.inline.ruler.at('backticks', codeBackticks);
markdownitHighlight.use(taskList);
markdownitHighlight.use(codeBlock);

markdownitHighlight.renderer.rules.softbreak = (tokens, idx, options) => {
  if (!options.breaks) {
    return '\n';
  }

  const prevToken = tokens[idx - 1];

  if (prevToken && prevToken.type === 'html_inline' &&
    prevToken.content === '<br>') {
    return '';
  }

  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};

// markdownit
markdownit.block.ruler.at('code', code);
markdownit.block.ruler.at('table', tableRenderer, {
  alt: ['paragraph', 'reference']
});
markdownit.block.ruler.at('blockquote', blockQuote, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownit.block.ruler.at('html_block', htmlBlock, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownit.inline.ruler.at('backticks', codeBackticks);
markdownit.use(taskList);
markdownit.use(codeBlock);

// This regular expression refere markdownIt.
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/html_re.js
const attrName = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const unquoted = '[^"\'=<>`\\x00-\\x20]+';
const singleQuoted = "'[^']*'";
const doubleQuoted = '"[^"]*"';
const attrValue = `(?:${unquoted}|${singleQuoted}|${doubleQuoted})`;
const attribute = `(?:\\s+${attrName}(?:\\s*=\\s*${attrValue})?)*\\s*`;
const openingTag = `(\\\\<|<)([A-Za-z][A-Za-z0-9\\-]*${attribute})(\\/?>)`;
const HTML_TAG_RX = new RegExp(openingTag, 'g');

/**
 * Replace 'onerror' attribute of img tag to data property string
 * @param {string} markdown markdown text
 * @returns {string} replaced markdown text
 * @private
 */
function replaceImgAttrToDataProp(markdown) {
  const onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\\"']?[^\\"']*[\\"']?)(.*)/i;

  while (onerrorStripeRegex.exec(markdown)) {
    markdown = markdown.replace(onerrorStripeRegex, '$1$3');
  }

  return markdown;
}

/**
 * _markdownToHtml
 * Convert markdown to html
 * @param {string} markdown markdown text
 * @param {object} env environment sandbox for markdownit
 * @returns {string} html text
 * @private
 */
function markdownToHtml(markdown, env) {
  markdown = markdown.replace(HTML_TAG_RX, (match, $1, $2, $3) => {
    return match[0] !== '\\' ? `${$1}${$2} data-tomark-pass ${$3}` : match;
  });

  markdown = replaceImgAttrToDataProp(markdown);

  return markdownitHighlight.render(markdown, env);
}

/**
 * Remove BR's data-tomark-pass attribute text when br in code element
 * @param {string} renderedHTML Rendered HTML string from markdown editor
 * @returns {string}
 * @private
 */
function removeBrToMarkPassAttributeInCode(renderedHTML) {
  const $wrapperDiv = $('<div />');

  $wrapperDiv.html(renderedHTML);

  $wrapperDiv.find('code, pre').each((i, codeOrPre) => {
    const $code = $(codeOrPre);
    $code.html($code.html().replace(/\sdata-tomark-pass\s(\/?)&gt;/g, '$1&gt;'));
  });

  renderedHTML = $wrapperDiv.html();

  return renderedHTML;
}

/**
 * toHTML
 * Convert markdown to html
 * emit convertorAfterMarkdownToHtmlConverted
 * @param {string} markdown markdown text
 * @returns {string} html text
 */
function toHTML(markdown) {
  let html = markdownToHtml(markdown);
  html = removeBrToMarkPassAttributeInCode(html);
  return html;
}

module.exports = toHTML;