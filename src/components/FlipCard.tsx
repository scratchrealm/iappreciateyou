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

// A card with an arrow arcing over the top of it: "turn this over".
export function FlipIcon() {
  return (
    <svg
      className="flip-icon"
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.2" y="10.6" width="15.6" height="9.6" rx="1.8" />
      <path d="M6.4 8.4 A 6.6 5.4 0 0 1 17.6 8.4" />
      <path d="M15 6.9 L 17.9 8.6 L 16.4 11.4" />
    </svg>
  )
}
