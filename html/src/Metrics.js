

export default function sendMetric(path, body) {
  return fetch(`/api/metrics/v1/${path}`, {
    headers: new Headers({'content-type': 'application/json'}),
    method: 'POST', 
    body: JSON.stringify(body),
  });
}