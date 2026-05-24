import { z } from 'zod';

// Reusable validators
const nonEmptyString = (msg) => z.string().nonempty(msg);
const optionalString = () => z.string().optional();
const positiveInt = (msg) => z.number().int().positive(msg);
const dateString = (msg) => z.string().nonempty(msg); // simple date validation – can be extended with regex
const timeString = (msg) => z.string().nonempty(msg);

// ==================== Booking Confirmation Schemas ====================
// Venue Confirmation
export const venueConfirmSchema = z.object({
  area: nonEmptyString('Residential area is required'),
  eventDate: dateString('Event date is required'),
  time: timeString('Event time is required'),
  duration: positiveInt('Duration must be at least 1 day'),
  guestCount: positiveInt('Guest count must be at least 1')
});

// Food Confirmation
export const foodConfirmSchema = z.object({
  date: dateString('Date is required'),
  time: timeString('Time is required'),
  address: nonEmptyString('Address is required'),
  menu: nonEmptyString('Menu selection is required'),
  vegCount: positiveInt('Vegetarian count must be at least 0'),
  nonVegCount: positiveInt('Non‑vegetarian count must be at least 0'),
  cateringType: nonEmptyString('Catering type is required'),
  specialRequests: optionalString()
});

// Decoration Confirmation
export const decorationConfirmSchema = z.object({
  date: dateString('Date is required'),
  time: timeString('Time is required'),
  venueAddress: nonEmptyString('Venue address is required'),
  theme: nonEmptyString('Theme is required'),
  flowerType: nonEmptyString('Flower type is required'),
  decorationStyle: nonEmptyString('Decoration style is required'),
  specialRequests: optionalString()
});

// Makeup Confirmation
export const makeupConfirmSchema = z.object({
  date: dateString('Date is required'),
  time: timeString('Time is required'),
  venueAddress: nonEmptyString('Venue address is required'),
  duration: positiveInt('Duration must be at least 1 hour'),
  specialRequests: optionalString()
});

// Photography Confirmation (already aligned with master template)
export const photographyConfirmSchema = z.object({
  date: dateString('Date is required'),
  time: timeString('Time is required'),
  venueAddress: nonEmptyString('Venue address is required'),
  duration: positiveInt('Duration must be at least 1 hour'),
  notes: optionalString()
});

// Tourist Confirmation
export const touristConfirmSchema = z.object({
  checkIn: dateString('Check‑in date is required'),
  checkOut: dateString('Check‑out date is required'),
  guests: positiveInt('Number of guests must be at least 1'),
  rooms: positiveInt('Number of rooms must be at least 1'),
  roomType: nonEmptyString('Room type is required'),
  specialRequests: optionalString()
});

// Fashion Confirmation
export const fashionConfirmSchema = z.object({
  date: dateString('Date is required'),
  hours: positiveInt('Hours must be at least 1'),
  notes: optionalString()
});

// Entertainment Confirmation
export const entertainmentConfirmSchema = z.object({
  date: dateString('Date is required'),
  time: timeString('Time is required'),
  location: nonEmptyString('Location is required'),
  type: nonEmptyString('Entertainment type is required'),
  duration: positiveInt('Duration must be at least 1 hour'),
  performerCount: positiveInt('Number of performers must be at least 1'),
  specialRequests: optionalString()
});

// ==================== Auth & Misc Schemas ====================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const foodCheckoutSchema = z.object({
  guests: z.coerce.number().int().positive('Number of guests must be at least 1'),
  eventDate: dateString('Event date is required'),
  eventTime: timeString('Event time is required'),
  address: nonEmptyString('Event address is required'),
  specialRequests: optionalString()
});
