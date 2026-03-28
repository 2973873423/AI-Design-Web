"use client"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FileText, Maximize2, Pencil, Loader2 } from "lucide-react"
import { useWorkflow } from "@/app/context";
import {
  buildDossierDocumentHtml,
  printDossierDocument,
  downloadDossierDocumentHtml,
} from "@/lib/export-dossier-document"

export function DetailedSolution() {
  const { workflowStatus, workflowOutputs, selectedOption, refineDossierWithDialogue } =
    useWorkflow();
  const isCompleted = workflowStatus === "completed";
  const isResuming = workflowStatus === "resuming";

  const detailedSolution = workflowOutputs.dossierText;
  const hasDossier = Boolean(selectedOption && detailedSolution);
  /** 完成 / 再次运行 wf2 中 / 失败后仍保留上次正文时，继续展示右侧内容 */
  const showResult =
    hasDossier && (isCompleted || isResuming || workflowStatus === "failed");
  const showLoading = isResuming;
  const showEmpty = !selectedOption && !isResuming;

  const [dialogueInput, setDialogueInput] = useState("");

  async function handleDialogueModify() {
    if (!showResult || showLoading) return;
    const ok = await refineDossierWithDialogue(dialogueInput);
    if (ok) setDialogueInput("");
  }

  function handleExportDocument(e: React.MouseEvent<HTMLButtonElement>) {
    if (!showResult || !detailedSolution || !selectedOption) return

    const directionLabel =
      selectedOption === "A" ? "极简主义" : selectedOption === "B" ? "长效维护" : "闭环回收"
    const directionTitle =
      selectedOption === "A"
        ? "模块化极简环保"
        : selectedOption === "B"
          ? "长效维护智造"
          : "闭环回收引导"

    const rawImg = workflowOutputs.dossierImage
    const imageSrc = rawImg
      ? typeof rawImg === "string"
        ? rawImg
        : JSON.stringify(rawImg)
      : null

    const html = buildDossierDocumentHtml({
      docTitle: `方向 ${selectedOption}：${directionTitle} - 深度细化方案`,
      metaLine: `[ 方向 ${selectedOption}：${directionLabel} ]`,
      subtitle: "ECO-CONCEPT DEFINITION REPORT v1.0",
      imageSrc,
      imageAlt: `方案 ${selectedOption} · 高保真渲染图`,
      markdown: String(detailedSolution),
    })

    if (e.shiftKey) {
      const stamp = new Date().toISOString().slice(0, 10)
      downloadDossierDocumentHtml(html, `方案${selectedOption}-细化方案-${stamp}.html`)
    } else {
      printDossierDocument(html)
    }
  }

  return (
    <div className="flex-1 min-w-[360px] h-full bg-[#0d1117] flex flex-col relative">
      <div className="p-4 border-b border-[#1e2530] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wider text-cyan-400">DETAILED SOLUTION DOSSIER</h2>
        </div>
        <button type="button" className="p-1.5 rounded hover:bg-[#1e2530] transition-colors">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="absolute top-16 right-4 z-10">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
            disabled={!showResult || showLoading}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {showLoading && !showResult && (
          <div className="h-32 flex items-center justify-center text-[11px] text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            正在生成高保真渲染图...
          </div>
        )}

        {/* output1 图片框 */}
        {showResult && (
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#151c28] to-[#0d1520] border border-[#1e2530]">
            <div className="aspect-[4/3] flex items-center justify-center p-2 min-h-[200px]">
              {workflowOutputs.dossierImage ? (
                <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden bg-[#0a0e14]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={typeof workflowOutputs.dossierImage === "string"
                      ? workflowOutputs.dossierImage
                      : JSON.stringify(workflowOutputs.dossierImage)}
                    alt={`方案 ${selectedOption} · 高保真渲染图`}
                    className="max-w-full max-h-[360px] w-auto h-auto object-contain rounded-lg"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#1a2535] border border-[#2a3545] flex items-center justify-center">
                    <svg className="w-5 h-5 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-muted-foreground/50">暂无渲染图</div>
                </div>
              )}
            </div>
            <div className="absolute bottom-2 left-2 flex gap-1.5">
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400/80 border border-cyan-500/20">Photorealistic Render</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400/80 border border-amber-500/20">方案 {selectedOption} · AI Generated</span>
            </div>
          </div>
        )}

        {/* output2 文本 */}
        {showEmpty && (
          <div className="h-40 flex items-center justify-center text-[11px] text-muted-foreground/50">
            选择方案后，将生成深度细化的详细方案文档
          </div>
        )}

        {showResult && (
          <>
            <div className="space-y-1">
              <div className="text-[10px] text-muted-foreground/70">
                [ 方向 {selectedOption}：{selectedOption === "A" ? "极简主义" : selectedOption === "B" ? "长效维护" : "闭环回收"} ]
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight">
                方向 {selectedOption}：{selectedOption === "A" ? "模块化极简环保" : selectedOption === "B" ? "长效维护智造" : "闭环回收引导"} - 深度细化方案
              </h3>
              <div className="text-[10px] text-cyan-400/70 tracking-wider uppercase">
                ECO-CONCEPT DEFINITION REPORT v1.0
              </div>
            </div>
            <ReactMarkdown
              components={{
                div: ({ children, ...props }) => (
                  <div className="prose-custom text-[11px] text-muted-foreground leading-[1.75] space-y-1.5" {...props}>
                    {children}
                  </div>
                ),
                p: ({ children, ...props }) => (
                  <p className="m-0" {...props}>{children}</p>
                ),
                h1: ({ children, ...props }) => (
                  <h1 className="text-sm font-bold mt-4 mb-2" {...props}>{children}</h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-xs font-semibold mt-3 mb-1.5" {...props}>{children}</h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-[11px] font-medium mt-2.5 mb-1" {...props}>{children}</h3>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc list-inside my-1" {...props}>{children}</ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal list-inside my-1" {...props}>{children}</ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="my-0.5" {...props}>{children}</li>
                ),
                code: ({ children, ...props }) => (
                  <code className="px-1 py-0.5 rounded bg-[#1a2535] text-cyan-400/80 text-[10px]" {...props}>{children}</code>
                ),
                pre: ({ children, ...props }) => (
                  <pre className="p-2 rounded bg-[#0d1117] overflow-x-auto my-2" {...props}>{children}</pre>
                ),
                table: ({ children, ...props }) => (
                  <table className="w-full border-collapse my-2 text-[10px]" {...props}>{children}</table>
                ),
                th: ({ children, ...props }) => (
                  <th className="border border-[#252d3a] px-2 py-1 bg-[#151a25] font-medium" {...props}>{children}</th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border border-[#252d3a] px-2 py-1" {...props}>{children}</td>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-2 border-cyan-500/30 pl-3 my-2 italic" {...props}>{children}</blockquote>
                ),
                a: ({ children, ...props }) => (
                  <a className="text-cyan-400/70 underline hover:text-cyan-400" {...props}>{children}</a>
                ),
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold text-foreground/80" {...props}>{children}</strong>
                ),
                em: ({ children, ...props }) => (
                  <em className="italic" {...props}>{children}</em>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {String(detailedSolution)}
            </ReactMarkdown>
          </>
        )}

        {!showLoading && !showEmpty && !showResult && (
          <div className="h-40 flex items-center justify-center text-[11px] text-muted-foreground/50">
            等待方案深化完成，即将展示详细内容...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1e2530] space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={dialogueInput}
              onChange={(e) => setDialogueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleDialogueModify();
              }}
              placeholder="对话修改方案（如：增加便携性设计）"
              className="w-full bg-[#151a25] border border-[#252d3a] rounded px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-cyan-500/40 transition-colors pr-16"
              disabled={!showResult || showLoading}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            title="打开打印预览，可选择打印机或「另存为 PDF」。按住 Shift 点击可下载 HTML 文件。"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded bg-[#151a25] border border-[#252d3a] text-[10px] text-foreground/70 hover:bg-[#1a2030] hover:border-[#303a4a] transition-colors disabled:opacity-50"
            disabled={!showResult || showLoading}
            onClick={handleExportDocument}
          >
            <FileText className="w-3 h-3" />
            <span>导出方案文档</span>
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded bg-[#151a25] border border-[#252d3a] text-[10px] text-foreground/70 hover:bg-[#1a2030] hover:border-[#303a4a] transition-colors disabled:opacity-50"
            disabled={!showResult || showLoading}
            onClick={() => void handleDialogueModify()}
          >
            {showLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Pencil className="w-3 h-3" />
            )}
            <span>对话修改方案</span>
          </button>
        </div>
      </div>
    </div>
  )
}
