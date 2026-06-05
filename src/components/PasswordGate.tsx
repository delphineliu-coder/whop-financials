import { useState } from 'react';

const KEY = 'wf_auth';
const PASS = 'whopwhop';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(KEY) === '1');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  const submit = () => {
    if (value === PASS) {
      sessionStorage.setItem(KEY, '1');
      setAuthed(true);
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f1f1f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.08)',
        padding: '40px 48px', width: 340,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#ff6423', letterSpacing: -0.3 }}>
          ⬡ Whop Financials
        </div>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
          Enter password to continue
        </div>
        <input
          type="password"
          value={value}
          autoFocus
          onChange={e => { setValue(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Password"
          style={{
            border: `1px solid ${error ? '#FF0000' : 'rgba(0,0,0,0.15)'}`,
            borderRadius: 8, padding: '10px 14px',
            fontSize: 14, fontWeight: 600, outline: 'none',
            background: '#ffffff', color: '#111111',
          }}
        />
        {error && (
          <div style={{ fontSize: 12, color: '#FF0000', fontWeight: 600, marginTop: -12 }}>
            Incorrect password
          </div>
        )}
        <button
          onClick={submit}
          style={{
            background: '#ff6423', color: '#ffffff', border: 'none',
            borderRadius: 8, padding: '10px 0', fontSize: 14,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
