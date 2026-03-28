"use client"

import { useState } from "react"
import { Settings, User, Package, MapPin, Clock, Heart, Zap, Upload, Check } from "lucide-react"
import { useWorkflow } from "@/app/context"

type StrategyKey =
  | "prolongLife"
  | "reduceMaterial"
  | "reduceEnergy"
  | "prolongMaterial"
  | "reduceToxicity"
  | "resourceConservation"

export function LeftPanel() {
  const { strategies, updateStrategy } = useWorkflow()
  const [activeTab, setActiveTab] = useState<"5w1h" | "assets">("5w1h")

  const toggleCheckbox = (key: StrategyKey) => {
    updateStrategy(key, !strategies[key])
  }

  return (
    <div className="w-[420px] flex-shrink-0 border-r border-gray-800 flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span className="text-xl font-bold">AI-CST</span>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">v2.5</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("5w1h")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "5w1h"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          5W1H 定义
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "assets"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          资产/知识库
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "5w1h" ? (
          <div className="space-y-4">
            {/* Who */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <User className="w-4 h-4" />
                <span>Who (目标人群)</span>
              </div>
              <input
                type="text"
                placeholder="如：独居白领/环保主义者"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* What */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Package className="w-4 h-4" />
                <span>What (核心产品)</span>
              </div>
              <input
                type="text"
                placeholder="如：便携式胶囊咖啡机"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Where */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Where (使用环境)</span>
              </div>
              <input
                type="text"
                placeholder="如：紧凑型公寓/办公室"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* When */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>When (使用时段)</span>
              </div>
              <input
                type="text"
                placeholder="如：早晨唤醒/午后提神"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Why */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Heart className="w-4 h-4" />
                <span>Why (核心痛点)</span>
              </div>
              <input
                type="text"
                placeholder="如：清洗困难/耗能高"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* How */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4" />
                <span>How (交互方式)</span>
              </div>
              <input
                type="text"
                placeholder={"如：触控/语音/自适应"}
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* 低碳策略优先级 */}
            <div className="mt-6">
              <h3 className="text-sm text-gray-400 mb-3">低碳策略优先级</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("prolongLife")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.prolongLife ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.prolongLife && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">延长使用寿命 / 提高产品的使用率</span>
                </label>

                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("reduceMaterial")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.reduceMaterial ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.reduceMaterial && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">降低材料消耗</span>
                </label>

                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("reduceEnergy")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.reduceEnergy ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.reduceEnergy && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">降低能源消耗</span>
                </label>

                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("prolongMaterial")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.prolongMaterial ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.prolongMaterial && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">延长材料生命周期</span>
                </label>

                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("reduceToxicity")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.reduceToxicity ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.reduceToxicity && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">降低毒性</span>
                </label>

                <label className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gray-600 transition-colors">
                  <div
                    onClick={() => toggleCheckbox("resourceConservation")}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      strategies.resourceConservation ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  >
                    {strategies.resourceConservation && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-300">资源保护 / 生物相容性</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg">
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-500">上传企业材料/相关文件</p>
          </div>
        )}
      </div>

      {/* 左侧标注 */}
      <div className="absolute left-0 top-1/4 -translate-x-full pr-4">
        <div className="text-cyan-400 text-sm whitespace-nowrap">输入文本框</div>
      </div>
      <div className="absolute left-0 top-1/2 -translate-x-full pr-4">
        <div className="text-cyan-400 text-sm whitespace-nowrap">勾几个侧重</div>
      </div>
      <div className="absolute left-0 bottom-1/4 -translate-x-full pr-4">
        <div className="text-cyan-400 text-sm whitespace-nowrap">现有材料输入</div>
      </div>
    </div>
  )
}
