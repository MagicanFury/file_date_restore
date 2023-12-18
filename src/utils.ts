
export function AFormatDate(date: Date) {
  let d = (typeof date === 'string') ? new Date(date) : date
  if (!d || d.getTime() === 0 || isNaN(d.getTime())) return ""
  const padL = (nr, chr = `0`) => `${nr}`.padStart(2, chr)

  return (`${d.getFullYear()}-${padL(d.getMonth()+1)}-${padL(d.getDate())} ${padL(d.getHours())}:${padL(d.getMinutes())}`)
}