
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MessageSquare, 
  MapPin, 
  ChevronDown, 
  Send, 
  X, 
  Menu, 
  Camera, 
  CheckCircle2, 
  Navigation,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { provideRallyChatGuidance } from '@/ai/flows/provide-rally-chat-guidance';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function GuideViewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [rallyData, setRallyData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'こんにちは！私はあなたのスタンプラリーガイドです。困ったことがあれば何でも聞いてくださいね。最初のスポットに向かいましょう！' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeImages = PlaceHolderImages || [];
  const logoUrl = safeImages.find(img => img.id === 'logo')?.imageUrl || '';

  useEffect(() => {
    const data = localStorage.getItem(`rally_${params.id}`);
    if (data) {
      setRallyData(JSON.parse(data));
    }
  }, [params.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !rallyData) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await provideRallyChatGuidance({
        userQuery: userMsg,
        currentLocation: rallyData.location,
        nextSpotName: rallyData.spots?.[0]?.name || '目的地',
        rallyTheme: rallyData.theme || '観光',
        rallyStoryContext: rallyData.description
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      toast({ variant: "destructive", title: "チャットエラーが発生しました" });
    } finally {
      setLoading(false);
    }
  };

  if (!rallyData) return <div className="p-20 text-center">読み込み中...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden text-white font-body">
      {/* Mobile-style Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur shrink-0">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={28} height={28} className="rounded-md object-contain" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-xs text-white">P</div>
          )}
          <span className="font-bold text-sm tracking-tight truncate max-w-[150px]">{rallyData.rallyName}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white"><Menu /></Button>
        </div>
      </header>

      {/* Main Experience Area (Map Placeholder) */}
      <main className="flex-grow relative bg-slate-800 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/1200')] bg-cover opacity-40 mix-blend-overlay" />
        
        {/* Progress Card */}
        <div className="absolute top-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Next Stop</span>
            <span className="text-[10px] font-bold text-white/50">0 / {rallyData.spots?.length || 0}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{rallyData.spots?.[0]?.name || 'スポット'}</h2>
          <p className="text-xs text-white/60 mb-4">{rallyData.spots?.[0]?.description || ''}</p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full text-xs font-bold px-4">
              <Navigation className="w-3 h-3 mr-1" /> ナビ開始
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/20 rounded-full text-xs font-bold px-4 hover:bg-white/10">
              <Camera className="w-3 h-3 mr-1" /> チェックイン
            </Button>
          </div>
        </div>

        <div className="relative z-0 flex flex-col items-center gap-4 opacity-50">
          <MapPin className="w-16 h-16 text-primary animate-bounce" />
          <div className="px-6 py-2 bg-slate-900/80 rounded-full border border-white/10">
            <span className="text-xs font-bold">現在地から 120m</span>
          </div>
        </div>
      </main>

      {/* Floating Chat Trigger / Chat Overlay */}
      <div className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ease-in-out ${isChatOpen ? 'h-[70vh]' : 'h-20'}`}>
        {!isChatOpen ? (
          <div className="h-full flex items-center justify-center px-4">
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="w-full max-w-sm h-14 rounded-full bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/20 font-bold"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              ガイドに相談する
            </Button>
          </div>
        ) : (
          <div className="h-full bg-white rounded-t-3xl flex flex-col shadow-2xl text-slate-900 border-t border-slate-200">
            <header className="px-6 h-14 shrink-0 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border-2 border-primary">
                  <AvatarImage src="https://picsum.photos/seed/guide/100/100" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">ラリーガイド</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">オンライン</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}><ChevronDown /></Button>
            </header>
            
            <div className="flex-grow overflow-hidden flex flex-col p-4">
              <ScrollArea className="flex-grow pr-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="メッセージを入力..."
                  className="rounded-full bg-slate-50 border-none h-12"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || loading}
                  size="icon" 
                  className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed top-20 right-[-50px] w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 left-[-50px] w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
