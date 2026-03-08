# Leaflet Map Initialization Error Log

## エラー内容
```
Error Type: Runtime Error
Error Message: Map container is already initialized.

Code Frame:
  24 | const L = await import('leaflet');
  25 | 
> 26 | const map = L.map(containerRef.current).setView(center, 13);
     |                     ^
```

## 原因
- Leafletが同じコンテナに複数回初期化しようとした
- React StrictModeでコンポーネントが2回マウントされる
- useEffectの依存配列に`spots`や`center`が含まれていて、再実行時に重複初期化

## 改善方法

### 1. 初期化フラグの使用
```typescript
const initialized = useRef(false);

if (initialized.current) return;
initialized.current = true;
```

### 2. コンテナの_leaflet_idチェック
```typescript
if (containerRef.current!._leaflet_id) {
  return;
}
```

### 3. クライアント側のみの実行
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return;
```

### 4. 依存配列を空配列に
```typescript
useEffect(() => {
  // 初期化ロジック
}, []); // 初回マウント時のみ実行
```

### 5. クリーンアップ関数でマップを削除
```typescript
return () => {
  if (mapInstance) {
    mapInstance.remove();
  }
};
```

## 最終的な解決策
上記の方法を組み合わせて、rally-map.tsxで実装：
- `mounted`状態でクライアント側のみ実行
- `_leaflet_id`チェックで重複初期化を防止
- `preferCanvas: true`でレンダリング最適化
- `attributionControl: false`で余計な表示を削除
- エラーハンドリングで初期化失敗時もクラッシュしない

## 参考資料
- Leaflet公式ドキュメント: https://leafletjs.com/
- React + Leaflet統合のベストプラクティス
