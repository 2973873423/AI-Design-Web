import { NextRequest, NextResponse } from 'next/server';

// 扣子官方标准：发起/查询工作流 代理接口
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = process.env.NEXT_PUBLIC_COZE_TOKEN!;

    // 🔥 官方固定接口地址（无任何拼接）
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("✅ 官方接口真实返回：", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("代理失败：", error);
    return NextResponse.json({ code: -1, msg: "服务器错误" }, { status: 500 });
  }
}