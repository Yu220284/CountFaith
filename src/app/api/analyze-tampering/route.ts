import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const feedbackRes = await fetch(`${request.nextUrl.origin}/api/feedback`);
  const feedbacks = await feedbackRes.json();

  const siteAnalysis = new Map<string, any>();
  
  feedbacks.forEach((fb: any) => {
    const siteId = fb.lotNumber.includes('001') ? 's1' : fb.lotNumber.includes('002') ? 's2' : 's3';
    if (!siteAnalysis.has(siteId)) {
      siteAnalysis.set(siteId, { 
        total: 0, 
        effectivenessSum: 0, 
        sideEffectsCount: 0,
        lots: new Set()
      });
    }
    const data = siteAnalysis.get(siteId);
    data.total++;
    data.effectivenessSum += fb.effectiveness;
    if (fb.sideEffects) data.sideEffectsCount++;
    data.lots.add(fb.lotNumber);
  });

  const results = Array.from(siteAnalysis.entries()).map(([siteId, data]) => {
    const avgEffectiveness = data.total > 0 ? data.effectivenessSum / data.total : 0;
    const riskScore = Math.round((5 - avgEffectiveness) * 20 + (data.sideEffectsCount / data.total) * 30);
    
    return {
      siteId,
      siteName: siteId === 's1' ? '東京中央倉庫' : siteId === 's2' ? '大阪薬局A' : '名古屋病院',
      riskScore: Math.min(riskScore, 100),
      feedbackCount: data.total,
      averageEffectiveness: Math.round(avgEffectiveness * 10) / 10,
      suspiciousLots: avgEffectiveness < 3 ? Array.from(data.lots) : []
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  return NextResponse.json(results);
}
