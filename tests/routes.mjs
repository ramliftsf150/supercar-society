// Run after npm run build and npm start -- --hostname 127.0.0.1 --port 3100.
// Checks the unconfigured, signed-out state without introducing public fixtures.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
for (const [path, status] of [
 ['/', 200], ['/events', 200], ['/shop', 200], ['/about', 200], ['/contact', 200], ['/admin/login', 200],
 ['/admin', 307], ['/admin/events', 307], ['/admin/events/new', 307],
 ['/admin/events/00000000-0000-4000-8000-000000000000/edit', 307], ['/events/not-a-real-event', 404],
]) {
 const response = await fetch(base + path, { redirect: 'manual' });
 const body = await response.text();
 if (response.status !== status) throw new Error(`${path}: expected ${status}, got ${response.status}`);
 if (status === 307 && !response.headers.get('location')?.endsWith('/admin/login')) throw new Error('Unexpected admin redirect');
 if (path === '/events' && !body.includes('No upcoming events announced yet.')) throw new Error('Missing honest empty state');
 if (path === '/' && !body.includes('MORE THAN CARS.')) throw new Error('Missing existing home content');
 if (path === '/about') {
  const main = body.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  if (main.replace(/<[^>]*>/g, '').trim() !== 'THIS IS IAN.') throw new Error('Unexpected About page copy');
  if ((main.match(/<img\b/g) || []).length !== 1) throw new Error('About must contain exactly one photograph');
  if (!body.includes('<title>About | Super Car Society</title>')) throw new Error('Incorrect About metadata');
 }
 console.log(`${path} → ${response.status}${response.headers.get('location') ? ' ' + response.headers.get('location') : ''}`);
}
