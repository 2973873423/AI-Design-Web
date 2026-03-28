import { marked } from "marked"

marked.setOptions({
  gfm: true,
  breaks: true,
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const PRINT_CSS = `
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif; max-width: 820px; margin: 0 auto; padding: 32px 24px; color: #111827; line-height: 1.75; font-size: 14px; background: #fff; }
  .doc-header { margin-bottom: 24px; border-bottom: 2px solid #0891b2; padding-bottom: 16px; }
  .doc-header .meta { font-size: 12px; color: #6b7280; margin-top: 8px; }
  .doc-header .subtitle { font-size: 11px; letter-spacing: 0.08em; color: #0891b2; text-transform: uppercase; margin-top: 8px; }
  .figure-wrap { margin: 24px 0; text-align: center; page-break-inside: avoid; }
  .figure-wrap img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb; }
  .figure-caption { font-size: 12px; color: #6b7280; margin-top: 8px; }
  .markdown-body h1 { font-size: 1.5rem; margin: 1.25em 0 0.5em; font-weight: 700; }
  .markdown-body h2 { font-size: 1.25rem; margin: 1em 0 0.5em; font-weight: 600; }
  .markdown-body h3 { font-size: 1.1rem; margin: 0.9em 0 0.4em; font-weight: 600; }
  .markdown-body p { margin: 0.65em 0; }
  .markdown-body ul, .markdown-body ol { margin: 0.65em 0; padding-left: 1.5em; }
  .markdown-body table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 13px; }
  .markdown-body th, .markdown-body td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
  .markdown-body th { background: #f3f4f6; font-weight: 600; }
  .markdown-body blockquote { border-left: 4px solid #0891b2; margin: 1em 0; padding-left: 1em; color: #4b5563; }
  .markdown-body pre { background: #1f2937; color: #e5e7eb; padding: 12px 16px; border-radius: 8px; overflow-x: auto; font-size: 12px; }
  .markdown-body code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  .markdown-body pre code { background: transparent; padding: 0; color: inherit; }
  @media print {
    body { padding: 12px; }
    .figure-wrap { break-inside: avoid; }
  }
`

export type DossierExportPayload = {
  docTitle: string
  metaLine: string
  subtitle: string
  imageSrc: string | null
  imageAlt: string
  markdown: string
}

export function buildDossierDocumentHtml(payload: DossierExportPayload): string {
  const raw = payload.markdown || ""
  const bodyHtml = marked.parse(raw, { async: false }) as string

  const figureSection =
    payload.imageSrc != null && payload.imageSrc.length > 0
      ? `<div class="figure-wrap">
           <img src="${escapeHtml(payload.imageSrc)}" alt="${escapeHtml(payload.imageAlt)}" />
           <div class="figure-caption">${escapeHtml(payload.imageAlt)}</div>
         </div>`
      : ""

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(payload.docTitle)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div class="doc-header">
    <h1>${escapeHtml(payload.docTitle)}</h1>
    <div class="meta">${escapeHtml(payload.metaLine)}</div>
    <div class="subtitle">${escapeHtml(payload.subtitle)}</div>
  </div>
  ${figureSection}
  <div class="markdown-body">${bodyHtml}</div>
</body>
</html>`
}

/** 打开打印预览：可在对话框中选择打印机或「另存为 PDF」 */
export function printDossierDocument(html: string): void {
  // 使用 Blob URL 加载整页 HTML，避免 about:blank + document.write 在 Edge/Chrome 下空白或不执行
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, "_blank")
  if (!w) {
    URL.revokeObjectURL(url)
    alert("无法打开新窗口，请允许弹出窗口后再试。")
    return
  }

  let printed = false
  const runPrint = () => {
    if (printed) return
    try {
      const d = w.document
      if (d.readyState !== "complete" && d.readyState !== "interactive") return
    } catch {
      return
    }
    printed = true
    setTimeout(() => {
      try {
        w.focus()
        w.print()
      } catch {
        /* ignore */
      }
    }, 200)
    // 打印对话框关闭后再回收，避免过早 revoke 导致白屏
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }, 120_000)
  }

  w.addEventListener("load", () => setTimeout(runPrint, 100))
  // blob 在部分浏览器 onload 顺序不一致，轮询几次直到可打印
  let attempts = 0
  const poll = setInterval(() => {
    attempts += 1
    runPrint()
    if (printed || attempts > 40) clearInterval(poll)
  }, 150)
}

/** 下载为 .html，可用 Word / WPS 打开再另存为 docx */
export function downloadDossierDocumentHtml(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
