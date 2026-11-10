import React, { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { CarFront, Mail, Phone, User as UserIcon, UserRound } from 'lucide-react';
import { AuthShell } from '../../components/layout/AuthShell';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { dashboardPath, postRegisterPath } from '../../routes/paths';
import { UserRole } from '../../types/user';
import { FieldErrors, RegistrationValues, validateRegistration } from '../../utils/validation';

const ROLE_OPTIONS: Array<{ value: UserRole; title: string; text: string; icon: React.ReactNode }> = [
  { value: 'customer', title: 'Customer', text: 'Book rides', icon: <UserRound className="h-5 w-5" aria-hidden="true" /> },
  { value: 'rider', title: 'Rider', text: 'Accept ride requests', icon: <CarFront className="h-5 w-5" aria-hidden="true" /> },
];

const Register: React.FC = () => {
  const { user, register } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const initialRole: UserRole | '' = params.get('role') === 'rider' ? 'rider' : params.get('role') === 'customer' ? 'customer' : '';

  const [values, setValues] = useState<RegistrationValues>({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', role: initialRole, acceptedTerms: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Set on success so the post-registration destination wins over the "already signed in" redirect.
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  if (redirectTo) return <Navigate to={redirectTo} replace />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const update = <K extends keyof RegistrationValues>(field: K, value: RegistrationValues[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
    setFormError('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateRegistration(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const result = await register(values, true);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast.success(`Welcome to Wayvo, ${result.data.fullName.split(' ')[0]}.`);
    setRedirectTo(postRegisterPath(result.data.role));
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose how you will use Wayvo."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink-700">Account type</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((o) => (
              <label key={o.value} className="relative cursor-pointer">
                <input type="radio" name="role" value={o.value} checked={values.role === o.value} onChange={() => update('role', o.value)} className="peer sr-only" />
                <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-colors hover:border-ink-300 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2">
                  <span className="text-brand-700">{o.icon}</span>
                  <span><span className="block text-sm font-semibold">{o.title}</span><span className="block text-xs text-ink-500">{o.text}</span></span>
                </div>
              </label>
            ))}
          </div>
          {errors.role && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.role}</p>}
        </fieldset>

        <Input label="Full name" autoComplete="name" leftIcon={<UserIcon className="h-4 w-4" aria-hidden="true" />} value={values.fullName} onChange={(e) => update('fullName', e.target.value)} error={errors.fullName} />
        <Input label="Email" type="email" autoComplete="email" leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />} value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
        <Input label="Phone number" type="tel" autoComplete="tel" placeholder="0801 234 5678" leftIcon={<Phone className="h-4 w-4" aria-hidden="true" />} value={values.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} />
        <Input label="Password" type="password" autoComplete="new-password" hint="Use at least 8 characters." value={values.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
        <Input label="Confirm password" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />

        <div>
          <label className="flex items-start gap-3 text-sm text-ink-700">
            <input type="checkbox" checked={values.acceptedTerms} onChange={(e) => update('acceptedTerms', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600" />
            <span>I understand Wayvo is a demonstration app and I accept the demo terms.</span>
          </label>
          {errors.acceptedTerms && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.acceptedTerms}</p>}
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting}>Create account</Button>
      </form>
    </AuthShell>
  );
};

export default Register;