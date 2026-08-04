export type Orientation = 'landscape' | 'portrait'
export type TextSize = 'small' | 'medium' | 'large'
export type TextAlign = 'left' | 'center' | 'right'

export interface CardData {
  template: string
  orientation: Orientation
  message: string
  font: string
  color: string
  background: string
  size: TextSize
  align: TextAlign
}

export const CARD_LONG = 800
export const CARD_SHORT = 560

export function cardDims(orientation: Orientation): { w: number; h: number } {
  return orientation === 'landscape'
    ? { w: CARD_LONG, h: CARD_SHORT }
    : { w: CARD_SHORT, h: CARD_LONG }
}
