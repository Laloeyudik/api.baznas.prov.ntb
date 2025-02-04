export function expiredTime({ minutes = 0, hours = 0, days = 0 } = {}) {
  const now = Date.now();
  const expired = now + (minutes * 60 + hours * 3600 + days * 86400) * 1000;
  return expired;
}
