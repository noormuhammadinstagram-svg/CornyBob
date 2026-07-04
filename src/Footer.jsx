import navLogo from './assets/navlogo.png'
import xLogo from './assets/xlogo.png'
import telegramLogo from './assets/telegram.png'
import desxLogo from './assets/desx.png'

const socials = [
  { label: 'X', href: 'https://x.com/', icon: xLogo },
  { label: 'Telegram', href: 'https://t.me/', icon: telegramLogo },
  { label: 'DexScreener', href: 'https://dexscreener.com/', icon: desxLogo },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a href="#home" className="site-footer__brand">
          <img src={navLogo} alt="Corny on the Bob" />
        </a>

        <p className="site-footer__copy">
          © {year} Corny on the Bob. All rights reserved.
        </p>

        <ul className="site-footer__socials">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                <img src={social.icon} alt="" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
