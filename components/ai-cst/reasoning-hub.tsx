"use client"
import { Sparkles, FileText, Zap, Play, Loader2 } from "lucide-react"
import { useWorkflow } from "@/app/context";

// 推理步骤组件
interface ReasoningStepProps {
  stepNumber: number
  icon: React.ReactNode
  title: string
  content: React.ReactNode
  isEmpty?: boolean
}

function ReasoningStep({ stepNumber, icon, title, content, isEmpty = false }: ReasoningStepProps) {
  return (
    <div className="relative pl-8">
      {/* 步骤指示器 + 连接线 */}
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-[#1a2030] border border-[#2a3545] flex items-center justify-center">
          {icon}
        </div>
        <div className="w-px h-full bg-[#1e2530] mt-1"></div>
      </div>
      
      {/* 内容 */}
      <div className="pb-5">
        <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-emerald-500 font-semibold">步骤 {stepNumber}:</span>
          <span className="text-foreground/90">{title}</span>
        </h4>
        {isEmpty ? (
          <div className="text-[10px] text-muted-foreground/50 italic">暂无数据，等待工作流生成...</div>
        ) : (
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

// 方向标签组件
interface DirectionTagProps {
  label: string
  isActive?: boolean
}

function DirectionTag({ label, isActive = false }: DirectionTagProps) {
  return (
    <div className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
      isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-[#1a2030] text-muted-foreground/80"
    }`}>
      <Play className="w-2.5 h-2.5 fill-current" />
      <span>{label}</span>
    </div>
  )
}

export function ReasoningHub() {
  // 获取全局上下文
  const { workflowStatus, workflowOutputs, selectedOption } = useWorkflow();
  const isLoading = workflowStatus === 'running' || workflowStatus === 'resuming';
  const hasData = Object.keys(workflowOutputs).length > 0;

  const safeOutputs = workflowOutputs || {}; // 加了空值兜底

  // 匹配工作流输出：output0/4/5/6/7
  const intentAnalysis = workflowOutputs.output0; // 步骤1：意图深度解析
  const directionA依据 = workflowOutputs.output4; // 方向A推导依据
  const directionB依据 = workflowOutputs.output5; // 方向B推导依据
  const directionC依据 = workflowOutputs.output6; // 方向C推导依据
  const strategyFusion = workflowOutputs.output7;  // 步骤3：策略启发融合

  return (
    <div className="flex-1 min-w-[280px] max-w-[320px] h-full bg-[#0d1117] border-r border-[#1e2530] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1e2530] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <h2 className="text-sm font-semibold tracking-wider text-emerald-500">REASONING HUB</h2>
      </div>
      {/* Subheader */}
      <div className="px-4 py-2.5 border-b border-[#1e2530] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Sparkles className="w-3 h-3 text-muted-foreground/60" />
          <span>后台思维链（COT）</span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-500">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>加载中...</span>
          </div>
        )}
      </div>
      {/* Steps Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 步骤1：意图深度解析（绑定output0） */}
        <ReasoningStep
          stepNumber={1}
          icon={<div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          title="意图深度解析"
          content={
            <div className="bg-[#131820] border border-[#1e2530] rounded p-2.5 mt-1.5">
              <p>{intentAnalysis || "提取核心目标：待生成..."}</p>
            </div>
          }
          isEmpty={!hasData && !isLoading}
        />
        {/* 步骤2：知识图谱规则映射（绑定output4/5/6） */}
        <ReasoningStep
          stepNumber={2}
          icon={<FileText className="w-2.5 h-2.5 text-muted-foreground" />}
          title="知识图谱 (KG) 规则映射"
          content={
            <div className="space-y-2.5 mt-1.5">
              <DirectionTag label="方向 A 推导依据" isActive={selectedOption === 'A'} />
              <div className="bg-[#131820] border border-[#1e2530] rounded p-2.5 text-[10px]">
                <p>{directionA依据 || "待生成..."}</p>
              </div>
              
              <DirectionTag label="方向 B 推导依据" isActive={selectedOption === 'B'} />
              <div className="bg-[#131820] border border-[#1e2530] rounded p-2.5 text-[10px]">
                <p>{directionB依据 || "待生成..."}</p>
              </div>
              
              <DirectionTag label="方向 C 推导依据" isActive={selectedOption === 'C'} />
              <div className="bg-[#131820] border border-[#1e2530] rounded p-2.5 text-[10px]">
                <p>{directionC依据 || "待生成..."}</p>
              </div>
            </div>
          }
          isEmpty={!hasData && !isLoading}
        />
        {/* 步骤3：策略启发融合（绑定output7） */}
        <ReasoningStep
          stepNumber={3}
          icon={<Zap className="w-2.5 h-2.5 text-amber-500" />}
          title="策略启发 (DHS) 融合"
          content={
            <div className="bg-[#131820] border border-[#1e2530] rounded p-2.5 mt-1.5">
              <p>{strategyFusion || "叠加低碳策略：待生成..."}</p>
            </div>
          }
          isEmpty={!hasData && !isLoading}
        />
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-[#1e2530]">
        <div className="flex flex-col items-center justify-center py-1.5 text-center">
          <div className="text-[10px] text-emerald-500 tracking-widest font-medium">
            {workflowStatus === 'paused' || workflowStatus === 'completed' 
              ? "RETRIEVAL SYNCHRONIZED" 
              : "WAITING FOR SYNC"}
          </div>
          <div className="text-[10px] text-emerald-500/50 mt-0.5">
            {hasData ? "(7 RULES MAPPED)" : "(0 RULES MAPPED)"}
          </div>
        </div>
      </div>
    </div>
  )
}