import { useState } from 'react'
import type { Orientation } from '../lib/types'
import { TEMPLATES } from '../lib/templates'
import { Card } from '../components/Card'
import { CardScaler } from '../components/CardScaler'

const SAMPLE_MESSAGE = 'thank you for being you'

export function Home() {
  const [orientation, setOrientation] = useState<Orientation>('landscape')

  return (
    <div className="page home">
      <header className="home-header">
        <h1>i appreciate you</h1>
        <p className="tagline">
          The simplest way to send a little card to someone. Pick a design, write your
          note, and share the link however you like. No accounts, no ads, no tracking.
        </p>
      </header>

      <div className="orientation-toggle" role="group" aria-label="Card orientation">
        <button
          className={orientation === 'landscape' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setOrientation('landscape')}
        >
          Landscape
        </button>
        <button
          className={orientation === 'portrait' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setOrientation('portrait')}
        >
          Portrait
        </button>
      </div>

      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <a
            key={t.id}
            className="template-tile"
            href={`#/compose/${t.id}/${orientation}`}
            aria-label={`Choose the ${t.name} design`}
          >
            <div className={orientation === 'landscape' ? 'tile-preview landscape' : 'tile-preview portrait'}>
              <CardScaler orientation={orientation}>
                <Card
                  data={{
                    template: t.id,
                    orientation,
                    message: SAMPLE_MESSAGE,
                    back: '',
                    font: 'caveat',
                    color: 'ink',
                    background: 'white',
                    size: 'small',
                    align: 'center',
                  }}
                />
              </CardScaler>
            </div>
            <span className="tile-name">{t.name}</span>
          </a>
        ))}
      </div>

      <footer className="home-footer">
        <p>
          A small project by Jeremy Magland. The card lives entirely in the link you
          share; nothing is stored on any server.
        </p>
      </footer>
    </div>
  )
}
