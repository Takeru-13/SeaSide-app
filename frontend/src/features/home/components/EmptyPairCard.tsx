// features/home/components/EmptyPairCard.tsx
export default function EmptyPairCard() {
  return (
    <div style={{ padding:12, border:'1px solid #ddd', borderRadius:8, marginTop:12 }}>
      <div>ペアが未連携です。</div>
      <button>招待リンクを作成</button>
    </div>
  );
}
