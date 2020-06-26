import { analytics } from "./App";

export default function sendMetric(path, body) {
  analytics.logEvent(path, body);
}
