"use client"

import { Zap, RefreshCw, ArrowRight } from "lucide-react"

interface MiddlePanelProps {
  selectedScheme: number
  onSelectScheme: (index: number) => void
}

const schemes = [
  {
    id: 1,
    tag: "KG 循约索降场",
    title: "模块化极简环保咖啡机",
    description:
      "本方向严格执行循迹推导的 PCR 材料导卡相连接策略，部件外壳采用生物基聚乳酸，内部加热组件遵循独立模块化设计，彻底规避了传统的超声波焊接，用户在办公场景下只需简单手...",
    sketch: "AI GENERATED SKETCH_1",
  },
  {
    id: 2,
    tag: "企业知识库驱动",
    title: "长效维护智选方案",
    description:
      "侧重于利用企业资料库中的标准项目手册进行完全设计削减。通过隐藏式一体化温控模块减少布线接插，外壳采用阻燃堆层化铝与再生塑料混合结构，内置自诊断系统引导用户进行预防...",
    sketch: "AI GENERATED SKETCH_2",
  },
  {
    id: 3,
    tag: "算法迭代案驱动",
    title: "循环驱引导能",
    description:
      "该方向侧重于产品生命终点的行为引导。通过 DfS 组发的模居式装快结构，当产品到达预设寿命时，通过 NFC 引导用户触发物理理开关实现元器件与外壳的快速分离，能耗零件做...",
    sketch: "AI GENERATED SKETCH_3",
  },
]

export function MiddlePanel({ selectedScheme, onSelectScheme }: MiddlePanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium tracking-wider text-gray-300">CONCEPT DIVERGENCE</span>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Subheader */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-gray-600">◎</span>
          <span>发散方向（LLM OUTPUT & SKETCH PLUGIN）</span>
        </div>
      </div>

      {/* Schemes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {schemes.map((scheme, index) => (
          <div
            key={scheme.id}
            className={`bg-[#151515] border rounded-xl overflow-hidden transition-all cursor-pointer ${
              selectedScheme === index
                ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                : "border-gray-800 hover:border-gray-700"
            }`}
            onClick={() => onSelectScheme(index)}
          >
            <div className="flex">
              {/* Sketch Area */}
              <div className="w-40 h-36 bg-[#1a1a1a] flex items-center justify-center border-r border-gray-800 flex-shrink-0">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-600 font-mono">[ {scheme.sketch} ]</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="mb-2">
                  <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                    {scheme.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{scheme.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{scheme.description}</p>
                <button className="mt-3 flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors">
                  深化此方向方案
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-center gap-8 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">简易方案展示</span>
          </div>
          <div className="flex flex-col items-start text-cyan-400">
            <span>方案名称</span>
            <span>方案简介</span>
            <span>知识图谱的推演路径</span>
          </div>
        </div>
      </div>
    </div>
  )
}
