import { useEffect, useState } from 'react'
import heroDesktop from './assets/herosectiondesktop.png'
import heroMobile from './assets/herosectionmobile.png'
import MouseGlitter from './MouseGlitter'
import Navbar from './Navbar'
import PunchCorny from './PunchCorny'
import AboutCorny from './AboutCorny'
import HowToBuy from './HowToBuy'
import GoldSection from './GoldSection'
import ContractAddress from './ContractAddress'
import Footer from './Footer'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

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

          <div className="hero-intro">
            <h1 className="hero-intro__title">
              Corny on
              <span>the Bob</span>
            </h1>
            <a className="hero-intro__btn" href="#how-to-buy">
              Buy Corny
            </a>
          </div>

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

        <AboutCorny />

        <GoldSection>
          <ContractAddress />
        </GoldSection>

        <HowToBuy />

        <Footer />
      </main>
    </div>
  )
}

export default App
