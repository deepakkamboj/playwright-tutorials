// slides/engine.js
module.exports = ({ marp }) =>
  marp.use(({ marpit }) => {
    const { highlighter } = marpit

    marpit.highlighter = function (code, lang, attrs) {
      const html = highlighter.call(this, code, lang, attrs)

      // Match line highlight ranges {5,7-9}
      const m = (attrs || '').toString().match(/{([\d,-]+)}/)
      const ranges = m
        ? m[1].split(',').map(r => r.split('-').map(n => parseInt(n, 10)))
        : []

      // Detect "no-linenos"
      const disableLineNumbers = (attrs || '').toString().includes("no-linenos")

      const lines = html.split(/\n(?!$)/)
      const items = lines.map((line, i) => {
        const ln = i + 1
        const on = ranges.some(([a, b]) => (b ? a <= ln && ln <= b : ln === a))

        if (disableLineNumbers) {
          // no line number span
          return `<li${on ? ' class="hl"' : ''}><span>${line}</span></li>`
        } else {
          // with line number span
          return `<li${on ? ' class="hl"' : ''}><span data-lno></span><span>${line}</span></li>`
        }
      })

      return `<ol class="code-block${disableLineNumbers ? ' no-linenos' : ''}">${items.join('')}</ol>`
    }
  })
