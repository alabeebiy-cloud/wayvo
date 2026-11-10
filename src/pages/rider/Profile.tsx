import React, { useState } from 'react';
import { BadgeCheck, CarFront, Save } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { RIDE_TYPE_LIST, RIDE_TYPES } from '../../config/pricing.config';
import { useAuth } from '../../hooks/useAuth';
import { useRiderProfile } from '../../hooks/useRiderProfile';
import { useToast } from '../../hooks/useToast';
import { getProfileCompletion } from '../../services/riderService';
import { VehicleType } from '../../types/rider';
import { cx } from '../../utils/cx';
import { FieldErrors, validateVehicle } from '../../utils/validation';

const RiderProfilePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { profile, saveVehicle, markDemoVerified } = useRiderProfile();

  const [vehicleType, setVehicleType] = useState<VehicleType>(profile?.vehicleType ?? 'standard');
  const [make, setMake] = useState(profile?.vehicleMake ?? '');
  const [model, setModel] = useState(profile?.vehicleModel ?? '');
  const [registration, setRegistration] = useState(profile?.vehicleRegistration ?? '');
  const [capacity, setCapacity] = useState(String(profile?.passengerCapacity ?? RIDE_TYPES.standard.capacity));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const clear = (field: string) => {
    setFormError('');
    if (errors[field]) setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
  };

  const chooseType = (type: VehicleType) => {
    setVehicleType(type);
    setCapacity(String(RIDE_TYPES[type].capacity)); // sensible default, still editable
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const values = {
      vehicleMake: make,
      vehicleModel: model,
      vehicleRegistration: registration,
      passengerCapacity: Number(capacity),
    };
    const found = validateVehicle(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const result = saveVehicle({ vehicleType, ...values });
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setRegistration(result.data.vehicleRegistration); // shown as saved (capital letters)
    toast.success('Vehicle details saved.');
  };

  const verify = () => {
    const result = markDemoVerified();
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Demo verification added.');
  };

  if (!profile) {
    return (
      <Card role="alert" className="border-red-200 bg-red-50">
        <p className="font-semibold text-red-800">We could not find your rider profile.</p>
        <p className="mt-1 text-sm text-red-700">Log out and register a rider account, or use the demo rider on the login page.</p>
      </Card>
    );
  }

  const completion = getProfileCompletion(profile);
  const verified = profile.verificationStatus === 'demo_verified';

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Profile and vehicle</h1>
        <p className="mt-1 text-ink-500">Riders must complete these details before going online.</p>
      </header>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Profile completion</h2>
          <span className="font-display text-xl font-bold">{completion.percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={completion.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${completion.percent}%` }} />
        </div>
        <p className="text-sm text-ink-500">
          {completion.percent === 100 ? 'All set. You can go online from your dashboard.' : `Still needed: ${completion.missing.join(', ')}.`}
        </p>
      </Card>

      <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Vehicle details">
        <Card className="space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold"><CarFront className="h-5 w-5 text-brand-600" aria-hidden="true" /> Vehicle</h2>
          {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}

          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold text-ink-700">Ride type you offer</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {RIDE_TYPE_LIST.map((r) => (
                <label key={r.id} className="relative cursor-pointer">
                  <input type="radio" name="vehicle-type" value={r.id} checked={vehicleType === r.id} onChange={() => chooseType(r.id)} className="peer sr-only" />
                  <span className={cx(
                    'block rounded-xl border border-ink-200 bg-white p-3 transition-colors hover:border-ink-300',
                    'peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500',
                  )}>
                    <span className="block font-bold">{r.label}</span>
                    <span className="block text-xs text-ink-500">Up to {r.capacity} passengers</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Vehicle make" placeholder="Toyota" value={make} onChange={(e) => { setMake(e.target.value); clear('vehicleMake'); }} error={errors.vehicleMake} />
            <Input label="Vehicle model" placeholder="Corolla" value={model} onChange={(e) => { setModel(e.target.value); clear('vehicleModel'); }} error={errors.vehicleModel} />
            <Input label="Registration number" placeholder="ABC-123DE" value={registration} onChange={(e) => { setRegistration(e.target.value); clear('vehicleRegistration'); }} error={errors.vehicleRegistration} hint="Letters, numbers, spaces or dashes." />
            <Input label="Passenger capacity" type="number" inputMode="numeric" min={1} max={8} value={capacity} onChange={(e) => { setCapacity(e.target.value); clear('passengerCapacity'); }} error={errors.passengerCapacity} />
          </div>

          <Button type="submit" loading={saving} leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}>Save vehicle details</Button>
        </Card>
      </form>

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold"><BadgeCheck className="h-5 w-5 text-brand-600" aria-hidden="true" /> Verification</h2>
        {verified ? (
          <p className="text-sm text-ink-700">Your profile has the <strong>demo verified</strong> badge. It is simulated, and nothing was checked against a real authority.</p>
        ) : (
          <>
            <p className="text-sm text-ink-500">Wayvo does not check identities or vehicles. For this demo you can add a simulated badge after your vehicle details are complete.</p>
            <Button variant="secondary" onClick={verify} disabled={completion.percent < 100}>Add demo verification</Button>
          </>
        )}
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-bold">Account</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-ink-500">Name</dt><dd className="font-semibold">{user?.fullName}</dd></div>
          <div><dt className="text-ink-500">Email</dt><dd className="font-semibold">{user?.email}</dd></div>
          <div><dt className="text-ink-500">Phone</dt><dd className="font-semibold">{user?.phone}</dd></div>
        </dl>
      </Card>
    </div>
  );
};

export default RiderProfilePage;