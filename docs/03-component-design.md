# CountFaith コンポーネント設計書

## ページコンポーネント

### Home (src/app/page.tsx)
- ヒーローセクション
- 問題提起（偽造薬の被害）
- ソリューション説明
- CTA（ダッシュボードへ）

### Dashboard (src/app/dashboard/page.tsx)
- 統計カード（監査数、薬剤師数、Proof発行数）
- グローバルマップ（Leaflet）
- リスク拠点の可視化
- リスクレベル別の色分け

### Inspections (src/app/inspections/page.tsx)
- ① リスク拠点選択
- ② 周辺薬剤師表示（Crustdata）
- ③ 薬剤師選択
- ④ クエスト割当（Blaxel）
- ⑤ Proof of Faith発行

### Pharmacists (src/app/pharmacists/page.tsx)
- 登録薬剤師一覧
- 稼働状況表示
- 実績管理

## UIコンポーネント

### Card
- CardHeader
- CardContent
- CardTitle

### Badge
- variant: default, destructive, outline, secondary
- リスクレベル表示

### Button
- variant: default, outline, ghost
- size: default, sm, lg, icon
- loading状態対応

### Input
- テキスト入力
- プレースホルダー

## 状態管理

### Dashboard
- sites: InspectionSite[]
- stats: { totalInspections, activePharmacists, proofsIssued }

### Inspections
- selectedSite: InspectionSite | null
- pharmacists: Pharmacist[]
- selectedPharmacist: Pharmacist | null
- quest: Quest | null
- proof: ProofOfFaith | null
- loading: boolean

### Pharmacists
- pharmacists: Pharmacist[]

## Props定義

### InspectionSite
```typescript
interface InspectionSite {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  riskLevel: 'high' | 'medium' | 'low';
  type: 'warehouse' | 'pharmacy' | 'hospital';
}
```

### Pharmacist
```typescript
interface Pharmacist {
  id: string;
  name: string;
  license: string;
  location: { lat: number; lng: number };
  distance?: number;
  experience: number;
  available: boolean;
}
```

### Quest
```typescript
interface Quest {
  id: string;
  siteId: string;
  pharmacistId?: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  reward: number;
  createdAt: Date;
}
```

### ProofOfFaith
```typescript
interface ProofOfFaith {
  id: string;
  questId: string;
  pharmacistId: string;
  lotNumber: string;
  verified: boolean;
  signature: string;
  timestamp: Date;
}
```
