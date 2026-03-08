import { NextRequest, NextResponse } from 'next/server';

const feedbacks: any[] = [];

export async function POST(request: NextRequest) {
  const feedback = await request.json();
  feedbacks.push(feedback);
  return NextResponse.json({ success: true, id: feedback.id });
}

export async function GET() {
  return NextResponse.json(feedbacks);
}
