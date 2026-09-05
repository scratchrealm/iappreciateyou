import type { CSSProperties } from 'react'
import type { CardData, CardSide, Orientation } from '../lib/types'
import { cardDims, hasBack } from '../lib/types'
import type { PrintSize } from '../lib/printSizes'
import { PRINT_SIZES, printScale, printSizeLabel } from '../lib/printSizes'
import { Card } from './Card'

// A print-only copy of the card, used by both the sender (while composing) and
// the recipient (while viewing). The on-screen card is scaled by a
// ResizeObserver, which does not re-measure for the print layout, so printing
// renders these copies at the chosen paper size instead (see the print CSS).
// A two-sided card prints as two pages, front then back.
export function PrintArea({ card, size }: { card: CardData; size: PrintSize }) {
  const { w, h } = cardDims(card.orientation)
  const twoSided = hasBack(card)

  return (
    <div
      className="print-area"
      style={
        {
          '--card-w': w,
          '--card-h': h,
          '--print-scale': printScale(size),
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <PrintSheet card={card} side="front" label={twoSided ? 'front' : undefined} />
      {twoSided && <PrintSheet card={card} side="back" label="back" />}
    </div>
  )
}

function PrintSheet({
  card,
  side,
  label,
}: {
  card: CardData
  side: CardSide
  label?: string
}) {
  const { w, h } = cardDims(card.orientation)
  return (
    <div className="print-sheet">
      <div className="print-piece">
        <div className="print-scale-box">
          <div className="print-scale-inner" style={{ width: w, height: h }}>
            <Card data={card} side={side} />
          </div>
        </div>
        {/* Sits outside the cut guide, so it is trimmed away with the margins.
            It tells you which sheet is which when you feed paper twice. */}
        {label && <p className="print-label">{label}</p>}
      </div>
    </div>
  )
}

// Both pages offer the same way out to paper or PDF.
export function PrintButton({ className = 'print-btn' }: { className?: string }) {
  return (
    <button className={className} onClick={() => window.print()}>
      <PrinterIcon />
      Print or save as PDF
    </button>
  )
}

// Compact size chooser, for sitting beside the print button on the view page.
export function PrintSizeSelect({
  value,
  onChange,
  orientation,
}: {
  value: string
  onChange: (id: string) => void
  orientation: Orientation
}) {
  return (
    <label className="print-size">
      <span>Size</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Print size">
        {PRINT_SIZES.map((s) => (
          <option key={s.id} value={s.id}>
            {printSizeLabel(s, orientation)}
          </option>
        ))}
      </select>
    </label>
  )
}

// The same choice as buttons, matching the other controls on the compose page.
export function PrintSizeButtons({
  value,
  onChange,
  orientation,
}: {
  value: string
  onChange: (id: string) => void
  orientation: Orientation
}) {
  return (
    <div className="segmented print-size-buttons">
      {PRINT_SIZES.map((s) => (
        <button
          key={s.id}
          className={s.id === value ? 'seg-btn active' : 'seg-btn'}
          onClick={() => onChange(s.id)}
        >
          {printSizeLabel(s, orientation)}
        </button>
      ))}
    </div>
  )
}

function PrinterIcon() {
  return (
    <svg
      className="print-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </svg>
  )
}
