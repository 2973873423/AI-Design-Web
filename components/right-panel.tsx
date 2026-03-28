"use client"

import { Circle, Expand, MessageSquare } from "lucide-react"

export function RightPanel() {
  return (
    <div className="w-[480px] flex-shrink-0 flex flex-col bg-[#0f0f0f]">
      {/* Header — 固定顶部，与中间面板一致 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium tracking-wider text-gray-300">DETAILED SOLUTION DOSSIER</span>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Expand className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 可滚动内容区 — flex-1 overflow-y-auto，与中间面板 schemes list 一致 */}
      <div className="flex-1 overflow-y-auto">
        {/* Save Button */}
        <div className="flex justify-end px-4 pt-4">
          <button className="bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
            保存方案
          </button>
        </div>

        {/* Preview Image */}
        <div className="px-4 pt-2">
          <div className="relative bg-gradient-to-br from-[#1a2a3a] to-[#0a1520] rounded-xl overflow-hidden aspect-video">
            {/* 3D Preview Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0088aa" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="50,5 95,50 50,95 5,50"
                      fill="url(#diamondGrad)"
                      stroke="#00d4ff"
                      strokeWidth="1"
                    />
                    <polygon points="50,5 95,50 50,50" fill="rgba(0,212,255,0.3)" />
                    <polygon points="50,50 95,50 50,95" fill="rgba(0,136,170,0.5)" />
                    <polygon points="5,50 50,50 50,95" fill="rgba(0,100,130,0.6)" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expand Button */}
            <button className="absolute top-3 right-3 w-8 h-8 bg-cyan-500 hover:bg-cyan-400 rounded-lg flex items-center justify-center transition-colors">
              <Expand className="w-4 h-4 text-white" />
            </button>

            {/* Preview Label */}
            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400">
              [ 查看产品鸟瞰渲染，方案 A 渲染图主模型 ]
            </div>
          </div>

          {/* Render Type Tabs */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-transparent border border-gray-600 rounded-lg text-xs text-gray-300 hover:border-gray-500 transition-colors">
              Photorealistic Render
            </button>
            <button className="px-3 py-1.5 bg-transparent border border-gray-700 rounded-lg text-xs text-gray-500 hover:border-gray-600 transition-colors">
              8K / Unreal Engine 5
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-white mb-1">方向 A：极简主义生物舱 - 深度细化方案</h2>
          <p className="text-xs text-cyan-500 font-mono tracking-wider">ECO-CONCEPT DEFINITION REPORT v1.0</p>
        </div>

        {/* Content Sections */}
        <div className="px-4 py-4 space-y-6">
          {/* Section 1 */}
          <div>
            <h3 className="text-cyan-400 text-sm font-medium mb-2">• 情境与功能设定</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              本方案专为 20-30 岁居住在都市紧凑型公寓的青年设计，考虑到用户晨间时间碎片化，产品集成了瞬时加热与自动自清洁功能。外观采用低饱和度色调，减少视觉冗余，使其融入书桌或床头等非传统厨房区域。
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-cyan-400 text-sm font-medium mb-2">• 用户行为与交互引导</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              交互设计遵循"无意识设计"原则。当用户接近时，呼吸灯引导放置杯具；对低碳行为，系统通过外壳的纹理变化提示材料使用寿命；在产品报废阶段，内嵌的RFID芯片将引导用户通过手势触发"一键拆解"模式，自动分离核心元器件与塑料外壳。
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-cyan-400 text-sm font-medium mb-2">• 材料与结构说明</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              主体外壳采用 30% PCR 聚丙烯与天然竹纤维复合注塑，表面通过物理喷砂工艺替代喷涂，减少 VOC 排放。内部加热模块采用干式加热技术，无需水路清洗，延长使用寿命至 8 年以上。
            </p>
          </div>

          {/* Right Side Actions — 贴右侧浮动按钮组 */}
          <div className="flex justify-end gap-2">
            <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
              <div className="w-4 h-4 border-2 border-gray-400 rounded" />
            </button>
            <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 底部操作栏 — 固定底部，与中间面板 Bottom Info 一致 */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-3 text-center transition-colors">
            <span className="text-sm text-gray-300">对话</span>
          </button>
          <button className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3 text-center transition-colors">
            <span className="text-sm text-cyan-400">深化的方案（文字+图片）</span>
          </button>
        </div>
        <button className="w-full mt-3 bg-transparent hover:bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center transition-colors">
          <span className="text-sm text-cyan-400">对话修改方案</span>
        </button>
      </div>
    </div>
  )
}
