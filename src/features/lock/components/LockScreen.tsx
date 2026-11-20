import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import PinPad from './PinPad';
import { usePin } from '../hooks/usePin';

export default function LockScreen() {
  const navigate = useNavigate();
  const authState = useAuthStore((s) => s.state);
  const unlock = useAuthStore((s) => s.unlock);
  const { value, setValue, reset, length } = usePin(4);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (authState.status !== 'locked') return null;
  const user = authState.user;

  const handleSubmit = async (pin: string) => {
    const ok = await unlock(pin);
    if (ok) {
      reset();
      navigate('/dashboard', { replace: true });
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      setTimeout(() => {
        setError(false);
        reset();
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-gold-400">
          <ShieldCheck size={26} strokeWidth={1.75} />
        </div>
        <h1 className="text-xl font-semibold">Welcome back, {user.displayName}</h1>
        <p className="text-sm text-dim">Enter your 4-digit PIN</p>
      </div>

      <PinPad
        length={length}
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        disabled={error}
        error={error}
      />

      {error && (
        <p className="mt-6 text-sm text-[var(--sys-red)]" role="alert">
          Incorrect PIN{attempts >= 3 ? '. Try again carefully.' : '.'}
        </p>
      )}
    </div>
  );
}