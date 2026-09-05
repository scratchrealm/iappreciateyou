import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CardData, CardSide, Orientation, TextAlign, TextSize } from '../lib/types'
import { hasBack } from '../lib/types'
import { FONTS, INK_COLORS, PAPER_COLORS, MAX_MESSAGE_LENGTH } from '../lib/options'
import { templateById } from '../lib/templates'
import { cardUrl } from '../lib/encode'
import { CardScaler } from '../components/CardScaler'
import { FlipCard } from '../components/FlipCard'
import { PrintArea, PrintButton } from '../components/PrintArea'

const DEFAULT_MESSAGE = ''

export function Compose({ templateId, orientation }: { templateId: string; orientation: Orientation }) {
  const template = templateById(templateId)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const [back, setBack] = useState('')
  const [side, setSide] = useState<CardSide>('front')
  const [font, setFont] = useState(FONTS[0].id)
  const [color, setColor] = useState(INK_COLORS[0].id)
  const [background, setBackground] = useState(PAPER_COLORS[0].id)
  const [size, setSize] = useState<TextSize>('medium')
  const [align, setAlign] = useState<TextAlign>('center')
  const [copied, setCopied] = useState(false)

  const card: CardData = {
    template: template.id,
    orientation,
    message,
    back,
    font,
    color,
    background,
    size,
    align,
  }

  const twoSided = hasBack(card)
  const url = useMemo(() => (message.trim() || back.trim() ? cardUrl(card) : ''), [
    template.id,
    orientation,
    message,
    back,
    font,
    color,
    background,
    size,
    align,
  ])

  // Turning the preview over is only meaningful once there is a back to see,
  // or to get back to the front while writing an empty one.
  const canFlipPreview = twoSided || side === 'back'

  // Picking a side from the tabs means you are about to write on it. Flipping
  // the preview does not, so it deliberately does not grab focus.
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chooseSide = (s: CardSide) => {
    setSide(s)
    textareaRef.current?.focus()
  }

  const copyLink = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable; the user can still copy from the input.
    }
  }

  let sideHint: ReactNode
  if (side === 'back') {
    sideHint = twoSided
      ? 'Whoever opens your card will see a turned-up corner and a nudge to turn it over.'
      : 'Leave this blank and your card stays one-sided.'
  } else if (twoSided && !message.trim()) {
    sideHint = 'A blank front is fine — it becomes a plain cover for the note on the back.'
  } else if (twoSided) {
    sideHint = 'Your card has two sides. Recipients start on the front.'
  } else {
    sideHint = (
      <>
        Want to say more?{' '}
        <button className="linkish" onClick={() => chooseSide('back')}>
          Add a note on the back
        </button>
        .
      </>
    )
  }

  return (
    <div className="page compose">
      <header className="compose-header">
        <a className="back-link" href="#/">
          Back to designs
        </a>
        <h1>
          {template.name} <span className="muted">({orientation})</span>
        </h1>
      </header>

      <div className="compose-layout">
        <div
          className={canFlipPreview ? 'compose-preview flippable' : 'compose-preview'}
          onClick={canFlipPreview ? () => setSide(side === 'front' ? 'back' : 'front') : undefined}
        >
          <CardScaler orientation={orientation}>
            <FlipCard data={card} flipped={side === 'back'} twoSided={twoSided} />
          </CardScaler>
        </div>

        <div className="compose-controls">
          <div className="side-row">
            <label className="control-label" htmlFor="message">
              Your message
            </label>
            <div className="segmented side-tabs">
              {(['front', 'back'] as const).map((s) => (
                <button
                  key={s}
                  className={s === side ? 'seg-btn active' : 'seg-btn'}
                  onClick={() => chooseSide(s)}
                >
                  {s === 'front' ? 'Front' : 'Back'}
                  {s === 'back' && twoSided && <span className="side-dot" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>
          <textarea
            id="message"
            ref={textareaRef}
            value={side === 'front' ? message : back}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={
              side === 'front'
                ? 'Write your note here. It will fit itself to the card.'
                : 'Write the back of the card here.'
            }
            onChange={(e) => (side === 'front' ? setMessage(e.target.value) : setBack(e.target.value))}
            rows={5}
            autoFocus
          />
          <p className="side-hint">{sideHint}</p>

          <span className="control-label">Font</span>
          <div className="font-grid">
            {FONTS.map((f) => (
              <button
                key={f.id}
                className={f.id === font ? 'font-btn active' : 'font-btn'}
                style={{ fontFamily: f.family }}
                onClick={() => setFont(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>

          <span className="control-label">Ink</span>
          <div className="swatch-row">
            {INK_COLORS.map((c) => (
              <button
                key={c.id}
                className={c.id === color ? 'swatch active' : 'swatch'}
                style={{ background: c.value }}
                title={c.name}
                aria-label={`Ink color ${c.name}`}
                onClick={() => setColor(c.id)}
              />
            ))}
          </div>

          <span className="control-label">Paper</span>
          <div className="swatch-row">
            {PAPER_COLORS.map((c) => (
              <button
                key={c.id}
                className={c.id === background ? 'swatch paper active' : 'swatch paper'}
                style={{ background: c.value }}
                title={c.name}
                aria-label={`Paper color ${c.name}`}
                onClick={() => setBackground(c.id)}
              />
            ))}
          </div>

          <span className="control-label">Text size</span>
          <div className="segmented">
            {(['small', 'medium', 'large'] as const).map((s) => (
              <button key={s} className={s === size ? 'seg-btn active' : 'seg-btn'} onClick={() => setSize(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <span className="control-label">Alignment</span>
          <div className="segmented">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button key={a} className={a === align ? 'seg-btn active' : 'seg-btn'} onClick={() => setAlign(a)}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>

          <div className="link-section">
            <span className="control-label">Your card link</span>
            {url ? (
              <>
                <input className="link-input" readOnly value={url} onFocus={(e) => e.target.select()} />
                <div className="link-actions">
                  <button className="primary-btn" onClick={copyLink}>
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a className="open-link" href={url} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                </div>
                <p className="link-hint">
                  Send this link by email, text, or however you like. Whoever opens it
                  will see your card, exactly as it looks here
                  {twoSided ? ', and can turn it over to read the back.' : '.'}
                </p>
              </>
            ) : (
              <p className="link-hint">Write a message above and your link will appear here.</p>
            )}
          </div>

          {url && (
            <div className="link-section">
              <span className="control-label">Or print it</span>
              <div className="link-actions">
                <PrintButton className="secondary-btn" />
              </div>
              <p className="link-hint">
                Prints at about 5 by 7 inches
                {twoSided ? ', front and back on separate pages, ' : ', '}
                with a dashed line to cut along. Your browser's print dialog can save it
                as a PDF instead.
              </p>
            </div>
          )}
        </div>
      </div>

      <PrintArea card={card} />
    </div>
  )
}
