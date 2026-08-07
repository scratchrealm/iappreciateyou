import { deflateSync, inflateSync, strToU8, strFromU8 } from 'fflate'
import type { CardData, Orientation, TextAlign, TextSize } from './types'
import { FONTS, INK_COLORS, PAPER_COLORS, MAX_MESSAGE_LENGTH } from './options'
import { TEMPLATES } from './templates'

interface Payload {
  v: number
  t: string
  o: 'l' | 'p'
  m: string
  // Back-side text. Omitted entirely for one-sided cards so their links stay short.
  k?: string
  f: string
  c: string
  b: string
  s: 's' | 'm' | 'g'
  a: 'l' | 'c' | 'r'
}

const SIZE_TO_CODE: Record<TextSize, Payload['s']> = { small: 's', medium: 'm', large: 'g' }
const CODE_TO_SIZE: Record<Payload['s'], TextSize> = { s: 'small', m: 'medium', g: 'large' }
const ALIGN_TO_CODE: Record<TextAlign, Payload['a']> = { left: 'l', center: 'c', right: 'r' }
const CODE_TO_ALIGN: Record<Payload['a'], TextAlign> = { l: 'left', c: 'center', r: 'right' }

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function encodeCard(card: CardData): string {
  const payload: Payload = {
    v: 1,
    t: card.template,
    o: card.orientation === 'landscape' ? 'l' : 'p',
    m: card.message,
    f: card.font,
    c: card.color,
    b: card.background,
    s: SIZE_TO_CODE[card.size],
    a: ALIGN_TO_CODE[card.align],
  }
  if (card.back.trim()) payload.k = card.back
  const compressed = deflateSync(strToU8(JSON.stringify(payload)), { level: 9 })
  return toBase64Url(compressed)
}

export function decodeCard(encoded: string): CardData | null {
  try {
    const raw = JSON.parse(strFromU8(inflateSync(fromBase64Url(encoded)))) as Payload
    if (typeof raw.m !== 'string') return null
    const orientation: Orientation = raw.o === 'p' ? 'portrait' : 'landscape'
    return {
      template: TEMPLATES.some((t) => t.id === raw.t) ? raw.t : TEMPLATES[0].id,
      orientation,
      message: raw.m.slice(0, MAX_MESSAGE_LENGTH),
      back: typeof raw.k === 'string' ? raw.k.slice(0, MAX_MESSAGE_LENGTH) : '',
      font: FONTS.some((f) => f.id === raw.f) ? raw.f : FONTS[0].id,
      color: INK_COLORS.some((c) => c.id === raw.c) ? raw.c : INK_COLORS[0].id,
      background: PAPER_COLORS.some((c) => c.id === raw.b) ? raw.b : PAPER_COLORS[0].id,
      size: CODE_TO_SIZE[raw.s] ?? 'medium',
      align: CODE_TO_ALIGN[raw.a] ?? 'center',
    }
  } catch {
    return null
  }
}

export function cardUrl(card: CardData): string {
  return `${location.origin}${location.pathname}#/c/${encodeCard(card)}`
}
