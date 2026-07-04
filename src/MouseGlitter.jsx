import { useEffect, useRef } from 'react'

const GOLD_COLORS = [
  '#f5c542',
  '#ffd700',
  '#fff4b0',
  '#ffe066',
  '#ffec8b',
  '#fff8dc',
  '#daa520',
]

function createParticle(x, y) {
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 1.4 + 0.2

  return {
    x: x + (Math.random() - 0.5) * 18,
    y: y + (Math.random() - 0.5) * 18,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - Math.random() * 0.6,
    size: Math.random() * 3.2 + 1,
    life: 1,
    decay: Math.random() * 0.025 + 0.018,
    color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
    sparkle: Math.random() > 0.55,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.2,
  }
}

function MouseGlitter() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    let rafId = 0
    let moving = false
    let stopTimer = 0
    let lastX = 0
    let lastY = 0
    let spawnBudget = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMove = (event) => {
      const x = event.clientX
      const y = event.clientY
      const dx = x - lastX
      const dy = y - lastY
      const distance = Math.hypot(dx, dy)

      lastX = x
      lastY = y
      moving = true
      spawnBudget = Math.min(spawnBudget + distance * 0.35, 18)

      window.clearTimeout(stopTimer)
      stopTimer = window.setTimeout(() => {
        moving = false
        spawnBudget = 0
      }, 90)

      while (spawnBudget >= 1 && particles.length < 120) {
        particles.push(createParticle(x, y))
        spawnBudget -= 1
      }
    }

    const drawStar = (particle) => {
      const spikes = 4
      const outer = particle.size
      const inner = particle.size * 0.35

      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      ctx.beginPath()

      for (let i = 0; i < spikes * 2; i += 1) {
        const radius = i % 2 === 0 ? outer : inner
        const angle = (i * Math.PI) / spikes
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }

      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const fadeBoost = moving ? 1 : 2.4

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.02
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.rotation += particle.spin
        particle.life -= particle.decay * fadeBoost

        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = Math.max(particle.life, 0)
        ctx.fillStyle = particle.color
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.sparkle ? 14 : 8

        if (particle.sparkle) {
          drawStar(particle)
        } else {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      rafId = window.requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(stopTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="mouse-glitter"
      aria-hidden="true"
    />
  )
}

export default MouseGlitter
