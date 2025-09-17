// features/home/components/ScopeToggle.tsx
type Props = {
  scope: 'me'|'pair';
  onChange: (v: 'me'|'pair') => void;
};
export default function ScopeToggle({ scope, onChange }: Props) {
  return (
    <div style={{ display:'flex', gap:8 }}>
      <button
        onClick={() => onChange('me')}
        aria-pressed={scope==='me'}
      >自分</button>
      <button
        onClick={() => onChange('pair')}
        aria-pressed={scope==='pair'}
      >ペア</button>
    </div>
  );
}
