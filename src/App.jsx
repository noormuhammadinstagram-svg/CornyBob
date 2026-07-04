import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import heroDesktop from './assets/herosectiondesktop.png'
import heroMobile from './assets/herosectionmobile.png'
import MouseGlitter from './MouseGlitter'
import Navbar from './Navbar'
import PunchCorny from './PunchCorny'
import './App.css'

function SpinningBlob() {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.35
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.4}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#f5c542"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 2]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#f5c542" />
      <SpinningBlob />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  )
}

const stack = [
  { name: 'GSAP', desc: 'Timeline & scroll animations' },
  { name: 'Motion', desc: 'UI motion from motion.dev' },
  { name: 'Three.js', desc: 'WebGL 3D rendering' },
  { name: 'R3F + Drei', desc: 'React Three Fiber helpers' },
]

function App() {
  const cardsRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children ?? [], {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((open) => !open)

  return (
    <div className="app">
      <MouseGlitter />
      <Navbar
        menuOpen={menuOpen}
        onToggle={toggleMenu}
        onClose={closeMenu}
      />

      <main className="site-content" id="home">
        <header className="hero">
            <img
              className="hero-image hero-image--mobile"
              src={heroMobile}
              alt="Golden cornfield path at night"
            />
            <img
              className="hero-image hero-image--desktop"
              src={heroDesktop}
              alt="Golden cornfield path at night"
            />

            <PunchCorny />

            <div className="hero-wave" aria-hidden="true">
              <svg
                className="hero-wave__svg"
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="goldShine"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
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
                  className="hero-wave__fill"
                  fill="#000"
                  d="M0,72
                    C110,48 190,28 290,34
                    C390,40 450,78 560,86
                    C670,94 760,58 880,48
                    C1000,38 1120,62 1240,78
                    C1320,88 1388,92 1440,88
                    L1440,160 L0,160 Z"
                />
                <path
                  className="hero-wave__line"
                  fill="none"
                  stroke="url(#goldShine)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M0,72
                    C110,48 190,28 290,34
                    C390,40 450,78 560,86
                    C670,94 760,58 880,48
                    C1000,38 1120,62 1240,78
                    C1320,88 1388,92 1440,88"
                />
                <path
                  className="hero-wave__spark"
                  fill="none"
                  stroke="#fff8dc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M0,72
                    C110,48 190,28 290,34
                    C390,40 450,78 560,86
                    C670,94 760,58 880,48
                    C1000,38 1120,62 1240,78
                    C1320,88 1388,92 1440,88"
                />
              </svg>
            </div>
          </header>

          <section className="after-hero">
            <section className="scene-wrap" aria-label="3D scene">
              <Scene />
            </section>

            <section className="stack" ref={cardsRef}>
              {stack.map((item) => (
                <motion.article
                  key={item.name}
                  className="card"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <h2>{item.name}</h2>
                  <p>{item.desc}</p>
                </motion.article>
              ))}
            </section>
        </section>
      </main>
    </div>
  )
}

export default App
