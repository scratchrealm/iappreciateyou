import { useEffect, useMemo } from 'react'
import { decodeCard } from '../lib/encode'
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

  return (
    <div className="page view">
      <div className="view-card">
        <CardScaler data={card} maxScale={1.4} />
      </div>
    </div>
  )
}
