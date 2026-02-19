
export function parseMaxAge(maxAgeString: string): number {
  const unit = maxAgeString.slice(-1);
  const value = parseInt(maxAgeString.slice(0, -1));
  
  switch(unit) {
    case 'd': return value * 24 * 60 * 60 * 1000; // дни в миллисекунды
    case 'h': return value * 60 * 60 * 1000;      // часы в миллисекунды
    case 'm': return value * 60 * 1000;           // минуты в миллисекунды
    case 's': return value * 1000;                 // секунды в миллисекунды
    default: return parseInt(maxAgeString);        // если просто число
  }
}