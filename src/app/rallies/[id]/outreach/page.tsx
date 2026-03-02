
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mail, CheckCircle2, ChevronLeft, Loader2, Copy, Send, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { generateOutreachEmail } from '@/ai/flows/generate-outreach-email';
import { useToast } from '@/hooks/use-toast';

export default function OutreachPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [rallyData, setRallyData] = useState<any>(null);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [outreachData, setOutreachData] = useState<Record<number, any>>({});

  useEffect(() => {
    const data = localStorage.getItem(`rally_${params.id}`);
    if (data) {
      setRallyData(JSON.parse(data));
    }
  }, [params.id]);

  const handleGenerateEmail = async (index: number) => {
    if (!rallyData) return;
    const spot = rallyData.spots[index];
    setGenerating(true);
    try {
      const result = await generateOutreachEmail({
        rallyName: rallyData.rallyName,
        spotName: spot.name,
        spotAddress: rallyData.location, // Simplified
        rallyTheme: rallyData.theme || '観光',
        organizerName: 'PRA.net User',
        organizerEmail: 'organizer@example.com'
      });
      setOutreachData({ ...outreachData, [index]: result });
      toast({ title: "メール下書きを作成しました" });
    } catch (error) {
      toast({ variant: "destructive", title: "失敗しました" });
    } finally {
      setGenerating(false);
    }
  };

  if (!rallyData) return <div className="p-20 text-center">読み込み中...</div>;

  const currentSpot = rallyData.spots[selectedSpotIndex];
  const currentEmail = outreachData[selectedSpotIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <h1 className="font-bold text-lg">スポット協力依頼ツール</h1>
        </div>
        <div className="text-xs font-semibold text-muted-foreground bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {rallyData.rallyName}
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Spot List Sidebar */}
        <aside className="w-full md:w-80 bg-white border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-xs font-bold text-slate-500 uppercase">協力スポットリスト</h2>
          </div>
          <ScrollArea className="flex-grow">
            <div className="p-2 space-y-1">
              {rallyData.spots.map((spot: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedSpotIndex(i)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedSpotIndex === i ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      selectedSpotIndex === i ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm truncate max-w-[140px]">{spot.name}</span>
                  </div>
                  {outreachData[i] && <CheckCircle2 className={`w-4 h-4 ${selectedSpotIndex === i ? 'text-white' : 'text-green-500'}`} />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-6 md:p-10 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">{currentSpot.name}</h2>
                <p className="text-muted-foreground">{rallyData.location}</p>
              </div>
              {!currentEmail && (
                <Button 
                  onClick={() => handleGenerateEmail(selectedSpotIndex)} 
                  disabled={generating}
                  className="h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/20"
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  協力依頼メールを作成
                </Button>
              )}
            </div>

            {currentEmail ? (
              <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
                <div className="md:col-span-2 space-y-6">
                  <Card className="border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">メール下書き</CardTitle>
                        <CardDescription>AIが作成した協力依頼の文面です。</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          navigator.clipboard.writeText(currentEmail.draftEmail);
                          toast({ title: "コピーしました" });
                        }}>
                          <Copy className="h-4 w-4 mr-2" /> コピー
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Send className="h-4 w-4 mr-2" /> 送信
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-100 font-body">
                        {currentEmail.draftEmail}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-none shadow-xl bg-primary text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Info className="h-5 w-5" /> 公開連絡先情報
                      </CardTitle>
                      <CardDescription className="text-white/70">AIが見つけた公開情報です。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentEmail.contactInfo?.email ? (
                        <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                          <p className="text-[10px] uppercase font-bold opacity-60">Email</p>
                          <p className="font-medium truncate">{currentEmail.contactInfo.email}</p>
                        </div>
                      ) : <p className="text-xs opacity-60 italic">メールアドレスは見つかりませんでした</p>}

                      {currentEmail.contactInfo?.phone && (
                        <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                          <p className="text-[10px] uppercase font-bold opacity-60">Phone</p>
                          <p className="font-medium">{currentEmail.contactInfo.phone}</p>
                        </div>
                      )}

                      {currentEmail.contactInfo?.website && (
                        <Button variant="link" className="text-white h-auto p-0 flex items-center justify-start text-xs opacity-80 hover:opacity-100" asChild>
                          <a href={currentEmail.contactInfo.website} target="_blank" rel="noopener noreferrer">
                            公式サイトを開く <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                    <h4 className="font-bold text-accent text-sm mb-2">交渉のアドバイス</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      このスポットは午後2時〜4時が比較的空いているようです。直接訪問する場合はその時間帯を狙うと良いでしょう。
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-slate-300" />
                </div>
                <div className="max-w-sm">
                  <h3 className="font-bold text-lg text-slate-600">下書きがありません</h3>
                  <p className="text-sm text-slate-400">
                    ボタンを押して、AIに協力依頼メールを作成させましょう。
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
