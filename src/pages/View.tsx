import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { decodeCard } from '../lib/encode'
import { cardDims } from '../lib/types'
import { Card } from '../components/Card'
import { CardScaler } from '../components/CardScaler'

export function View({ encoded }: { encoded: string }) {
  const card = useMemo(() => decodeCard(encoded), [encoded])

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

  return (
    <div className="page view">
      <div className="view-card">
        <CardScaler data={card} maxScale={1.4} />
      </div>
      {/* Print-only copy: the on-screen card is scaled by a ResizeObserver,
          which does not re-measure for the print layout, so printing renders
          this second copy at a fixed mailable size (see the print CSS). */}
      <div
        className="print-card"
        style={{ '--card-w': w, '--card-h': h } as CSSProperties}
        aria-hidden="true"
      >
        <div className="print-scale-box">
          <div className="print-scale-inner" style={{ width: w, height: h }}>
            <Card data={card} />
          </div>
        </div>
      </div>
    </div>
  )
}
