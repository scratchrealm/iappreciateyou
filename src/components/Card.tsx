import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CardData, CardSide } from '../lib/types'
import { cardDims, sideText } from '../lib/types'
import { templateById } from '../lib/templates'
import { fontById, inkById, paperById, darken, SIZE_CAPS, MIN_FONT_SIZE } from '../lib/options'

// Reach of the folded corner along each edge, in card units.
const CURL_SIZE = 58

// Renders one side of a card at its fixed internal size (in card units). Wrap
// in a CardScaler to display at any size. Because the internal size is fixed,
// the fitted font size is identical for the sender and the recipient.
export function Card({
  data,
  side = 'front',
  curl = false,
}: {
  data: CardData
  side?: CardSide
  // Draws a turned-up corner, hinting that the card has another side.
  curl?: boolean
}) {
  const { w, h } = cardDims(data.orientation)
  const template = templateById(data.template)
  const font = fontById(data.font)
  const ink = inkById(data.color)
  const paper = paperById(data.background)
  const text = sideText(data, side)

  const availW = w - 2 * template.padX
  const availH = h - 2 * template.padY

  const measureRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number>(SIZE_CAPS[data.size])
  const [fontsTick, setFontsTick] = useState(0)

  // Re-fit once web fonts finish loading, since metrics change.
  useLayoutEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsTick((t) => t + 1)
    })
    return () => {
      cancelled = true
    }
  }, [data.font])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const fits = (size: number) => {
      el.style.fontSize = `${size}px`
      return el.scrollHeight <= availH && el.scrollWidth <= availW + 1
    }
    let lo = MIN_FONT_SIZE
    let hi = SIZE_CAPS[data.size]
    let best = lo
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (fits(mid)) {
        best = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    setFontSize(best)
  }, [text, data.font, data.size, data.orientation, data.template, availW, availH, fontsTick])

  const textStyle = {
    fontFamily: font.family,
    color: ink.value,
    textAlign: data.align,
    lineHeight: 1.35,
  } as const

  const message = text.length > 0 ? text : ' '

  return (
    <div className="card" style={{ width: w, height: h, background: paper.value }}>
      <svg
        className="card-border"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
      >
        {template.render(w, h)}
      </svg>
      <div
        className="card-text-area"
        style={{ left: template.padX, right: template.padX, top: template.padY, bottom: template.padY }}
      >
        <div className="card-text" style={{ ...textStyle, fontSize }}>
          {message}
        </div>
      </div>
      <div
        ref={measureRef}
        className="card-text card-text-measure"
        style={{ ...textStyle, width: availW }}
        aria-hidden="true"
      >
        {message}
      </div>
      {curl && <CurledCorner w={w} h={h} paper={paper.value} />}
    </div>
  )
}

// A turned-up bottom-right corner: a shadow cast onto the card, the flap
// itself shaded like the reverse of the paper, and a crease along the fold.
function CurledCorner({ w, h, paper }: { w: number; h: number; paper: string }) {
  const uid = useId()
  const gradId = `curl-grad-${uid}`
  const blurId = `curl-blur-${uid}`
  const s = CURL_SIZE
  const flap = `M ${w - s} ${h} L ${w} ${h - s} L ${w} ${h} Z`

  return (
    <svg
      className="card-curl"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1={w - s}
          y1={h - s}
          x2={w}
          y2={h}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={darken(paper, 0.03)} />
          <stop offset="1" stopColor={darken(paper, 0.32)} />
        </linearGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        d={flap}
        fill="rgba(62, 52, 42, 0.4)"
        filter={`url(#${blurId})`}
        transform="translate(-7 -7)"
      />
      <path d={flap} fill={`url(#${gradId})`} />
      <path
        d={`M ${w - s} ${h} L ${w} ${h - s}`}
        fill="none"
        stroke={darken(paper, 0.2)}
        strokeWidth={1.2}
      />
    </svg>
  )
}
