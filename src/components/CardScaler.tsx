import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Orientation } from '../lib/types'
import { cardDims } from '../lib/types'

// Displays card-sized content scaled to fit its container while keeping the
// card's internal layout (and therefore the fitted text) exactly the same.
export function CardScaler({
  orientation,
  maxScale = 1,
  children,
}: {
  orientation: Orientation
  maxScale?: number
  children: ReactNode
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const { w, h } = cardDims(orientation)

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
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
