import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, CheckCircle2, Send, XCircle } from 'lucide-react';
import { Accordion } from '../../components/common/Accordion';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { FAQS } from '../../content/faqs';
import { FieldErrors, validateContact } from '../../utils/validation';

const GUIDES = [
  {
    icon: <CarFront className="h-5 w-5" aria-hidden="true" />,
    title: 'Booking a ride',
    points: ['Choose pickup, destination and ride type.', 'Check the estimated fare, distance and time.', 'Confirm. Your booking starts as pending.', 'When a rider accepts, their details appear on the booking.'],
  },
  {
    icon: <XCircle className="h-5 w-5" aria-hidden="true" />,
    title: 'Cancellations',
    points: ['You can cancel while the booking is pending.', 'After a rider accepts, cancelling is no longer available.', 'Cancelled bookings stay in your history.'],
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    title: 'For riders',
    points: ['Register as a rider and add your vehicle details.', 'Switch to Online to see pending requests.', 'Accept a ride, then mark arrived, start and complete.', 'Earnings are simulated estimates, not real payments.'],
  },
];

const Help: React.FC = () => {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<string | null>(null);

  const update = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSent(values.name.trim().split(' ')[0]);
    setValues({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <h1 className="text-4xl font-bold">Help and support</h1>
        <p className="mt-3 max-w-2xl text-ink-500">Quick guides, common questions and a contact form. Wayvo is a demo, so there is no live support team.</p>
      </header>

      <section aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="sr-only">Guides</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {GUIDES.map((g) => (
            <Card key={g.title}>
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{g.icon}</span>
              <h3 className="text-lg font-bold">{g.title}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-500">{g.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="max-w-3xl">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold">Frequently asked questions</h2>
        <Accordion items={FAQS} />
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 max-w-xl">
        <h2 id="contact-heading" className="text-2xl font-bold">Contact us</h2>
        <p className="mt-2 text-sm text-ink-500">This form is simulated. Your message is not sent or stored anywhere.</p>
        {sent ? (
          <Card className="mt-6" role="status">
            <CheckCircle2 className="h-6 w-6 text-brand-600" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold">Thanks, {sent}</h3>
            <p className="mt-1 text-sm text-ink-500">This is a demo, so your message was not actually sent.</p>
            <Button variant="secondary" className="mt-4" onClick={() => setSent(null)}>Write another</Button>
          </Card>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <Input label="Your name" autoComplete="name" value={values.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
            <Input label="Email" type="email" autoComplete="email" value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-ink-700">Message</label>
              <textarea
                id="contact-message" rows={5} value={values.message} onChange={(e) => update('message', e.target.value)}
                aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className={`w-full rounded-xl border bg-white p-3.5 text-sm ${errors.message ? 'border-red-500' : 'border-ink-200 hover:border-ink-300'}`}
              />
              {errors.message && <p id="contact-message-error" role="alert" className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
            </div>
            <Button type="submit" leftIcon={<Send className="h-4 w-4" aria-hidden="true" />}>Send message</Button>
          </form>
        )}
      </section>

      <section id="legal" aria-labelledby="legal-heading" className="scroll-mt-20 max-w-3xl">
        <h2 id="legal-heading" className="text-2xl font-bold">Terms and privacy (demo)</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-500">
          <p><strong className="text-ink-900">Terms.</strong> Wayvo is a student demonstration project. It is not a real transport service. Bookings, fares, riders and earnings are simulated and no payment is taken.</p>
          <p><strong className="text-ink-900">Privacy.</strong> Everything you enter is stored in your own browser using local storage and is never sent to a server. Clearing your browser data removes it. Please do not enter real sensitive information.</p>
          <p><strong className="text-ink-900">Security.</strong> Sign-in is a demonstration and is not secure authentication. <Link to="/register" className="font-semibold text-brand-700 hover:underline">Create a demo account</Link> to try the app.</p>
        </div>
      </section>
    </div>
  );
};

export default Help;