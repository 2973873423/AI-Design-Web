"use client"
import { useState } from "react"
import { User, Box, MapPin, Clock, HelpCircle, Hand, Upload, Loader2, FileText, ImageIcon, File, MessageSquare } from "lucide-react"
import { useWorkflow } from "@/app/context";

interface InputFieldProps {
  icon: React.ReactNode
  label: string
  subLabel: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

function InputField({ icon, label, subLabel, placeholder, value, onChange }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="text-muted-foreground/70">{icon}</span>
        <span className="text-foreground/80">{label}</span>
        <span className="text-muted-foreground/50">({subLabel})</span>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#151a25] border border-[#252d3a] rounded px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-emerald-500/40 transition-colors"
      />
    </div>
  )
}

interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function CheckboxItem({ label, checked, onChange, disabled = false }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-2.5 py-2 px-2.5 rounded bg-[#151a25] border border-[#252d3a] cursor-pointer hover:border-[#303a4a] transition-colors">
      <div
        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0 ${
          checked ? "bg-emerald-500 border-emerald-500" : "border-[#404858] bg-transparent"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          if (!disabled) onChange(!checked)
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-[11px] ${disabled ? "text-muted-foreground/50" : "text-foreground/80"}`}>{label}</span>
    </label>
  )
}

function UploadButton({ 
  label, 
  icon, 
  onUpload, 
  loading, 
  disabled
}: { 
  label: string
  icon: React.ReactNode
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  disabled: boolean
}) {
  return (
    <label className="block w-full border-2 border-dashed border-[#2a3545] rounded-lg p-3 cursor-pointer hover:border-emerald-500/30 transition-colors">
      <input
        type="file"
        className="hidden"
        onChange={onUpload}
        disabled={disabled || loading}
      />
      <div className="flex flex-col items-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : icon}
        <span className="text-[10px] text-center">{loading ? "上传中..." : label}</span>
      </div>
    </label>
  )
}

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<"5w1h" | "assets">("5w1h");
  const {
    formData, strategies, uploadLoading, workflowStatus,
    updateFormData, updateStrategy, uploadFile, startWorkflow
  } = useWorkflow();

  const handleFileUpload = (type: 'image' | 'doc' | 'txt') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(type, file);
    e.target.value = '';
  };

  const isDisabled = workflowStatus === 'running' || workflowStatus === 'resuming';

  return (
    <div className="w-[260px] min-w-[260px] h-full bg-[#0d1117] border-r border-[#1e2530] flex flex-col">
      <div className="p-3.5 border-b border-[#1e2530]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-emerald-500 font-semibold text-sm tracking-wide">AI-CST</span>
            <span className="text-emerald-500/50 text-[10px]">v2.5</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#1e2530]">
        <button
          onClick={() => setActiveTab("5w1h")}
          disabled={isDisabled}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "5w1h" ? "text-emerald-500 border-b-2 border-emerald-500 -mb-px" : "text-muted-foreground hover:text-foreground"
          } ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          5W1H定义
        </button>
        <button
          onClick={() => setActiveTab("assets")}
          disabled={isDisabled}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "assets" ? "text-emerald-500 border-b-2 border-emerald-500 -mb-px" : "text-muted-foreground hover:text-foreground"
          } ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          资产/知识库
        </button>
      </div>

      {activeTab === "assets" ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <UploadButton label="上传产品图片" icon={<ImageIcon className="w-4 h-4 text-muted-foreground" />} onUpload={handleFileUpload('image')} loading={uploadLoading.image} disabled={isDisabled} />
          <UploadButton label="上传文档材料" icon={<FileText className="w-4 h-4 text-muted-foreground" />} onUpload={handleFileUpload('doc')} loading={uploadLoading.doc} disabled={isDisabled} />
          <UploadButton label="上传文本文件" icon={<File className="w-4 h-4 text-muted-foreground" />} onUpload={handleFileUpload('txt')} loading={uploadLoading.txt} disabled={isDisabled} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <InputField icon={<User className="w-3 h-3" />} label="Who" subLabel="目标人群" placeholder="如: 独居白领" value={formData.who} onChange={(v) => updateFormData('who', v)} />
          <InputField icon={<Box className="w-3 h-3" />} label="What" subLabel="核心产品" placeholder="如: 便携式咖啡机" value={formData.what} onChange={(v) => updateFormData('what', v)} />
          <InputField icon={<MapPin className="w-3 h-3" />} label="Where" subLabel="使用环境" placeholder="如: 紧凑型公寓" value={formData.where} onChange={(v) => updateFormData('where', v)} />
          <InputField icon={<Clock className="w-3 h-3" />} label="When" subLabel="使用时段" placeholder="如: 早晨唤醒" value={formData.when} onChange={(v) => updateFormData('when', v)} />
          <InputField icon={<HelpCircle className="w-3 h-3" />} label="Why" subLabel="核心痛点" placeholder="如: 清洁困难" value={formData.why} onChange={(v) => updateFormData('why', v)} />
          <InputField icon={<Hand className="w-3 h-3" />} label="How" subLabel="交互方式" placeholder="如: 触控操作" value={formData.how} onChange={(v) => updateFormData('how', v)} />

          <div className="pt-1">
            <InputField icon={<MessageSquare className="w-3 h-3" />} label="Demand" subLabel="补充需求" placeholder="请输入您想要的效果" value={formData.demand} onChange={(v) => updateFormData('demand', v)} />
          </div>
        </div>
      )}

      <div className="p-3 border-t border-[#1e2530]">
        <div className="text-[10px] text-muted-foreground/70 mb-2">低碳策略优先级</div>
        <div className="space-y-1.5">
          <CheckboxItem label="延长使用寿命 / 提高产品的使用率" checked={strategies.prolongLife} onChange={(v) => updateStrategy('prolongLife', v)} disabled={isDisabled} />
          <CheckboxItem label="降低材料消耗" checked={strategies.reduceMaterial} onChange={(v) => updateStrategy('reduceMaterial', v)} disabled={isDisabled} />
          <CheckboxItem label="降低能源消耗" checked={strategies.reduceEnergy} onChange={(v) => updateStrategy('reduceEnergy', v)} disabled={isDisabled} />
          <CheckboxItem label="延长材料生命周期" checked={strategies.prolongMaterial} onChange={(v) => updateStrategy('prolongMaterial', v)} disabled={isDisabled} />
          <CheckboxItem label="降低毒性" checked={strategies.reduceToxicity} onChange={(v) => updateStrategy('reduceToxicity', v)} disabled={isDisabled} />
          <CheckboxItem label="资源保护 / 生物相容性" checked={strategies.resourceConservation} onChange={(v) => updateStrategy('resourceConservation', v)} disabled={isDisabled} />
        </div>
      </div>

      <div className="px-3 pb-3 pt-1">
        <button
          onClick={startWorkflow}
          disabled={isDisabled}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5"
        >
          {workflowStatus === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
          {workflowStatus === 'running'
            ? "生成方案中..."
            : workflowStatus === 'failed'
              ? "上次失败，点击重试"
              : "提交需求并生成方案"}
        </button>
      </div>
    </div>
  )
}