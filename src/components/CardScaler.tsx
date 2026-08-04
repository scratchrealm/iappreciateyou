import { useLayoutEffect, useRef, useState } from 'react'
import type { CardData } from '../lib/types'
import { cardDims } from '../lib/types'
import { Card } from './Card'

// Displays a Card scaled to fit its container while keeping the card's
// internal layout (and therefore the fitted text) exactly the same.
export function CardScaler({ data, maxScale = 1 }: { data: CardData; maxScale?: number }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const { w, h } = cardDims(data.orientation)

  useLayoutEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const update = () => {
      const rect = outer.getBoundingClientRect()
      if (rect.width === 0) return
      setScale(Math.min(rect.width / w, rect.height > 0 ? rect.height / h : Infinity, maxScale))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    return () => observer.disconnect()
  }, [w, h, maxScale])

  return (
    <div ref={outerRef} className="card-scaler-outer">
      {scale > 0 && (
        <div className="card-scaler-box" style={{ width: w * scale, height: h * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: w, height: h }}>
            <Card data={data} />
          </div>
        </div>
      )}
    </div>
  )
}
