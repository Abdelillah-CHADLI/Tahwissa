import axios from 'axios';

// Minimal smoke script to reproduce the same request the frontend sends.
// Run with: node scripts/smoke-create-tour.mjs

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const payload = {
  tour_title: 'Smoke Test Tour',
  location: 'Algiers',
  price: 1234,
  start_date: new Date().toISOString().split('T')[0],
  agency_id: '1',
  guide_id: null,
  group_size: '4-12',
  duration: '2 days',
  category: 'Adventure',
  // Send JSON strings like frontend now does
  tour_details: JSON.stringify([{ id: 1, title: 'Day 1', description: 'Test', activities: ['A'], meals: '', accommodation: '' }]),
  tour_included: JSON.stringify(['Pickup']),
  requirements: JSON.stringify(['Passport']),
  tour_not_included: JSON.stringify(['Flights']),
};

try {
  const res = await api.post('/api/tours', payload);
  console.log('SUCCESS', res.data);
} catch (err) {
  if (axios.isAxiosError(err)) {
    console.log('STATUS', err.response?.status);
    console.log('DATA', err.response?.data);
  } else {
    console.log('ERROR', err);
  }
  process.exitCode = 1;
}
