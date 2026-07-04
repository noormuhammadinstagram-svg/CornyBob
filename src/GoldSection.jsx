const WAVE_PATH = `M0,48
  C160,28 280,22 420,46
  C560,70 700,110 860,104
  C1020,98 1180,58 1320,44
  C1380,38 1415,40 1440,42`

function WaveDivider({ variant = 'top' }) {
  const isTop = variant === 'top'
  const fill = isTop ? '#f5c542' : '#000'
  const gradientId = isTop ? 'goldWaveShineTop' : 'goldWaveShineBottom'

  return (
    <div
      className={`gold-section__wave gold-section__wave--${variant}`}
      aria-hidden="true"
    >
      <svg
        className="gold-section__wave-svg"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8860b" />
            <stop offset="35%" stopColor="#f5c542" />
            <stop offset="50%" stopColor="#fff4b0" />
            <stop offset="65%" stopColor="#f5c542" />
            <stop offset="100%" stopColor="#b8860b" />
            <animate
              attributeName="x1"
              values="-100%;100%"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;200%"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <path
          className="gold-section__wave-fill"
          fill={fill}
          d={`${WAVE_PATH}
            L1440,160 L0,160 Z`}
        />

        <path
          className="gold-section__wave-line"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={WAVE_PATH}
        />

        <path
          className="gold-section__wave-spark"
          fill="none"
          stroke="#fff8dc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={WAVE_PATH}
        />
      </svg>
    </div>
  )
}

function GoldSection({ children }) {
  return (
    <section className="gold-section" id="contract">
      <WaveDivider variant="top" />
      <div className="gold-section__body">{children}</div>
      <WaveDivider variant="bottom" />
    </section>
  )
}

export default GoldSection
