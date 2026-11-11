import React, { useState } from 'react';
import { LogOut, Phone, Save, User as UserIcon } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';
import { FieldErrors, validateProfile } from '../../utils/validation';
import { formatDate } from '../../utils/formatDate';

const CustomerProfile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { myBookings } = useBookings();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const unchanged = fullName.trim() === user.fullName && phone.replace(/[\s-]/g, '') === user.phone;
  const completed = myBookings.filter((b) => b.status === 'completed').length;

  const clear = (field: string) => {
    setFormError('');
    if (errors[field]) setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const found = validateProfile({ fullName, phone });
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const result = updateProfile({ fullName, phone });
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setFullName(result.data.fullName);
    setPhone(result.data.phone);
    toast.success('Profile updated.');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-ink-500">Your name and phone number are shown to the rider who accepts your booking.</p>
      </header>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-ink-500">Member since</p><p className="mt-1 font-display text-xl font-bold">{formatDate(user.createdAt)}</p></Card>
        <Card><p className="text-sm text-ink-500">Total bookings</p><p className="mt-1 font-display text-xl font-bold">{myBookings.length}</p></Card>
        <Card><p className="text-sm text-ink-500">Completed rides</p><p className="mt-1 font-display text-xl font-bold">{completed}</p></Card>
      </section>

      <form onSubmit={onSubmit} noValidate aria-label="Edit profile">
        <Card className="space-y-4">
          <h2 className="text-lg font-bold">Your details</h2>
          {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
          <Input label="Full name" autoComplete="name" leftIcon={<UserIcon className="h-4 w-4" aria-hidden="true" />} value={fullName} onChange={(e) => { setFullName(e.target.value); clear('fullName'); }} error={errors.fullName} />
          <Input label="Phone number" type="tel" autoComplete="tel" leftIcon={<Phone className="h-4 w-4" aria-hidden="true" />} value={phone} onChange={(e) => { setPhone(e.target.value); clear('phone'); }} error={errors.phone} />
          <Input label="Email" value={user.email} readOnly hint="Your email is your login, so it cannot be changed here." />
          <Button type="submit" loading={saving} disabled={unchanged} leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}>Save changes</Button>
        </Card>
      </form>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Your data</h2>
        <p className="text-sm text-ink-500">Wayvo is a demo. Your account and bookings are stored only in this browser. Clearing your browser data removes them.</p>
        <Button variant="secondary" onClick={logout} leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}>Log out</Button>
      </Card>
    </div>
  );
};

export default CustomerProfile;