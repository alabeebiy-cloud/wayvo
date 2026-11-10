import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ClipboardList, Route, ShieldCheck, Star, Users, Wallet } from 'lucide-react';
import { Reveal } from '../../components/common/Reveal';
import { HeroIllustration } from '../../components/home/HeroIllustration';
import { HelpSection } from '../../components/home/HelpSection';
import { QuickBooking } from '../../components/home/QuickBooking';

const btn = 'inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors';

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
    {/* HOME */}
    <section id="home" className="scroll-mt-20 overflow-hidden bg-white">
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

    {/* LINKS TO THE TWO SEPARATE PAGES */}
    <section className="py-12">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2">
        <Link to="/how-it-works" className="group flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-6 shadow-card hover:border-ink-200">
          <span><span className="block text-xl font-bold">How it works</span><span className="mt-1 block text-sm text-ink-500">From request to drop-off in four steps.</span></span>
          <ArrowRight className="h-5 w-5 text-ink-300 group-hover:text-brand-600" aria-hidden="true" />
        </Link>
        <Link to="/ride-options" className="group flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-6 shadow-card hover:border-ink-200">
          <span><span className="block text-xl font-bold">Ride options</span><span className="mt-1 block text-sm text-ink-500">Standard, Comfort and XL, with prices.</span></span>
          <ArrowRight className="h-5 w-5 text-ink-300 group-hover:text-brand-600" aria-hidden="true" />
        </Link>
      </div>
    </section>

    {/* ABOUT */}
    <section id="about" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">About Wayvo</h2>
          <p className="mt-3 max-w-2xl text-ink-500">Wayvo is a frontend demonstration of how a ride-hailing product can feel: clear pricing, clear status and a dashboard for each side of the trip.</p>
        </Reveal>
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

        <div className="mt-14 rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
          <h3 className="flex items-center gap-3 text-2xl font-bold"><ShieldCheck className="h-7 w-7 text-brand-300" aria-hidden="true" /> Safety and trust</h3>
          <p className="mt-2 max-w-2xl text-ink-300">What the app shows you, and what it does not claim.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SAFETY.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h4 className="text-base font-bold">{s.title}</h4>
                <p className="mt-2 text-sm text-ink-300">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-14 text-2xl font-bold">What people say</h3>
        <p className="mt-1 text-sm text-ink-500">Fictional testimonials for demonstration only.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <div className="flex gap-0.5 text-amber-500" aria-hidden="true">{[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-4 flex-1 text-ink-700">"{t.text}"</blockquote>
              <figcaption className="mt-5 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-ink-500">, {t.role} (fictional)</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    {/* HELP */}
    <HelpSection />
  </>
);

export default Home;