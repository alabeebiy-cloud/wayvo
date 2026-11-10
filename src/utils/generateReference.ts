const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alike characters

/** Format: WV-YYYYMMDD-XXXX */
export function generateReference(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return `WV-${y}${m}${d}-${suffix}`;
}