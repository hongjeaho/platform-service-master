export const sumCalculate = (a: number | undefined, b: number | undefined) => {
  const StringA = a ? String(a).replaceAll(',', '') : ''
  const StringB = b ? String(b).replaceAll(',', '') : ''

  const numberA = StringA === '' ? 0 : Number(StringA)
  const numberB = StringB === '' ? 0 : Number(StringB)
  const sum = numberA + numberB

  return Math.round(sum * 100) / 100
}
