import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button, Input, Notice } from '@/ui';
import { signInDev, isAdminSession } from '../auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function DevLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Enter your developer email and password.');
      return;
    }
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured on this build. Check .env.local.');
      return;
    }
    setSubmitting(true);
    try {
      await signInDev(email, password);
      const ok = await isAdminSession();
      if (!ok) {
        setError('Signed in, but this account is not in finx.admin_users. Ask the owner to seed it.');
        setSubmitting(false);
        return;
      }
      navigate('/dev', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Sign-in failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-strong p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center">
            <ShieldCheck size={22} strokeWidth={1.75} className="text-gold-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Developer sign in</h1>
            <p className="text-xs text-mute">Owner-only access. Not visible in navigation.</p>
          </div>
        </div>

        {error && <div className="mb-4"><Notice variant="error">{error}</Notice></div>}

        <div className="space-y-3">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === 'Enter') void submit();
            }}
          />
        </div>

        <div className="flex justify-end mt-5">
          <Button onClick={submit} loading={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </div>
    </div>
  );
}