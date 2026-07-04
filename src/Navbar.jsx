import { useEffect } from 'react'
import navLogo from './assets/navlogo.png'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'How to Buy', href: '#how-to-buy' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Community', href: '#community' },
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

        <ul className="navbar__links navbar__links--desktop">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
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
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={onClose}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
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
