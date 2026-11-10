import { RIDE_TYPES } from '../config/pricing.config';
import { formatCurrency } from '../utils/formatCurrency';

export interface FaqItem { question: string; answer: string }

const std = RIDE_TYPES.standard;

export const FAQS: FaqItem[] = [
  {
    question: 'How do I book a ride?',
    answer: 'Create a customer account, choose a pickup and a destination, pick a ride type, check the estimated fare and confirm. Your request is then sent to available riders.',
  },
  {
    question: 'How is the fare calculated?',
    answer: `Fare = base fare + (distance in km x price per km). For example, a Standard ride of 5 km costs ${formatCurrency(std.baseFare)} + (5 x ${formatCurrency(std.pricePerKm)}) = ${formatCurrency(std.baseFare + 5 * std.pricePerKm)}. You see the estimate before you confirm.`,
  },
  {
    question: 'Can I cancel a booking?',
    answer: 'Yes, while it is still waiting for a rider. Once a rider has accepted, the booking can no longer be cancelled from your account.',
  },
  {
    question: 'What if no rider accepts my request?',
    answer: 'Your booking stays pending and visible to online riders. You can cancel it at any time before a rider accepts.',
  },
  {
    question: 'How do I become a rider?',
    answer: 'Register with the Rider account type, add your vehicle details on your profile, then switch to Online to see ride requests.',
  },
  {
    question: 'Are payments real?',
    answer: 'No. Wayvo is a demonstration app. Fares and earnings are simulated estimates and no money moves.',
  },
  {
    question: 'Where is my data stored?',
    answer: 'In your own browser only. There is no server, so your data is not shared between devices or other browsers.',
  },
];