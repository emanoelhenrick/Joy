export function parseNumber(data: any) {
  const num = parseFloat(data)
  if (isNaN(num)) return 0
  return num
}