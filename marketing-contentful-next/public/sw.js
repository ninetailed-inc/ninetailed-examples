self.addEventListener('install', function (event) {
  console.log('⚙ Install');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(customHeaderRequestFetch(event));
});

function customHeaderRequestFetch(event) {
  if (event.request.url.includes('experience.ninetailed.co/v2/organizations')) {
    console.log(
      '⚙ Intercepting Ninetailed event request, setting X-Real-IP header'
    );
    const headers = new Headers(event.request.headers);
    headers.set('X-Real-IP', '17.254.0.91');

    const newRequest = new Request(event.request, {
      mode: 'cors',
      credentials: 'omit',
      headers: headers,
    });
    return fetch(newRequest);
  }
}
