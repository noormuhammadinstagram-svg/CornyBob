import { useEffect } from 'react'
import navLogo from './assets/navlogo.png'
import xLogo from './assets/xlogo.png'
import telegramLogo from './assets/telegram.png'
import desxLogo from './assets/desx.png'

const mobileLinks = [
  { label: 'About', href: '#about' },
  { label: 'Contract Address', href: '#contract' },
  { label: 'How to Buy', href: '#how-to-buy' },
]

const socials = [
  { label: 'X', href: 'https://x.com/', icon: xLogo },
  { label: 'Telegram', href: 'https://t.me/', icon: telegramLogo },
  { label: 'DexScreener', href: 'https://dexscreener.com/', icon: desxLogo },
]

function Navbar({ menuOpen, onToggle, onClose }) {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`navbar${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar__bar">
        <a href="#home" className="navbar__brand" onClick={onClose}>
          <img src={navLogo} alt="Corny on the Bob" className="navbar__logo" />
        </a>

        <div className="navbar__actions navbar__actions--desktop">
          <ul className="navbar__socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <img src={social.icon} alt="" className="navbar__social-icon" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul className="navbar__socials navbar__socials--bar">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                <img src={social.icon} alt="" className="navbar__social-icon" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`navbar__toggle${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={onToggle}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`navbar__drawer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__links navbar__links--mobile">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={onClose}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          className="navbar__buy-btn"
          href="#how-to-buy"
          onClick={onClose}
        >
          Buy Corny
        </a>
      </div>

      <button
        type="button"
        className={`navbar__backdrop${menuOpen ? ' is-open' : ''}`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={onClose}
      />
    </header>
  )
}

export default Navbar
