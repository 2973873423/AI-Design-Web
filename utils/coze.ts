import {
  CozeAPI,
  WorkflowEventType,
  type WorkflowEventMessage,
  type WorkflowEventError,
} from '@coze/api';

const token = process.env.NEXT_PUBLIC_COZE_TOKEN!;

/** 工作流1：生成方案与中间输出 */
export const WORKFLOW_1_ID = '7622249416833957914';
/** 工作流2：深化方案（接收 WF1 的 demand/body1/body2/xuqiu + 用户选择的 shenhua） */
export const WORKFLOW_2_ID = '7622250826450714658';

const apiClient = new CozeAPI({
  token,
  baseURL: 'https://api.coze.cn',
  allowPersonalAccessTokenInBrowser: true,
});

export interface RunWorkflowParams {
  demand: string;
  celue?: string;
  imageFileId?: string;
  docFileId?: string;
  txtFileId?: string;
}

export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'resuming' | 'completed' | 'failed';

export interface WorkflowOutputs {
  output0?: string;
  output1?: string;
  output2?: string;
  output3?: string;
  output4?: string;
  output5?: string;
  output6?: string;
  output7?: string;
  output?: string;
  /** 工作流1结束节点回传的字段，供工作流2开始节点使用 */
  demand?: string;
  body1?: string;
  body2?: string;
  xuqiu?: string;
  img?: string;
  /** wf2 深化结果：由合并时从 wf2 的 output1/2/3 映射，避免覆盖 wf1 的 output1~3 */
  dossierImage?: string;
  dossierText?: string;
  /** wf2 output3：补充说明等 */
  dossierText2?: string;
  [key: string]: any;
}

export interface Workflow2Input {
  demand: string;
  body1: string;
  body2: string;
  xuqiu: string;
  /** 用户在前端选择的深化方向，对应开始节点参数 shenhua */
  shenhua: string;
  /** wf1 输出给 wf2 的图片参数 */
  img?: string;
}

const formatFileParam = (fileId?: string) => {
  if (!fileId) return undefined;
  return { file_id: fileId };
};

function buildWorkflow1Parameters(params: RunWorkflowParams) {
  return {
    demand: params.demand,
    celue: params.celue || '',
    image: formatFileParam(params.imageFileId),
    doc: formatFileParam(params.docFileId),
    txt: formatFileParam(params.txtFileId),
  };
}

function mergeMessageIntoOutputs(outputs: WorkflowOutputs, msg: WorkflowEventMessage) {
  if (msg.ext && typeof msg.ext === 'object') {
    Object.assign(outputs, msg.ext);
  }
  const c = msg.content?.trim();
  if (!c) return;
  try {
    const p = JSON.parse(c) as unknown;
    if (typeof p === 'object' && p !== null && !Array.isArray(p)) {
      Object.assign(outputs, p as WorkflowOutputs);
    }
  } catch {
    if (msg.node_title) {
      const k = `node_${String(msg.node_title).replace(/\s+/g, '_')}`;
      (outputs as Record<string, unknown>)[k] = msg.content;
    }
    outputs._last_text = msg.content;
  }
}

async function consumeStreamUntilDone(
  workflowId: string,
  parameters: Record<string, unknown>
): Promise<WorkflowOutputs> {
  const outputs: WorkflowOutputs = {};
  const stream = apiClient.workflows.runs.stream({
    workflow_id: workflowId,
    parameters,
  });

  for await (const ev of stream) {
    const kind = ev.event as string;
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Coze stream]', workflowId.slice(-6), kind, kind === 'Message' ? (ev.data as WorkflowEventMessage)?.node_title : '');
    }

    if (kind === WorkflowEventType.ERROR || kind === 'Error') {
      const d = ev.data as WorkflowEventError;
      throw new Error(d.error_message || String(d.error_code));
    }
    if ((kind === WorkflowEventType.MESSAGE || kind === 'Message') && ev.data) {
      mergeMessageIntoOutputs(outputs, ev.data as WorkflowEventMessage);
    }
    if (kind === WorkflowEventType.DONE || kind === 'Done') {
      return outputs;
    }
  }

  return outputs;
}

/** 工作流1：流式运行直至结束，合并 output0~7、demand、body1、body2、xuqiu 等 */
export async function runWorkflow1StreamUntilDone(params: RunWorkflowParams): Promise<WorkflowOutputs> {
  return consumeStreamUntilDone(WORKFLOW_1_ID, buildWorkflow1Parameters(params));
}

/** 工作流2：传入 WF1 输出 + 用户选择的 shenhua（一般为 A/B/C） */
export async function runWorkflow2StreamUntilDone(input: Workflow2Input): Promise<WorkflowOutputs> {
  const parameters = {
    demand: input.demand,
    body1: input.body1,
    body2: input.body2,
    xuqiu: input.xuqiu,
    shenhua: input.shenhua,
    img: input.img || '',
  };
  return consumeStreamUntilDone(WORKFLOW_2_ID, parameters);
}

export async function runWorkflow(params: RunWorkflowParams) {
  try {
    const res = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_1_ID,
        parameters: buildWorkflow1Parameters(params),
        is_async: true,
      }),
    });

    const data = await res.json();
    if (data.code !== 0) throw new Error(data.msg);

    const runId = data.data?.execute_id ?? data.execute_id;
    if (!runId) throw new Error('未获取到执行ID');

    return runId;
  } catch (err) {
    console.error('发起工作流失败：', err);
    throw err;
  }
}

function extractInterruptIdDeep(value: unknown, depth = 0): string {
  if (depth > 10 || value == null) return '';
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s.startsWith('{') && !s.startsWith('[')) return '';
    try {
      return extractInterruptIdDeep(JSON.parse(s), depth + 1);
    } catch {
      return '';
    }
  }
  if (typeof value !== 'object' || Array.isArray(value)) return '';
  const o = value as Record<string, unknown>;
  if (o.interrupt_id != null) return String(o.interrupt_id);
  if (o.interruptId != null) return String(o.interruptId);
  const id = (o.interrupt_data as { event_id?: string } | undefined)?.event_id;
  if (id != null) return String(id);
  for (const v of Object.values(o)) {
    const found = extractInterruptIdDeep(v, depth + 1);
    if (found) return found;
  }
  return '';
}

function parseHistoryOutput(output: string): { outputs: WorkflowOutputs; interruptId: string } {
  const outputs: WorkflowOutputs = {};
  let interruptId = '';
  if (!output?.trim()) return { outputs, interruptId };

  let parsed: Record<string, unknown>;
  try {
    let v: unknown = JSON.parse(output.trim());
    if (typeof v === 'string') v = JSON.parse(v);
    if (typeof v !== 'object' || v === null || Array.isArray(v)) {
      return { outputs, interruptId };
    }
    parsed = v as Record<string, unknown>;
  } catch {
    return { outputs, interruptId };
  }

  Object.assign(outputs, parsed);

  const interruptData = parsed.interrupt_data as { event_id?: string } | undefined;
  interruptId =
    (parsed.interrupt_id != null ? String(parsed.interrupt_id) : '') ||
    (parsed.interruptId != null ? String(parsed.interruptId) : '') ||
    (interruptData?.event_id != null ? String(interruptData.event_id) : '') ||
    (parsed.event_id != null ? String(parsed.event_id) : '');

  if (!interruptId) {
    interruptId = extractInterruptIdDeep(parsed);
  }

  return { outputs, interruptId };
}

export async function getWorkflowRunResult(runId: string) {
  try {
    const raw = await apiClient.workflows.runs.history(WORKFLOW_1_ID, runId);
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const h = list[list.length - 1];
    if (!h) {
      return { status: 'running' as const, outputs: {} as WorkflowOutputs, interruptId: '' };
    }

    const es = String(h.execute_status);
    if (es === 'Fail' || es === 'FAIL') {
      console.error('工作流执行失败:', h.error_message || h.error_code);
      return { status: 'failed' as const, outputs: {} as WorkflowOutputs, interruptId: '' };
    }

    const { outputs, interruptId } = parseHistoryOutput(h.output || '');

    if (es === 'Running' || es === 'RUNNING') {
      if (interruptId) {
        return { status: 'paused' as const, outputs, interruptId };
      }
      return { status: 'running' as const, outputs: {}, interruptId: '' };
    }

    if (interruptId) {
      return { status: 'paused' as const, outputs, interruptId };
    }
    return { status: 'completed' as const, outputs, interruptId: '' };
  } catch (err) {
    console.error('查询状态失败：', err);
    return { status: 'running', outputs: {}, interruptId: '' };
  }
}

export async function uploadFileToCoze(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('https://api.coze.cn/v1/files/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.code !== 0) throw new Error(data.msg);
    return data.data.id;
  } catch (err) {
    console.error('上传失败：', err);
    throw err;
  }
}
