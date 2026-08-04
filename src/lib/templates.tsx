import type { ReactNode } from 'react'

export interface CardTemplate {
  id: string
  name: string
  // Insets (in card units) between the card edge and the text area
  padX: number
  padY: number
  render: (w: number, h: number) => ReactNode
}

// Builds a rectangle path whose edges are rows of inward-facing scallop bumps.
function scallopPath(x: number, y: number, w: number, h: number, r: number): string {
  const parts: string[] = [`M ${x} ${y}`]
  const edge = (len: number) => {
    const n = Math.max(1, Math.round(len / (2 * r)))
    const step = len / n
    return { n, rx: step / 2 }
  }
  const top = edge(w)
  for (let i = 0; i < top.n; i++) parts.push(`a ${top.rx} ${r} 0 0 1 ${top.rx * 2} 0`)
  const right = edge(h)
  for (let i = 0; i < right.n; i++) parts.push(`a ${r} ${right.rx} 0 0 1 0 ${right.rx * 2}`)
  const bottom = edge(w)
  for (let i = 0; i < bottom.n; i++) parts.push(`a ${bottom.rx} ${r} 0 0 1 ${-bottom.rx * 2} 0`)
  const left = edge(h)
  for (let i = 0; i < left.n; i++) parts.push(`a ${r} ${left.rx} 0 0 1 0 ${-left.rx * 2}`)
  parts.push('Z')
  return parts.join(' ')
}

// Deterministic dot positions for the confetti border, kept in the margin band.
function confettiDots(w: number, h: number): { x: number; y: number; r: number; fill: string }[] {
  const palette = ['#d98e7a', '#8fae8b', '#8ca3c4', '#c9a86a', '#b48ab4']
  const dots: { x: number; y: number; r: number; fill: string }[] = []
  let seed = 7
  const rand = () => {
    seed = (seed * 48271) % 2147483647
    return seed / 2147483647
  }
  const band = 52
  const count = Math.round((w + h) / 22)
  for (let i = 0; i < count; i++) {
    const side = i % 4
    let x: number, y: number
    if (side === 0) {
      x = 20 + rand() * (w - 40)
      y = 14 + rand() * band
    } else if (side === 1) {
      x = 20 + rand() * (w - 40)
      y = h - 14 - rand() * band
    } else if (side === 2) {
      x = 14 + rand() * band
      y = 20 + rand() * (h - 40)
    } else {
      x = w - 14 - rand() * band
      y = 20 + rand() * (h - 40)
    }
    dots.push({ x, y, r: 3 + rand() * 4, fill: palette[i % palette.length] })
  }
  return dots
}

// A small leaf sprig used by the "Sage corners" template.
function Sprig({ color }: { color: string }) {
  const leaf = (cx: number, cy: number, angle: number) => (
    <ellipse
      key={`${cx}-${cy}`}
      cx={cx}
      cy={cy}
      rx={16}
      ry={7}
      fill={color}
      opacity={0.85}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  )
  return (
    <g>
      <path
        d="M 0 0 Q 60 10 130 70"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {leaf(28, -4, -20)}
      {leaf(58, 8, 10)}
      {leaf(90, 30, 35)}
      {leaf(118, 56, 50)}
      {leaf(46, 24, 60)}
      {leaf(78, 48, 75)}
    </g>
  )
}

export const TEMPLATES: CardTemplate[] = [
  {
    id: 'simple',
    name: 'Simple',
    padX: 64,
    padY: 60,
    render: () => null,
  },
  {
    id: 'double',
    name: 'Double line',
    padX: 72,
    padY: 66,
    render: (w, h) => (
      <g stroke="#8a8378" fill="none">
        <rect x={22} y={22} width={w - 44} height={h - 44} strokeWidth={2.5} />
        <rect x={34} y={34} width={w - 68} height={h - 68} strokeWidth={1} />
      </g>
    ),
  },
  {
    id: 'corners',
    name: 'Corner lines',
    padX: 76,
    padY: 70,
    render: (w, h) => {
      const i = 26
      const len = 46
      const c = '#b08d3e'
      return (
        <g fill="none">
          <rect x={i} y={i} width={w - 2 * i} height={h - 2 * i} stroke={c} strokeWidth={1} opacity={0.6} />
          <g stroke={c} strokeWidth={3.5} strokeLinecap="round">
            <path d={`M ${i} ${i + len} V ${i} H ${i + len}`} />
            <path d={`M ${w - i - len} ${i} H ${w - i} V ${i + len}`} />
            <path d={`M ${w - i} ${h - i - len} V ${h - i} H ${w - i - len}`} />
            <path d={`M ${i + len} ${h - i} H ${i} V ${h - i - len}`} />
          </g>
        </g>
      )
    },
  },
  {
    id: 'rounded',
    name: 'Rounded',
    padX: 72,
    padY: 66,
    render: (w, h) => (
      <rect
        x={22}
        y={22}
        width={w - 44}
        height={h - 44}
        rx={30}
        fill="none"
        stroke="#7d99ae"
        strokeWidth={2.5}
      />
    ),
  },
  {
    id: 'dashed',
    name: 'Dashed',
    padX: 72,
    padY: 66,
    render: (w, h) => (
      <rect
        x={24}
        y={24}
        width={w - 48}
        height={h - 48}
        rx={18}
        fill="none"
        stroke="#a1734b"
        strokeWidth={2.5}
        strokeDasharray="11 9"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: 'dotted',
    name: 'Dotted',
    padX: 72,
    padY: 66,
    render: (w, h) => (
      <rect
        x={26}
        y={26}
        width={w - 52}
        height={h - 52}
        fill="none"
        stroke="#9a6b8f"
        strokeWidth={4}
        strokeDasharray="0 15"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: 'scallop',
    name: 'Scallop',
    padX: 78,
    padY: 72,
    render: (w, h) => (
      <path
        d={scallopPath(30, 30, w - 60, h - 60, 12)}
        fill="none"
        stroke="#c27b8e"
        strokeWidth={2}
      />
    ),
  },
  {
    id: 'bands',
    name: 'Bands',
    padX: 64,
    padY: 84,
    render: (w, h) => (
      <g fill="#bf6b4f">
        <rect x={0} y={0} width={w} height={14} />
        <rect x={0} y={h - 14} width={w} height={14} />
        <rect x={0} y={22} width={w} height={2} opacity={0.55} />
        <rect x={0} y={h - 24} width={w} height={2} opacity={0.55} />
      </g>
    ),
  },
  {
    id: 'deco',
    name: 'Deco',
    padX: 80,
    padY: 74,
    render: (w, h) => {
      const o = 20
      const i = 32
      const d = 7
      const diamond = (cx: number, cy: number) => (
        <path
          key={`${cx}-${cy}`}
          d={`M ${cx} ${cy - d} L ${cx + d} ${cy} L ${cx} ${cy + d} L ${cx - d} ${cy} Z`}
          fill="#b08d3e"
        />
      )
      return (
        <g>
          <rect x={o} y={o} width={w - 2 * o} height={h - 2 * o} fill="none" stroke="#3f3b36" strokeWidth={1.5} />
          <rect x={i} y={i} width={w - 2 * i} height={h - 2 * i} fill="none" stroke="#b08d3e" strokeWidth={1} />
          {diamond(i, i)}
          {diamond(w - i, i)}
          {diamond(i, h - i)}
          {diamond(w - i, h - i)}
        </g>
      )
    },
  },
  {
    id: 'sage',
    name: 'Sage corners',
    padX: 76,
    padY: 76,
    render: (w, h) => (
      <g>
        <g transform="translate(26 30)">
          <Sprig color="#7d9070" />
        </g>
        <g transform={`translate(${w - 26} ${h - 30}) rotate(180)`}>
          <Sprig color="#7d9070" />
        </g>
      </g>
    ),
  },
  {
    id: 'confetti',
    name: 'Confetti',
    padX: 78,
    padY: 74,
    render: (w, h) => (
      <g>
        {confettiDots(w, h).map((dot, idx) => (
          <circle key={idx} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.fill} opacity={0.75} />
        ))}
      </g>
    ),
  },
  {
    id: 'frame',
    name: 'Bold frame',
    padX: 76,
    padY: 70,
    render: (w, h) => (
      <g fill="none">
        <rect x={18} y={18} width={w - 36} height={h - 36} stroke="#33465e" strokeWidth={12} />
        <rect x={34} y={34} width={w - 68} height={h - 68} stroke="#33465e" strokeWidth={1} opacity={0.5} />
      </g>
    ),
  },
]

export function templateById(id: string): CardTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
