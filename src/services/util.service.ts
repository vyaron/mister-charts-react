const gChartColors = ['#8CB4FF', '#688FD9', '#6180BC', '#5B719A', '#52617E']
const gFonts = ['Arial', 'Space Grotesk', 'Roboto', 'Open Sans', 'Lato']

export function getNextChartColor(idx: number): string {
  return gChartColors[idx % gChartColors.length]
}

export function getChartColors(): string[] {
  return gChartColors
}

export function getFonts(): string[] {
  return gFonts
}

export function makeId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
