'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Map as MapIcon, 
  List, 
  ChevronRight, 
  Plus, 
  Save, 
  Share, 
  Edit3, 
  Trash2, 
  MoreVertical,
  CheckCircle2,
  Navigation,
  Sparkles,
  QrCode,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { generateSpotContent } from '@/ai/flows/generate-spot-content';
import { useToast } from '@/hooks/use-toast';

export default function RallyEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [rallyData, setRallyData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('route');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`rally_${params.id}`);
    if (data) {
      setRallyData(JSON.parse(data));
    }
  }, [params.id]);

  const handleGenerateContent = async () => {
    if (!rallyData) return;
    setIsGeneratingContent(true);
    try {
      const spots = rallyData.spots.map((s: any) => ({
        spotName: s.name,
        description: s.description,
        location: rallyData.location
      }));
      
      const content = await generateSpotContent({
        rallyTheme: rallyData.theme || '観光',
        spotDetails: spots
      });

      const updatedSpots = rallyData.spots.map((s: any) => {
        const generated = content?.spotContents?.find((gc: any) => gc.spotName === s.name);
        return { ...s, generatedContent: generated?.generatedContent || '' };
      });

      const updatedRally = { ...rallyData, spots: updatedSpots };
      setRallyData(updatedRally);
      localStorage.setItem(`rally_${params.id}`, JSON.stringify(updatedRally));

      toast({
        title: "コンテンツ生成完了！",
        description: "AIが各スポットのストーリーやクイズを作成しました。",
      });
      setActiveTab('content');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "コンテンツの生成に失敗しました。",
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  if (!rallyData) return <div className="p-20 text-center">読み込み中...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Editor */}
      <div className="w-full md:w-[450px] bg-white border-r flex flex-col h-full shadow-lg z-20">
        <header className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">P</div>
            <div>
              <h1 className="font-bold text-sm truncate max-w-[180px]">{rallyData.rallyName}</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{rallyData.totalEstimatedMinutes}分 • {rallyData.totalWalkingDistanceMeters}m</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Share className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8 rounded-full" onClick={() => toast({ title: "保存しました" })}>
              <Save className="h-4 w-4 mr-1" /> 保存
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-3 rounded-full bg-slate-100 p-1">
              <TabsTrigger value="route" className="rounded-full data-[state=active]:bg-white">ルート</TabsTrigger>
              <TabsTrigger value="content" className="rounded-full data-[state=active]:bg-white">内容</TabsTrigger>
              <TabsTrigger value="assets" className="rounded-full data-[state=active]:bg-white">アセット</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-grow p-4">
            <TabsContent value="route" className="m-0 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">スポット一覧 ({rallyData.spots.length})</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4 mr-1" /> 追加
                </Button>
              </div>

              {rallyData.spots.map((spot: any, index: number) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      {index < rallyData.spots.length - 1 && (
                        <div className="w-[1px] h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm leading-tight">{spot.name}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{spot.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px] font-normal py-0">
                          滞在: {spot.estimatedActivityMinutes}分
                        </Badge>
                        {spot.walkingDistanceToNextSpotMeters && (
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <Navigation className="w-3 h-3 mr-1" /> {spot.walkingDistanceToNextSpotMeters}m
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="pt-6">
                <Button 
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold"
                  onClick={handleGenerateContent}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  AIコンテンツを生成する
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="content" className="m-0 space-y-4">
              <h3 className="font-bold">生成されたコンテンツ</h3>
              <p className="text-xs text-muted-foreground">AIが作成したストーリーやクイズを編集できます。</p>
              
              {rallyData.spots.map((spot: any, index: number) => (
                <div key={index} className="space-y-2 p-4 rounded-xl border bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">スポット {index + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Edit3 className="h-3 w-3" /></Button>
                  </div>
                  <h4 className="font-bold text-sm">{spot.name}</h4>
                  <p className="text-sm italic text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                    {spot.generatedContent || "AIコンテンツがまだ生成されていません。"}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="assets" className="m-0 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold">デジタルアセット</h3>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <QrCode className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">チェックイン用QRコード</h4>
                      <p className="text-[10px] text-muted-foreground">各スポットに設置するダイナミックQRコードを一括生成しました。</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">すべてダウンロード</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Mail className="w-10 h-10 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">スポット協力依頼メール</h4>
                      <p className="text-[10px] text-muted-foreground">AIが下書きした協力依頼メールを送信または確認できます。</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-accent text-xs"
                        onClick={() => router.push(`/rallies/${params.id}/outreach`)}
                      >
                        管理画面へ移動
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="p-4 border-t bg-slate-50">
          <Button 
            className="w-full h-12 rounded-full font-bold shadow-lg shadow-primary/20"
            onClick={() => router.push(`/guide/${params.id}`)}
          >
            実機プレビューを開始 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map View Placeholder */}
      <div className="hidden md:block flex-grow relative bg-slate-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
          <MapIcon className="w-20 h-20 mb-4 opacity-20" />
          <p className="text-sm font-medium opacity-40 italic">Interactive Map View</p>
          <div className="mt-8 flex gap-4 opacity-30">
            {(rallyData?.spots || []).map((_: any, i: number) => (
              <div key={i} className="w-3 h-3 rounded-full bg-primary" />
            ))}
          </div>
        </div>
        
        {/* Floating Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow-xl p-2 flex flex-col gap-2">
            <Button size="icon" variant="ghost" className="h-10 w-10"><Plus className="w-5 h-5" /></Button>
            <Separator />
            <Button size="icon" variant="ghost" className="h-10 w-10"><Trash2 className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Rally Summary Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-80 bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 border border-white">
          <h2 className="text-xl font-bold mb-4">ラリー概要</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">総距離</span>
              <span className="font-bold">{rallyData.totalWalkingDistanceMeters} m</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">推定時間</span>
              <span className="font-bold">{rallyData.totalEstimatedMinutes} 分</span>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white">AI 生成済</Badge>
              <Badge variant="outline" className="bg-white">QR 未発行</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
