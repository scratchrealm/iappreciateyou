import type { CardData } from '../lib/types'
import { cardDims } from '../lib/types'
import { Card } from './Card'

// Both sides of a card stacked in a 3D flip. Rotating negatively swings the
// right-hand edge toward the viewer, which is the direction the turned-up
// bottom-right corner invites.
export function FlipCard({
  data,
  flipped,
  twoSided,
}: {
  data: CardData
  flipped: boolean
  // Whether to show the turned-up corner on each side.
  twoSided: boolean
}) {
  const { w, h } = cardDims(data.orientation)

  return (
    <div className="flip-card" style={{ width: w, height: h }}>
      <div
        className="flip-inner"
        style={{ transform: flipped ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
      >
        <div className="flip-face" aria-hidden={flipped}>
          <Card data={data} side="front" curl={twoSided} />
        </div>
        <div
          className="flip-face"
          style={{ transform: 'rotateY(180deg)' }}
          aria-hidden={!flipped}
        >
          <Card data={data} side="back" curl={twoSided} />
        </div>
      </div>
    </div>
  )
}

// Deliberately a plain rotate glyph — anything more detailed turns to mush at
// this size, and the pill's wording already says what the gesture is.
export function FlipIcon() {
  return (
    <svg
      className="flip-icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  )
}
