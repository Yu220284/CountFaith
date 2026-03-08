import { NextRequest, NextResponse } from 'next/server';
import { SandboxInstance } from '@blaxel/core';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questId, pharmacistId, lotNumber, verified } = body;
  
  const proofData = {
    quest_id: questId,
    pharmacist_id: pharmacistId,
    lot_number: lotNumber,
    verified,
    timestamp: new Date().toISOString()
  };

  const signature = `sig-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const sandbox = await SandboxInstance.createIfNotExists({
      name: 'countfaith-checks',
      image: 'blaxel/node:latest',
      memory: 2048,
      region: 'us-pdx-1',
      apiKey: process.env.BLAXEL_API_KEY
    });

    await sandbox.fs.write('/proofs/' + Date.now() + '.json', JSON.stringify({...proofData, signature}));
    console.log('Blaxel proof write successful');
  } catch (error) {
    console.error('Blaxel sandbox error:', error);
  }
  
  return NextResponse.json({
    id: `pof-${Date.now()}`,
    questId,
    pharmacistId,
    lotNumber,
    verified,
    signature,
    timestamp: new Date()
  });
}
