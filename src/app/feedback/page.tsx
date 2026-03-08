'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitFeedback } from '@/lib/countfaith-api';

export default function Feedback() {
  const [lotNumber, setLotNumber] = useState('');
  const [effectiveness, setEffectiveness] = useState(3);
  const [sideEffects, setSideEffects] = useState(false);
  const [sideEffectType, setSideEffectType] = useState<string[]>([]);
  const [sideEffectDetails, setSideEffectDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sideEffectOptions = ['Nausea', 'Headache', 'Dizziness', 'Rash', 'Fatigue', 'Other'];

  const handleScanQR = () => {
    // QRスキャン機能（デモ用にモックデータ）
    setLotNumber('LOT-2026-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
  };

  const toggleSideEffect = (effect: string) => {
    setSideEffectType(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback(lotNumber, `user-${Date.now()}`, effectiveness, sideEffects);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/image.png" alt="CountFaith" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-primary">CountFaith</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Medicine Effectiveness Survey</h1>

          <Card>
            <CardHeader>
              <CardTitle>Please share your experience with the medicine</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-medium">Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="lot">Lot Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="lot"
                        placeholder="LOT-2026-001"
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        required
                      />
                      <Button type="button" variant="outline" onClick={handleScanQR}>
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan QR
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Effectiveness (1-5 scale)</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setEffectiveness(n)}
                          className={`p-2 ${effectiveness >= n ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="side"
                        checked={sideEffects}
                        onChange={(e) => setSideEffects(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="side">Did you experience side effects?</Label>
                    </div>

                    {sideEffects && (
                      <div className="ml-6 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {sideEffectOptions.map((effect) => (
                            <button
                              key={effect}
                              type="button"
                              onClick={() => toggleSideEffect(effect)}
                              className={`p-2 text-sm border rounded ${
                                sideEffectType.includes(effect)
                                  ? 'bg-red-100 border-red-300 text-red-800'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {effect}
                            </button>
                          ))}
                        </div>
                        <div>
                          <Label htmlFor="details">Additional Details</Label>
                          <Textarea
                            id="details"
                            placeholder="Please describe your side effects..."
                            value={sideEffectDetails}
                            onChange={(e) => setSideEffectDetails(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
