import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck, Bus, CarFront, ClipboardList, MapPin, Route, ShieldCheck, Sparkles, Star, Users, Wallet,
} from 'lucide-react';
import { Accordion } from '../../components/common/Accordion';
import { Card } from '../../components/common/Card';
import { Reveal } from '../../components/common/Reveal';
import { HeroIllustration } from '../../components/home/HeroIllustration';
import { QuickBooking } from '../../components/home/QuickBooking';
import { RIDE_TYPE_LIST } from '../../config/pricing.config';
import { FAQS } from '../../content/faqs';
import { RideType } from '../../types/booking';
import { formatCurrency } from '../../utils/formatCurrency';

const btn = 'inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors';

const STEPS = [
  { icon: <MapPin className="h-5 w-5" aria-hidden="true" />, title: 'Choose your route', text: 'Pick a pickup point and a destination from the supported locations.' },
  { icon: <Wallet className="h-5 w-5" aria-hidden="true" />, title: 'See the fare', text: 'Compare ride types and check the estimated fare before you commit.' },
  { icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />, title: 'A rider accepts', text: 'Online riders see your request. When one accepts, you see their details.' },
  { icon: <Route className="h-5 w-5" aria-hidden="true" />, title: 'Follow the trip', text: 'Watch the status move from accepted to arrived, in progress and completed.' },
];

const RIDE_ICONS: Record<RideType, React.ReactNode> = {
  standard: <CarFront className="h-6 w-6" aria-hidden="true" />,
  comfort: <Sparkles className="h-6 w-6" aria-hidden="true" />,
  xl: <Bus className="h-6 w-6" aria-hidden="true" />,
};

const BENEFITS = [
  { icon: <Wallet className="h-5 w-5" aria-hidden="true" />, title: 'Transparent pricing', text: 'One clear formula: base fare plus distance. No surprises after you confirm.' },
  { icon: <Route className="h-5 w-5" aria-hidden="true" />, title: 'Easy booking', text: 'Book in a handful of taps with a live fare estimate.' },
  { icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />, title: 'Trip management', text: 'Booking history, status updates and notifications in one place.' },
  { icon: <Users className="h-5 w-5" aria-hidden="true" />, title: 'Built for riders too', text: 'Riders get their own dashboard for requests, trips and simulated earnings.' },
];

const SAFETY = [
  { title: 'Rider details after acceptance', text: 'When a rider accepts, their name and vehicle details appear on your booking.' },
  { title: 'Status at every step', text: 'Accepted, arrived, in progress and completed are shown as the trip moves along.' },
  { title: 'Cancel while pending', text: 'You can cancel any booking that has not been accepted yet.' },
  { title: 'Honest limits', text: 'This demo does not verify identities or vehicles, and it has no live GPS tracking.' },
];

const TESTIMONIALS = [
  { name: 'Ada O.', role: 'Customer', text: 'Seeing the fare first made booking feel simple. I knew what to expect.' },
  { name: 'Tunde B.', role: 'Rider', text: 'The request list is easy to scan, and the trip steps are clear.' },
  { name: 'Chioma E.', role: 'Customer', text: 'My history page keeps every trip together, which is handy.' },
];

const Home: React.FC = () => (
  <>
    {/* Hero */}
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Demo ride-booking platform
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">Get where you are going, without the guesswork.</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-500">Book a ride in a few taps, see the fare up front, and follow your trip from request to drop-off.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register?role=customer" className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}>Book a ride</Link>
            <Link to="/register?role=rider" className={`${btn} border border-ink-200 bg-white hover:bg-ink-50`}>Become a rider</Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <HeroIllustration className="hidden w-full sm:block" />
          <div className="sm:-mt-24 sm:px-6"><QuickBooking /></div>
        </Reveal>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="text-3xl font-bold sm:text-4xl">How it works</h2><p className="mt-3 max-w-xl text-ink-500">From request to drop-off in four steps.</p></Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <Card className="h-full">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{s.icon}</span>
                    <span className="font-display text-sm font-bold text-ink-300">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{s.text}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Ride options */}
    <section id="ride-options" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="text-3xl font-bold sm:text-4xl">Ride options</h2><p className="mt-3 max-w-xl text-ink-500">Demonstration prices in naira. Fare = base fare + distance x rate per km.</p></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {RIDE_TYPE_LIST.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.06} className="h-full">
              <Card className="flex h-full flex-col">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-white">{RIDE_ICONS[r.id]}</span>
                <h3 className="text-xl font-bold">{r.label}</h3>
                <p className="mt-1 text-sm text-ink-500">{r.description}</p>
                <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-500">Seats</dt><dd className="font-semibold">Up to {r.capacity}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">Base fare</dt><dd className="font-semibold">{formatCurrency(r.baseFare)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">Per km</dt><dd className="font-semibold">{formatCurrency(r.pricePerKm)}</dd></div>
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Why Wayvo */}
    <section id="about" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="text-3xl font-bold sm:text-4xl">Why choose Wayvo</h2><p className="mt-3 max-w-2xl text-ink-500">Wayvo is a frontend demonstration of how a ride-hailing product can feel: clear pricing, clear status and a dashboard for each side of the trip.</p></Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{b.icon}</span>
                <div><h3 className="text-lg font-bold">{b.title}</h3><p className="mt-1 text-sm text-ink-500">{b.text}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Safety and trust */}
    <section className="bg-ink-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl"><ShieldCheck className="h-8 w-8 text-brand-300" aria-hidden="true" /> Safety and trust</h2>
          <p className="mt-3 max-w-2xl text-ink-300">What the app shows you, and what it does not claim.</p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAFETY.map((s) => (
            <Reveal key={s.title}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-300">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal><h2 className="text-3xl font-bold sm:text-4xl">What people say</h2><p className="mt-3 text-sm text-ink-500">Fictional testimonials for demonstration only.</p></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="flex gap-0.5 text-amber-500" aria-hidden="true">{[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-4 flex-1 text-ink-700">"{t.text}"</blockquote>
                <figcaption className="mt-5 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-ink-500">, {t.role} (fictional)</span></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal><h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2></Reveal>
        <div className="mt-8"><Accordion items={FAQS} /></div>
        <p className="mt-6 text-sm text-ink-500">More questions? Visit the <Link to="/help" className="font-semibold text-brand-700 hover:underline">help centre</Link>.</p>
      </div>
    </section>
  </>
);

export default Home;