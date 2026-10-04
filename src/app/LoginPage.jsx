import { AlertCircle, KeyRound, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';

import background from '@/assets/background.jpg';
import logo from '@/assets/logo.png';
import { Button, TextField, cn } from '@/ui';
import { useAuth } from './AuthProvider';

export default function LoginPage() {
  const { signedIn, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const userRef = useRef(null);
  const passRef = useRef(null);

  useEffect(() => userRef.current?.focus(), []);
  if (signedIn) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await login(username, password);
    if (!ok) {
      setBusy(false);
      setError(true);
      setPassword('');
      userRef.current?.focus();
    }
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgb(15 23 42 / 0.55), rgb(15 23 42 / 0.65)), url(${background})`,
      }}
    >
      <form
        onSubmit={submit}
        className={cn(
          'w-full max-w-sm rounded-2xl bg-white/95 p-6 shadow-pop backdrop-blur sm:p-8',
          error && 'animate-shake',
        )}
        onAnimationEnd={() => setError(false)}
      >
        <div className="mb-6 text-center">
          <img src={logo} alt="Santhamani Textiles" className="mx-auto mb-2 size-24 object-contain" />
          <h1 className="text-2xl font-bold text-brand-800">Santhamani Textiles</h1>
          <p className="text-sm text-slate-500">Invoice Management System</p>
        </div>

        <div className="space-y-3">
          <TextField
            ref={userRef}
            label="Username"
            leftIcon={User}
            value={username}
            onChange={(v) => setUsername(v)}
            placeholder="Enter username"
            autoComplete="username"
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                passRef.current?.focus();
              }
            }}
          />
          <TextField
            ref={passRef}
            label="Password"
            leftIcon={KeyRound}
            type="password"
            value={password}
            onChange={(v) => setPassword(v)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>

        {error ? (
          <p
            className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="size-4 shrink-0" /> Invalid username or password
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth loading={busy} className="mt-5">
          Sign In
        </Button>
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Santhamani Textiles. All rights reserved.
        </p>
      </form>
    </div>
  );
}
