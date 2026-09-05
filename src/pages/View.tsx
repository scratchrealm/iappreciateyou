import { useEffect, useMemo, useState } from 'react'
import { decodeCard } from '../lib/encode'
import { hasBack } from '../lib/types'
import { CardScaler } from '../components/CardScaler'
import { FlipCard, FlipIcon } from '../components/FlipCard'
import { PrintArea, PrintButton } from '../components/PrintArea'

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

      <div className="view-actions">
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
        <PrintButton />
      </div>

      <PrintArea card={card} />
    </div>
  )
}
