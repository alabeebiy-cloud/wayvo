import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthShell } from '../../components/layout/AuthShell';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { dashboardPath, safeReturnPath } from '../../routes/paths';
import { DEMO_CUSTOMER_EMAIL, DEMO_PASSWORD, DEMO_RIDER_EMAIL, seedDemoData } from '../../services/seed';
import { FieldErrors, validateLogin } from '../../utils/validation';

interface LocationState { from?: string }

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  if (redirectTo) return <Navigate to={redirectTo} replace />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const signIn = async (emailValue: string, passwordValue: string, rememberValue: boolean) => {
    setSubmitting(true);
    const result = await login(emailValue, passwordValue, rememberValue);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast.success(`Welcome back, ${result.data.fullName.split(' ')[0]}.`);
    setRedirectTo(safeReturnPath(from, result.data.role));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateLogin({ email, password });
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;
    await signIn(email, password, remember);
  };

  const signInAsDemo = async (demoEmail: string) => {
    if (submitting) return;
    await seedDemoData();
    await signIn(demoEmail, DEMO_PASSWORD, false);
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Pick up where you left off."
      footer={<>New to Wayvo? <Link to="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {from && !formError && <div className="rounded-xl bg-ink-100 p-3 text-sm text-ink-700">Log in to continue.</div>}
        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

        <Input label="Email" type="email" autoComplete="email" leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />} value={email} onChange={(e) => { setEmail(e.target.value); setFormError(''); }} error={errors.email} />
        <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setFormError(''); }} error={errors.password} />

        <label className="flex items-center gap-3 text-sm text-ink-700">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-brand-600" />
          Keep me signed in on this device
        </label>

        <Button type="submit" size="lg" fullWidth loading={submitting}>Log in</Button>
      </form>

      <div className="mt-8 rounded-2xl border border-ink-200 bg-white p-4">
        <p className="text-sm font-semibold">Just exploring?</p>
        <p className="mt-1 text-sm text-ink-500">Sign in with a demo account. It adds sample data to this browser.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" size="sm" disabled={submitting} onClick={() => signInAsDemo(DEMO_CUSTOMER_EMAIL)}>Demo customer</Button>
          <Button variant="secondary" size="sm" disabled={submitting} onClick={() => signInAsDemo(DEMO_RIDER_EMAIL)}>Demo rider</Button>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;