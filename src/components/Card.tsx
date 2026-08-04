import { useLayoutEffect, useRef, useState } from 'react'
import type { CardData } from '../lib/types'
import { cardDims } from '../lib/types'
import { templateById } from '../lib/templates'
import { fontById, inkById, paperById, SIZE_CAPS, MIN_FONT_SIZE } from '../lib/options'

// Renders a card at its fixed internal size (in card units). Wrap in a
// CardScaler to display at any size. Because the internal size is fixed,
// the fitted font size is identical for the sender and the recipient.
export function Card({ data }: { data: CardData }) {
  const { w, h } = cardDims(data.orientation)
  const template = templateById(data.template)
  const font = fontById(data.font)
  const ink = inkById(data.color)
  const paper = paperById(data.background)

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
  }, [data.message, data.font, data.size, data.orientation, data.template, availW, availH, fontsTick])

  const textStyle = {
    fontFamily: font.family,
    color: ink.value,
    textAlign: data.align,
    lineHeight: 1.35,
  } as const

  const message = data.message.length > 0 ? data.message : ' '

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
    </div>
  )
}
