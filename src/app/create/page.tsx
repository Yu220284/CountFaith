
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, MapPin, Clock, Users, ArrowRight, Loader2, Landmark, Camera, Palette, Ghost, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateRallyRoute } from '@/ai/flows/generate-rally-route-flow';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';

const themes = [
  { id: 'mystery', name: 'ミステリー', icon: Ghost, description: '隠された謎を解き明かす' },
  { id: 'history', name: '歴史・文化', icon: Landmark, description: '土地の歴史を深く知る' },
  { id: 'gourmet', name: 'ローカルフード', icon: Utensils, description: '絶品グルメを堪能する' },
  { id: 'photogenic', name: '映えスポット', icon: Camera, description: '最高の写真を撮影する' },
];

export default function CreateRallyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    theme: 'mystery',
    durationHours: 3,
    audience: 'friends'
  });

  const logoUrl = (PlaceHolderImages || []).find(img => img.id === 'logo')?.imageUrl || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateRallyRoute({
        location: formData.location,
        theme: formData.theme,
        durationHours: formData.durationHours
      });

      const rallyId = Math.random().toString(36).substring(7);
      localStorage.setItem(`rally_${rallyId}`, JSON.stringify(result));
      
      toast({
        title: "プラン生成完了！",
        description: "AIが最適なルートを設計しました。エディターで確認しましょう。",
      });

      router.push(`/rallies/${rallyId}/edit`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "生成に失敗しました",
        description: "しばらく時間をおいて再度お試しください。",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowRight className="rotate-180" />
            </Button>
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={28} height={28} className="rounded-md object-contain" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">P</div>
            )}
            <span className="font-bold text-xl text-primary">ラリーを作成</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">冒険の条件を入力</h1>
          <p className="text-muted-foreground">AIがあなたの要望にぴったりのスタンプラリープランを作成します。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                開催場所
              </CardTitle>
              <CardDescription>ラリーをどこで開催しますか？市区町村や駅名を入力してください。</CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="例: 東京都 浅草、京都市 北山区" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                className="h-12"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                テーマ・キーワード
              </CardTitle>
              <CardDescription>ラリーの雰囲気を決めましょう。</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue="mystery" 
                onValueChange={(val) => setFormData({...formData, theme: val})}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {themes.map((theme) => (
                  <div key={theme.id}>
                    <RadioGroupItem
                      value={theme.id}
                      id={theme.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={theme.id}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <theme.icon className="mb-3 h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-bold">{theme.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{theme.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  所要時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="3" 
                  onValueChange={(val) => setFormData({...formData, durationHours: parseInt(val)})}
                  className="flex gap-4"
                >
                  {[1, 3, 5, 8].map((h) => (
                    <div key={h} className="flex-1">
                      <RadioGroupItem value={h.toString()} id={`h-${h}`} className="peer sr-only" />
                      <Label
                        htmlFor={`h-${h}`}
                        className="flex items-center justify-center h-10 rounded-lg border-2 border-muted bg-popover hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        {h}h
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  ターゲット層
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="friends" 
                  onValueChange={(val) => setFormData({...formData, audience: val})}
                  className="grid grid-cols-2 gap-2"
                >
                  {['友人', '家族', 'カップル', 'ソロ'].map((a) => (
                    <div key={a}>
                      <RadioGroupItem value={a} id={`a-${a}`} className="peer sr-only" />
                      <Label
                        htmlFor={`a-${a}`}
                        className="flex items-center justify-center h-10 rounded-lg border-2 border-muted bg-popover hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-xs transition-all"
                      >
                        {a}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="flex pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/30"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AIがプランを構築中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  ラリープランを生成する
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
