"use client"
import { Zap, RefreshCw, Loader2, ArrowRight } from "lucide-react"
import { useWorkflow } from "@/app/context";

function ConceptCard({
  option,
  tag,
  tagColor,
  title,
  description,
  isSelected = false,
  isLoading,
  onSelect,
}: {
  option: string;
  tag: string;
  tagColor: "emerald" | "amber" | "cyan";
  title: string;
  description: string;
  isSelected?: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
}) {
  const tagColorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  };
  const isDisabled = isLoading || isSelected;

  return (
    <div
      className={`bg-[#131820] border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? "border-cyan-500/50 ring-1 ring-cyan-500/20"
          : "border-[#1e2530] hover:border-[#2a3545]"
      } ${isDisabled ? "opacity-80" : ""}`}
    >
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] px-2 py-0.5 rounded border ${tagColorClasses[tagColor]}`}>
            {tag}
          </span>
          <span className="text-[10px] text-muted-foreground/50 tracking-wide">方案 {option}</span>
        </div>
        <h4 className="text-sm font-medium text-foreground leading-tight">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {description || "方案描述：待工作流生成..."}
        </p>
        <button
          onClick={onSelect}
          disabled={isDisabled}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#1a2030] border border-[#2a3545] text-xs text-foreground/80 hover:bg-[#1e2535] hover:border-[#3a4555] transition-colors disabled:bg-[#1a2030]/50 disabled:border-[#2a3545]/50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
          {isSelected ? "已选择此方案" : isLoading ? "深化中..." : "深化此方向方案"}
          {!isDisabled && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function ConceptDivergence() {
  const { formData, workflowStatus, workflowOutputs, selectedOption, resumeWorkflow, startWorkflow } = useWorkflow();

  const canRerunWf1 =
    Boolean(formData.what?.trim()) && workflowStatus !== "running" && workflowStatus !== "resuming";
  const isResuming = workflowStatus === "resuming";
  const hasData = Object.keys(workflowOutputs).length > 0;
  const schemeA = workflowOutputs.output1 ?? "";
  const schemeB = workflowOutputs.output2 ?? "";
  const schemeC = workflowOutputs.output3 ?? "";

  const handleSelectOption = (option: "A" | "B" | "C") => () => {
    resumeWorkflow(option);
  };

  return (
    <div className="flex-1 min-w-[300px] max-w-[340px] h-full bg-[#0d1117] border-r border-[#1e2530] flex flex-col relative">
      <div className="p-4 border-b border-[#1e2530] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wider text-amber-400">CONCEPT DIVERGENCE</h2>
        </div>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-[#1e2530] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!canRerunWf1}
          title="重新执行工作流1（与左侧提交需求相同）"
          onClick={() => void startWorkflow()}
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="px-4 py-3 border-b border-[#1e2530] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-amber-400/60" />
          <span>发散方向（LLM OUTPUT & SKETCH PLUGIN）</span>
        </div>
        {workflowStatus === "running" && (
          <div className="flex items-center gap-1 text-[10px] text-amber-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>生成中...</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!hasData && workflowStatus !== "running" && (
          <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/50">
            请先在左侧提交需求，生成发散方案
          </div>
        )}

        {hasData && (
          <>
            <ConceptCard
              option="A"
              tag="KG 规约驱动"
              tagColor="emerald"
              title="模块化极简环保方案"
              description={schemeA}
              isSelected={selectedOption === "A"}
              isLoading={isResuming}
              onSelect={handleSelectOption("A")}
            />
            <ConceptCard
              option="B"
              tag="企业知识库驱动"
              tagColor="amber"
              title="长效维护智造方案"
              description={schemeB}
              isSelected={selectedOption === "B"}
              isLoading={isResuming}
              onSelect={handleSelectOption("B")}
            />
            <ConceptCard
              option="C"
              tag="策略启发器驱动"
              tagColor="cyan"
              title="闭环回收引导方案"
              description={schemeC}
              isSelected={selectedOption === "C"}
              isLoading={isResuming}
              onSelect={handleSelectOption("C")}
            />
          </>
        )}
      </div>
    </div>
  );
}
