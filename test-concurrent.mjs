
const url = 'http://localhost:3000/appointments';

const makeBooking = (name, phone, email) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: name,
      phone,
      email,
      serviceName: 'Government Form Filling',
      appointmentDate: '2026-10-26',
      appointmentTime: '12:00',
      notes: 'Concurrent booking test',
    }),
  }).then(async (response) => ({
    status: response.status,
    body: await response.json(),
  }));

const results = await Promise.all([
  makeBooking('Concurrent A', '9876543216', 'concurrentA@example.com'),
  makeBooking('Concurrent B', '9876543217', 'concurrentB@example.com'),
]);

console.log(JSON.stringify(results, null, 2));
