// slides/engine.js
module.exports = ({ marp }) =>
  marp.use(({ marpit }) => {
    const { highlighter } = marpit

    marpit.highlighter = function (code, lang, attrs) {
      const html = highlighter.call(this, code, lang, attrs)
      const m = (attrs || '').toString().match(/{([\d,-]+)}/)
      const ranges = m
        ? m[1].split(',').map(r => r.split('-').map(n => parseInt(n, 10)))
        : []

      const lines = html.split(/\n(?!$)/) // keep trailing newline intact
      const items = lines.map((line, i) => {
        const ln = i + 1
        const on = ranges.some(([a, b]) => (b ? a <= ln && ln <= b : ln === a))
        return `<li${on ? ' class="hl"' : ''}><span data-lno></span><span>${line}</span></li>`
      })

      return `<ol>${items.join('')}</ol>`
    }
  })
