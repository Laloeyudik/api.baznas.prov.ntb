export function convertToISODate(datetime) {
  const dateIso = new Date(datetime).toISOString();
  return dateIso;
}
