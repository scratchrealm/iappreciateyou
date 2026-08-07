export interface FontOption {
  id: string
  name: string
  family: string
  // Small tweak so fonts with unusual metrics preview nicely in pickers
  previewScale?: number
}

export const FONTS: FontOption[] = [
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive" },
  { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'patrick', name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
  { id: 'shadows', name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
  { id: 'lora', name: 'Lora', family: "'Lora', serif" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif" },
  { id: 'quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif" },
]

export interface ColorOption {
  id: string
  name: string
  value: string
}

export const INK_COLORS: ColorOption[] = [
  { id: 'ink', name: 'Ink', value: '#2b2926' },
  { id: 'slate', name: 'Slate', value: '#44586c' },
  { id: 'navy', name: 'Navy', value: '#24365e' },
  { id: 'forest', name: 'Forest', value: '#33573d' },
  { id: 'burgundy', name: 'Burgundy', value: '#7d2a3a' },
  { id: 'plum', name: 'Plum', value: '#5d3a63' },
  { id: 'terracotta', name: 'Terracotta', value: '#a14f2f' },
  { id: 'graphite', name: 'Graphite', value: '#6d675e' },
]

export const PAPER_COLORS: ColorOption[] = [
  { id: 'white', name: 'White', value: '#ffffff' },
  { id: 'cream', name: 'Cream', value: '#faf5e8' },
  { id: 'blush', name: 'Blush', value: '#f9ecec' },
  { id: 'peach', name: 'Peach', value: '#fbeee0' },
  { id: 'sage', name: 'Sage', value: '#eef2e8' },
  { id: 'sky', name: 'Sky', value: '#e9f1f6' },
  { id: 'lavender', name: 'Lavender', value: '#f0ecf7' },
  { id: 'stone', name: 'Stone', value: '#f1f0ed' },
]

export function fontById(id: string): FontOption {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]
}

export function inkById(id: string): ColorOption {
  return INK_COLORS.find((c) => c.id === id) ?? INK_COLORS[0]
}

export function paperById(id: string): ColorOption {
  return PAPER_COLORS.find((c) => c.id === id) ?? PAPER_COLORS[0]
}

// Mixes a #rrggbb color toward black. Used to shade the folded corner so it
// reads as the underside of whichever paper the sender picked.
export function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const f = 1 - amount
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return `rgb(${r}, ${g}, ${b})`
}

export const MAX_MESSAGE_LENGTH = 1000

// Maximum font size (in card units) for each text size preference.
// The auto-fit algorithm never exceeds these and shrinks as needed.
export const SIZE_CAPS = { small: 44, medium: 68, large: 100 } as const
export const MIN_FONT_SIZE = 11
