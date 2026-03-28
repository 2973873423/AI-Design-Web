"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import {
  runWorkflow1StreamUntilDone,
  runWorkflow2StreamUntilDone,
  uploadFileToCoze,
  WorkflowStatus,
  WorkflowOutputs,
  RunWorkflowParams,
} from "@/utils/coze";

interface FormData {
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
  how: string;
  demand: string;
}

interface Strategies {
  prolongLife: boolean;       // 延长使用寿命 / 提高产品的使用率
  reduceMaterial: boolean;    // 降低材料消耗
  reduceEnergy: boolean;      // 降低能源消耗
  prolongMaterial: boolean;   // 延长材料生命周期
  reduceToxicity: boolean;    // 降低毒性
  resourceConservation: boolean; // 资源保护 / 生物相容性
}

interface FileIds {
  imageFileId: string;
  docFileId: string;
  txtFileId: string;
}

interface UploadLoading {
  image: boolean;
  doc: boolean;
  txt: boolean;
}

interface WorkflowContextType {
  formData: FormData;
  strategies: Strategies;
  fileIds: FileIds;
  uploadLoading: UploadLoading;
  workflowStatus: WorkflowStatus;
  workflowOutputs: WorkflowOutputs;
  selectedOption: string | null;
  updateFormData: (key: keyof FormData, value: string) => void;
  updateStrategy: (key: keyof Strategies, value: boolean) => void;
  uploadFile: (type: 'image' | 'doc' | 'txt', file: File) => Promise<void>;
  startWorkflow: () => Promise<void>;
  resumeWorkflow: (option: 'A' | 'B' | 'C') => Promise<void>;
  /** 用当前 wf2 的图文结果 + 补充，重新跑 wf2；成功就返回 true */
  refineDossierWithDialogue: (userAddendum: string) => Promise<boolean>;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    who: "",
    what: "",
    where: "",
    when: "",
    why: "",
    how: "",
    demand: "",
  });
  const [strategies, setStrategies] = useState<Strategies>({
    prolongLife: true,
    reduceMaterial: true,
    reduceEnergy: true,
    prolongMaterial: true,
    reduceToxicity: true,
    resourceConservation: true,
  });
  const [fileIds, setFileIds] = useState<FileIds>({
    imageFileId: "",
    docFileId: "",
    txtFileId: "",
  });
  const [uploadLoading, setUploadLoading] = useState<UploadLoading>({
    image: false,
    doc: false,
    txt: false,
  });

  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('idle');
  const [workflowOutputs, setWorkflowOutputs] = useState<WorkflowOutputs>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const updateFormData = useCallback((key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateStrategy = useCallback((key: keyof Strategies, value: boolean) => {
    setStrategies(prev => ({ ...prev, [key]: value }));
  }, []);

  const uploadFile = useCallback(async (type: 'image' | 'doc' | 'txt', file: File) => {
    setUploadLoading(prev => ({ ...prev, [type]: true }));
    try {
      const fileId = await uploadFileToCoze(file);
      setFileIds(prev => ({ ...prev, [`${type}FileId`]: fileId }));
      alert(`${type === 'image' ? '图片' : type === 'doc' ? '文档' : '文本'}上传成功！`);
    } catch (error) {
      alert(`${type === 'image' ? '图片' : type === 'doc' ? '文档' : '文本'}上传失败，请重试！`);
    } finally {
      setUploadLoading(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  const strategyLabels: Record<keyof Strategies, string> = {
    prolongLife: "延长使用寿命 / 提高产品的使用率",
    reduceMaterial: "降低材料消耗",
    reduceEnergy: "降低能源消耗",
    prolongMaterial: "延长材料生命周期",
    reduceToxicity: "降低毒性",
    resourceConservation: "资源保护 / 生物相容性",
  };

  const generateDemand = useCallback((): string => {
    // 自由补充文本，优先级最高，直接追加在句尾
    const extraDemand = formData.demand.trim()
      ? `。用户补充需求：${formData.demand.trim()}`
      : "";

    const narrative = [
      `目标人群为${formData.who || "未填写"}`,
      `核心产品为${formData.what || "未填写"}`,
      `使用环境为${formData.where || "未填写"}`,
      `使用时段为${formData.when || "未填写"}`,
      `核心痛点为${formData.why || "未填写"}`,
      `交互方式为${formData.how || "未填写"}`,
    ].join("，");

    const selectedStrategies = Object.entries(strategies)
      .filter(([_, checked]) => checked)
      .map(([key]) => strategyLabels[key as keyof Strategies]);
    const strategyText = selectedStrategies.length
      ? `选中低碳策略：${selectedStrategies.join("、")}`
      : "未选择低碳策略";

    return `${narrative}。${strategyText}${extraDemand}`;
  }, [formData, strategies]);

  const generateWorkflowParams = useCallback((): RunWorkflowParams => {
    const demand = generateDemand();
    const celue = Object.entries(strategies)
      .filter(([_, checked]) => checked)
      .map(([key]) => strategyLabels[key as keyof Strategies])
      .join("、");

    return {
      demand,
      celue,
      imageFileId: fileIds.imageFileId || undefined,
      docFileId: fileIds.docFileId || undefined,
      txtFileId: fileIds.txtFileId || undefined,
    };
  }, [formData, strategies, fileIds, generateDemand]);

  const startWorkflow = useCallback(async () => {
    if (!formData.what) {
      alert("请填写核心产品(What)，为必填项！");
      return;
    }

    setWorkflowStatus('running');
    setWorkflowOutputs({});
    setSelectedOption(null);

    try {
      const outputs = await runWorkflow1StreamUntilDone(generateWorkflowParams());
      setWorkflowOutputs(outputs);
      setWorkflowStatus('paused');
    } catch (error) {
      setWorkflowStatus('failed');
      console.error(error);
      alert(
        error instanceof Error
          ? `工作流1执行失败：${error.message}`
          : "发起工作流失败，请检查 Coze Token、网络与工作流配置！"
      );
    }
  }, [formData, generateWorkflowParams]);

  /** wf2 的 output1~3 与 wf1 概念卡字段同名，合并时改写到 dossier*，避免覆盖发散方案 */
  const mergeWorkflow2Results = useCallback((outputs: WorkflowOutputs) => {
    const { output1: wf2Image, output2: wf2Text, output3: wf2Text3, ...wf2Rest } = outputs;
    setWorkflowOutputs((prev) => ({
      ...prev,
      ...wf2Rest,
      ...(wf2Image !== undefined && wf2Image !== ""
        ? {
            dossierImage:
              typeof wf2Image === "string" ? wf2Image : JSON.stringify(wf2Image),
          }
        : {}),
      ...(wf2Text !== undefined && wf2Text !== null && String(wf2Text).trim() !== ""
        ? { dossierText: String(wf2Text) }
        : {}),
      ...(wf2Text3 !== undefined && wf2Text3 !== null && String(wf2Text3).trim() !== ""
        ? { dossierText2: String(wf2Text3) }
        : {}),
    }));
  }, []);

  const resumeWorkflow = useCallback(async (option: 'A' | 'B' | 'C') => {
    // paused：首次深化；completed：已生成过详细方案，可换方向用 wf1 输出重新跑 wf2
    if (workflowStatus !== 'paused' && workflowStatus !== 'completed') return;

    const w = workflowOutputs;
    const demand = String(w.demand ?? generateDemand());
    const body1 = String(w.body1 ?? '');
    const body2 = String(w.body2 ?? '');
    const xuqiu = String(w.xuqiu ?? '');
    const img = String(w.img ?? '');

    setWorkflowStatus('resuming');
    setSelectedOption(option);

    try {
      const outputs = await runWorkflow2StreamUntilDone({
        demand,
        body1,
        body2,
        xuqiu,
        shenhua: option,
        img,
      });
      mergeWorkflow2Results(outputs);
      setWorkflowStatus('completed');
    } catch (error) {
      setWorkflowStatus('failed');
      console.error(error);
      alert(
        error instanceof Error
          ? `工作流2执行失败：${error.message}`
          : "深化方案失败，请重试！"
      );
    }
  }, [workflowStatus, workflowOutputs, generateDemand, mergeWorkflow2Results]);

  const refineDossierWithDialogue = useCallback(
    async (userAddendum: string): Promise<boolean> => {
      if (workflowStatus !== "completed" || !selectedOption) {
        alert("请先完成「深化此方向」生成详细方案后，再使用对话修改。");
        return false;
      }
      if (!["A", "B", "C"].includes(selectedOption)) {
        alert("当前方案方向无效，请重新选择 A/B/C。");
        return false;
      }

      const w = workflowOutputs;
      const dossierText = String(w.dossierText ?? "").trim();
      if (!dossierText) {
        alert("当前没有详细方案正文（output2），无法发起修改。");
        return false;
      }

      const rawImg = w.dossierImage;
      const img = rawImg
        ? typeof rawImg === "string"
          ? rawImg
          : JSON.stringify(rawImg)
        : "";

      const addendum = userAddendum.trim();
      const demand = addendum
        ? `${dossierText}\n\n【对话修改意见】${addendum}`
        : dossierText;

      const body1 = String(w.body1 ?? "");
      const body2 = String(w.body2 ?? "");
      const xuqiu = String(w.xuqiu ?? "");

      setWorkflowStatus("resuming");

      try {
        const outputs = await runWorkflow2StreamUntilDone({
          demand,
          body1,
          body2,
          xuqiu,
          shenhua: selectedOption as "A" | "B" | "C",
          img,
        });
        mergeWorkflow2Results(outputs);
        setWorkflowStatus("completed");
        return true;
      } catch (error) {
        setWorkflowStatus("failed");
        console.error(error);
        alert(
          error instanceof Error
            ? `对话修改失败：${error.message}`
            : "对话修改失败，请重试！"
        );
        return false;
      }
    },
    [workflowStatus, selectedOption, workflowOutputs, mergeWorkflow2Results]
  );

  const resetWorkflow = useCallback(() => {
    setFormData({ who: "", what: "", where: "", when: "", why: "", how: "", demand: "" });
    setStrategies({
      prolongLife: true,
      reduceMaterial: true,
      reduceEnergy: true,
      prolongMaterial: true,
      reduceToxicity: true,
      resourceConservation: true,
    });
    setFileIds({ imageFileId: "", docFileId: "", txtFileId: "" });
    setWorkflowStatus('idle');
    setWorkflowOutputs({});
    setSelectedOption(null);
  }, []);

  const contextValue = {
    formData,
    strategies,
    fileIds,
    uploadLoading,
    workflowStatus,
    workflowOutputs,
    selectedOption,
    updateFormData,
    updateStrategy,
    uploadFile,
    startWorkflow,
    resumeWorkflow,
    refineDossierWithDialogue,
    resetWorkflow,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    console.warn("useWorkflow must be used within a WorkflowProvider");
    return {
      formData: { who: "", what: "", where: "", when: "", why: "", how: "", demand: "" },
      strategies: {
        prolongLife: true,
        reduceMaterial: true,
        reduceEnergy: true,
        prolongMaterial: true,
        reduceToxicity: true,
        resourceConservation: true,
      },
      fileIds: { imageFileId: "", docFileId: "", txtFileId: "" },
      uploadLoading: { image: false, doc: false, txt: false },
      workflowStatus: 'idle' as WorkflowStatus,
      workflowOutputs: {},
      selectedOption: null,
      updateFormData: () => {},
      updateStrategy: () => {},
      uploadFile: async () => {},
      startWorkflow: async () => {},
      resumeWorkflow: async () => {},
      refineDossierWithDialogue: async () => false,
      resetWorkflow: () => {},
    };
  }
  return context;
};
