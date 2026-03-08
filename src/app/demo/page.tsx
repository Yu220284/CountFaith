'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Users, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Demo() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Step 1: AI分析 - 「影」を見つける',
      icon: Brain,
      content: '利用者のアンケートを集計した結果、世田谷区の第3配送センターを通過したロットの有効率が15%低下しています。',
      highlight: 'AIはこの拠点を「High Risk」と判定しました。',
      color: 'text-red-600'
    },
    {
      title: 'Step 2: 薬剤師検索 - 「光」を見つける',
      icon: Users,
      content: 'Crustdataから半径2km以内に住む3名の潜在薬剤師を選出。',
      highlight: 'その中から最も経験豊富な方に、今、監査チェックを送信しました。',
      color: 'text-blue-600'
    },
    {
      title: 'Step 3: 現場認証 - 「責任」を記録',
      icon: Shield,
      content: '薬剤師がスマホで現場を撮影し、承認ボタンを押す。',
      highlight: 'これでこの拠点の「信頼」が再カウントされました。',
      color: 'text-green-600'
    }
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/image.png" alt="CountFaith" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold">CountFaith Demo</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">The Intelligence Loop</h1>
            <p className="text-xl text-slate-300">AI × Human-in-the-loop Trust</p>
          </div>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-full bg-slate-700 ${currentStep.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-slate-300">{currentStep.content}</p>
              <div className={`p-6 rounded-lg bg-slate-900 border-2 ${currentStep.color.replace('text', 'border')}`}>
                <p className="text-xl font-bold">{currentStep.highlight}</p>
              </div>

              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  前へ
                </Button>
                
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i === step ? 'bg-blue-500' : 'bg-slate-600'}`}
                    />
                  ))}
                </div>

                {step < steps.length - 1 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    次へ <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/dashboard">
                      <CheckCircle2 className="mr-2 w-4 h-4" />
                      ダッシュボードへ
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <blockquote className="text-2xl italic text-slate-300 mb-4">
              "AI doesn't solve the problem alone.<br />
              It empowers the hidden professionals in our society."
            </blockquote>
            <p className="text-slate-400">
              データによる推論と、ヒトによる責任ある行動。<br />
              CountFaithは、この両輪で偽造薬のない世界を作ります。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
