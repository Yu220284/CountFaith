
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Clock, ArrowRight, Filter, Compass, History, Ghost, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';

const categories = [
  { name: 'ミステリー', icon: Ghost, color: 'bg-purple-100 text-purple-700' },
  { name: '歴史', icon: History, color: 'bg-amber-100 text-amber-700' },
  { name: 'グルメ', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { name: '冒険', icon: Compass, color: 'bg-blue-100 text-blue-700' },
];

const featuredRallies = [
  {
    id: 'tokyo-1',
    title: '東京ミステリー・ウォーク',
    location: '東京都 新宿区',
    duration: '3時間',
    category: 'ミステリー',
    image: (PlaceHolderImages || []).find(img => img.id === 'rally-tokyo')?.imageUrl,
    price: '無料'
  },
  {
    id: 'kyoto-2',
    title: '古都の歴史を巡る旅',
    location: '京都府 京都市',
    duration: '5時間',
    category: '歴史',
    image: (PlaceHolderImages || []).find(img => img.id === 'rally-history')?.imageUrl,
    price: '¥500'
  },
  {
    id: 'osaka-3',
    title: '大阪くいだおれスタンプラリー',
    location: '大阪府 大阪市',
    duration: '4時間',
    category: 'グルメ',
    image: (PlaceHolderImages || []).find(img => img.id === 'rally-food')?.imageUrl,
    price: '無料'
  }
];

export default function Home() {
  const logoUrl = (PlaceHolderImages || []).find(img => img.id === 'logo')?.imageUrl || '';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded-lg object-contain" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
            )}
            <span className="text-xl font-bold text-primary">ぷらねっと</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-primary">ラリーを探す</Link>
            <Link href="/create" className="hover:text-primary transition-colors">ラリーを作る</Link>
            <Link href="/my-rallies" className="hover:text-primary transition-colors">マイページ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/create">今すぐ作成</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={(PlaceHolderImages || []).find(img => img.id === 'hero')?.imageUrl || ''}
              alt="Hero"
              fill
              className="object-cover brightness-50"
              priority
              data-ai-hint="landscape discovery"
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              街は、あなたのアトラクション。
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              AIを使って、世界に一つだけのスタンプラリーを瞬時に作成.
              日常の風景を、忘れられない冒険に変えましょう。
            </p>
            <div className="flex flex-col md:row items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="場所やテーマで検索..." 
                  className="pl-10 bg-white/95 text-foreground h-12 rounded-full border-none shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">カテゴリーから探す</h2>
              <Button variant="ghost" className="text-primary font-medium">
                すべて見る <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat.name} href={`/search?cat=${cat.name}`} className="group">
                  <div className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all group-hover:shadow-md ${cat.color}`}>
                    <cat.icon className="w-8 h-8 mb-3" />
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Rallies */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold mb-2">おすすめのスタンプラリー</h2>
                <p className="text-muted-foreground">今話題の冒険に出かけましょう。</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredRallies.map((rally) => (
                <Card key={rally.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={rally.image || ''}
                      alt={rally.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white">{rally.category}</Badge>
                    <Badge className="absolute top-3 right-3 bg-accent text-white">{rally.price}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{rally.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{rally.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{rally.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t mt-auto">
                    <Button variant="ghost" className="w-full justify-between text-primary font-medium hover:bg-primary/5 px-0">
                      詳細を見る <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">あなたの街のストーリーを、形に。</h2>
                <p className="text-lg opacity-90 mb-10">
                  プロの知識がなくても大丈夫。AIがルート設計からコンテンツ作成まで、あらゆる工程をサポートします。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" className="font-bold px-8 h-14 rounded-full" asChild>
                    <Link href="/create">ラリーを作成する</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white font-bold px-8 h-14 rounded-full hover:bg-white/20">
                    使い方ガイド
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 border-b border-slate-800 pb-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded-lg object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
                )}
                <span className="text-xl font-bold text-white">ぷらねっと (PRA.net)</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed">
                日本全国の魅力を再発見するための、次世代デジタルスタンプラリー作成プラットフォーム。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">サービス</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">ラリーを探す</Link></li>
                <li><Link href="/create" className="hover:text-primary transition-colors">ラリーを作る</Link></li>
                <li><Link href="/business" className="hover:text-primary transition-colors">法人向けプラン</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">サポート</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/faq" className="hover:text-primary transition-colors">よくある質問</Link></li>
                <li><Link href="/guide" className="hover:text-primary transition-colors">ご利用ガイド</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:row items-center justify-between text-xs gap-4">
            <p>&copy; 2024 PRA.net. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
