import { NextRequest, NextResponse } from 'next/server';
import { SandboxInstance } from '@blaxel/core';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { site, pharmacists } = body;
  
  const optimal = pharmacists.sort((a: any, b: any) => 
    (a.distance || 0) * 0.7 + (20 - a.experience) * 0.3 - 
    ((b.distance || 0) * 0.7 + (20 - b.experience) * 0.3)
  )[0];

  const questData = {
    site_id: site.id,
    pharmacist_id: optimal.id,
    reward: site.riskLevel === 'high' ? 15000 : site.riskLevel === 'medium' ? 10000 : 7000,
    risk_level: site.riskLevel,
    timestamp: new Date().toISOString()
  };

  try {
    // Blaxel Sandboxを作成（API Keyを明示的に指定）
    const sandbox = await SandboxInstance.createIfNotExists({
      name: 'countfaith-checks',
      image: 'blaxel/node:latest',
      memory: 2048,
      region: 'us-pdx-1',
      apiKey: process.env.BLAXEL_API_KEY
    });

    await sandbox.fs.write('/checks/' + Date.now() + '.json', JSON.stringify(questData));
    console.log('Blaxel sandbox write successful');
  } catch (error) {
    console.error('Blaxel sandbox error:', error);
  }
  
  return NextResponse.json({
    id: `q-${Date.now()}`,
    siteId: site.id,
    pharmacistId: optimal.id,
    status: 'assigned',
    reward: questData.reward,
    createdAt: new Date()
  });
}
