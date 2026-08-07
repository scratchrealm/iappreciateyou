export type Orientation = 'landscape' | 'portrait'
export type TextSize = 'small' | 'medium' | 'large'
export type TextAlign = 'left' | 'center' | 'right'
export type CardSide = 'front' | 'back'

export interface CardData {
  template: string
  orientation: Orientation
  message: string
  // Optional second side. Empty means the card is one-sided.
  back: string
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

export function sideText(card: CardData, side: CardSide): string {
  return side === 'back' ? card.back : card.message
}

// A card is two-sided only once something has actually been written on the back.
export function hasBack(card: CardData): boolean {
  return card.back.trim().length > 0
}
