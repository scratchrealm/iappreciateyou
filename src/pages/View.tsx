import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { decodeCard } from '../lib/encode'
import { cardDims, hasBack } from '../lib/types'
import { Card } from '../components/Card'
import { CardScaler } from '../components/CardScaler'
import { FlipCard, FlipIcon } from '../components/FlipCard'

export function View({ encoded }: { encoded: string }) {
  const card = useMemo(() => decodeCard(encoded), [encoded])
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    document.title = 'a card for you'
    return () => {
      document.title = 'i appreciate you'
    }
  }, [])

  if (!card) {
    return (
      <div className="page view">
        <p className="view-error">
          This link does not seem to be a complete card link. Please check that the
          whole address was copied.
        </p>
      </div>
    )
  }

  const { w, h } = cardDims(card.orientation)
  const twoSided = hasBack(card)

  return (
    <div className="page view">
      <div
        className={twoSided ? 'view-card flippable' : 'view-card'}
        onClick={twoSided ? () => setFlipped((f) => !f) : undefined}
      >
        <div className={twoSided ? 'flip-stage two-sided' : 'flip-stage'}>
          <CardScaler orientation={card.orientation} maxScale={1.4}>
            <FlipCard data={card} flipped={flipped} twoSided={twoSided} />
          </CardScaler>
        </div>
      </div>

      {twoSided && (
        <button
          className="flip-hint"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
        >
          <FlipIcon />
          {flipped ? 'Turn back to the front' : "There's a note on the back — turn it over"}
        </button>
      )}

      {/* Print-only copy: the on-screen card is scaled by a ResizeObserver,
          which does not re-measure for the print layout, so printing renders
          these copies at a fixed mailable size (see the print CSS). A
          two-sided card prints as two pages, front then back. */}
      <div
        className="print-area"
        style={{ '--card-w': w, '--card-h': h } as CSSProperties}
        aria-hidden="true"
      >
        <div className="print-sheet">
          <div className="print-scale-box">
            <div className="print-scale-inner" style={{ width: w, height: h }}>
              <Card data={card} side="front" />
            </div>
          </div>
        </div>
        {twoSided && (
          <div className="print-sheet">
            <div className="print-scale-box">
              <div className="print-scale-inner" style={{ width: w, height: h }}>
                <Card data={card} side="back" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
