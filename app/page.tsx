"use client";
import { WorkflowProvider } from "./context";
import { LeftSidebar } from "@/components/ai-cst/left-sidebar";
import { ReasoningHub } from "@/components/ai-cst/reasoning-hub";
import { ConceptDivergence } from "@/components/ai-cst/concept-divergence";
import { DetailedSolution } from "@/components/ai-cst/detailed-solution";

export default function AIDesignSystem() {
  return (
    <WorkflowProvider>
      <main className="h-screen w-screen overflow-hidden bg-[#0a0e14] flex">
        {/* 左侧：5W1H输入+文件上传+低碳策略 */}
        <LeftSidebar />
        {/* 中左：推理面板（绑定output0/4/5/6/7） */}
        <ReasoningHub />
        {/* 中右：方案发散面板（绑定output1/2/3+恢复工作流） */}
        <ConceptDivergence />
        {/* 最右侧：详细方案面板（绑定结束节点output/output2） */}
        <DetailedSolution />
      </main>
    </WorkflowProvider>
  );
}