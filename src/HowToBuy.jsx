import { motion } from 'motion/react'
import phantomImg from './assets/phantom.png'
import solanaImg from './assets/solana.png'
import convertImg from './assets/convert.png'
import buyCornyImg from './assets/buycorny.png'
import AboutCornField from './AboutCornField'

const steps = [
  {
    step: '01',
    title: 'Download Phantom',
    text: 'Grab the Phantom wallet and set up your Solana account in minutes.',
    image: phantomImg,
    alt: 'Phantom wallet',
  },
  {
    step: '02',
    title: 'Buy Some SOL',
    text: 'Fund your wallet with SOL so you are ready to swap for CORNY.',
    image: solanaImg,
    alt: 'Solana coins',
  },
  {
    step: '03',
    title: 'Swap for CORNY',
    text: 'Open your favorite Solana swap and trade SOL for CORNY on the Bob.',
    image: convertImg,
    alt: 'Swap tokens',
  },
  {
    step: '04',
    title: 'Welcome to Corn Gang',
    text: 'You are in. Hold CORNY, bonk Bob, and join the cornfield chaos.',
    image: buyCornyImg,
    alt: 'Buff Corny on the Bob',
  },
]

function HowToBuy() {
  return (
    <section className="how-to-buy" id="how-to-buy">
      <AboutCornField />
      <div className="how-to-buy__inner">
        <motion.div
          className="how-to-buy__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="how-to-buy__eyebrow">Get in the field</p>
          <h2 className="how-to-buy__title">How to Buy Corny</h2>
          <p className="how-to-buy__subtitle">
            Four easy steps to join Corny on the Bob.
          </p>
        </motion.div>

        <div className="how-to-buy__grid">
          {steps.map((item, index) => (
            <motion.article
              key={item.step}
              className="how-card"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="how-card__badge">{item.step}</div>

              <div className="how-card__media">
                <img src={item.image} alt={item.alt} loading="lazy" />
              </div>

              <div className="how-card__body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowToBuy
