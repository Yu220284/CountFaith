# CountFaith アーキテクチャ設計書

## システム構成

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Dashboard   │  │ Inspections  │  │Pharmacists │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│              External APIs                           │
│  ┌──────────────────────────────────────────────┐   │
│  │  Crustdata People API                        │   │
│  │  - PersonDB Search (geo_distance)            │   │
│  │  - 薬剤師プロフィール検索                      │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Blaxel API (モック実装)                      │   │
│  │  - Quest Assignment                          │   │
│  │  - Proof of Faith発行                        │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx (ホーム)
│   ├── dashboard/ (ダッシュボード)
│   ├── inspections/ (監査作成)
│   ├── pharmacists/ (薬剤師管理)
│   ├── api/
│   │   ├── assign-quest/ (Blaxelモック)
│   │   └── issue-proof/ (Blaxelモック)
│   └── layout.tsx
├── components/
│   └── ui/ (shadcn/ui)
├── lib/
│   ├── countfaith-api.ts (API統合)
│   └── crustdata.ts (Crustdata専用)
└── types/
    └── env.d.ts
```

## データフロー

### 監査作成フロー
1. リスク拠点選択 → 2. Crustdata API呼び出し → 3. 薬剤師リスト表示 → 4. 薬剤師選択 → 5. クエスト割当 → 6. Proof発行

### Crustdata統合フロー
1. 拠点の住所を取得 → 2. geo_distanceフィルターで検索 → 3. 50km以内の薬剤師を取得 → 4. 経験年数でフィルター

## 状態管理
- React useState: ローカル状態
- 選択状態: selectedSite, selectedPharmacist, quest, proof
