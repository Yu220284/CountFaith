# CountFaith 詳細設計書

## API仕様

### Crustdata People API

#### findNearbyPharmacists
```typescript
Input: {
  site: InspectionSite;
}

Request to Crustdata:
POST https://api.crustdata.com/screener/persondb/search
{
  filters: {
    op: 'and',
    conditions: [
      {
        column: 'region',
        type: 'geo_distance',
        value: {
          location: site.address,
          distance: 50,
          unit: 'km'
        }
      },
      {
        column: 'current_employers.title',
        type: '(.)',
        value: 'pharmacist'
      }
    ]
  },
  limit: 10
}

Output: Pharmacist[]
```

### Blaxel API（モック実装）

#### assignQuest
```typescript
Input: {
  site: InspectionSite;
  pharmacists: Pharmacist[];
}

Output: {
  id: string;
  siteId: string;
  pharmacistId: string;
  status: 'assigned';
  reward: number;
  createdAt: Date;
}
```

#### issueProofOfFaith
```typescript
Input: {
  questId: string;
  pharmacistId: string;
  lotNumber: string;
  verified: boolean;
}

Output: {
  id: string;
  questId: string;
  pharmacistId: string;
  lotNumber: string;
  verified: boolean;
  signature: string;
  timestamp: Date;
}
```

## データフロー

### 監査作成フロー
1. ユーザーがリスク拠点を選択
2. `handleFindPharmacists(site)` が呼ばれる
3. Crustdata APIで周辺薬剤師を検索
4. 薬剤師リストを表示
5. ユーザーが薬剤師を選択
6. `handleAssignQuest()` が呼ばれる
7. Blaxel APIでクエストを割当
8. クエスト詳細を表示
9. `handleIssueProof()` が呼ばれる
10. Proof of Faithを発行

### Crustdata統合の詳細

#### geo_distance フィルター
- 拠点の住所から都市名を抽出
- 50km以内の薬剤師を検索
- 経験年数3年以上でフィルター

#### レスポンス処理
```typescript
data.profiles.map((person) => ({
  id: person.person_id,
  name: person.name,
  license: 'PH-XXXXXX', // 自動生成
  location: site.location,
  distance: Math.random() * 10,
  experience: person.years_of_experience_raw,
  available: true
}))
```

## エラーハンドリング

### Crustdata APIエラー
- 400エラー: フィルター形式エラー
- 401エラー: 認証エラー
- フォールバック: モックデータを返す

### Blaxel APIエラー
- モック実装のため、常に成功

## パフォーマンス最適化

- Image: next/imageで最適化
- Loading状態: Loader2アイコンで表示
- 非同期処理: async/awaitで実装
- エラーハンドリング: try-catchで実装

## セキュリティ

- APIキー: 環境変数で管理
- HTTPS通信: すべてのAPI通信
- 認証: Token認証（Crustdata）
