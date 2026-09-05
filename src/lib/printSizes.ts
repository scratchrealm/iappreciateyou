import type { Orientation } from './types'
import { CARD_LONG, CARD_SHORT } from './types'

const CSS_DPI = 96

export interface PrintSize {
  id: string
  // Length of the card's long edge on paper, in inches. The short edge
  // follows from the card's fixed proportions.
  longIn: number
  // What the size is good for, so the choice can be made without a ruler.
  note: string
}

// Every size keeps the card's 10:7 proportions, so only the long edge varies.
export const PRINT_SIZES: PrintSize[] = [
  { id: 'a7', longIn: 7, note: 'fits an A7 greeting-card envelope' },
  { id: 'a6', longIn: 6, note: 'fits an A6 envelope' },
  { id: 'note', longIn: 5, note: 'fits a standard business envelope' },
  { id: 'mini', longIn: 4, note: 'pocket size, fits a small note envelope' },
]

export const DEFAULT_PRINT_SIZE = 'note'

export function printSizeById(id: string): PrintSize {
  return PRINT_SIZES.find((s) => s.id === id) ?? PRINT_SIZES[0]
}

// Card units are CSS pixels, so an inch of paper is 96 of them.
export function printScale(size: PrintSize): number {
  return (size.longIn * CSS_DPI) / CARD_LONG
}

function inches(n: number): string {
  // A tenth of an inch is as fine a distinction as this needs to draw.
  return (Math.round(n * 10) / 10).toString()
}

export function printSizeLabel(size: PrintSize, orientation: Orientation): string {
  const long = inches(size.longIn)
  const short = inches((size.longIn * CARD_SHORT) / CARD_LONG)
  return orientation === 'landscape' ? `${long} × ${short} in` : `${short} × ${long} in`
}
