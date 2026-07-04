import { motion } from 'motion/react'
import cornyAboutImg from './assets/cornyabout.png'
import AboutCornField from './AboutCornField'

const highlights = [
  {
    title: 'Born in the Cornfield',
    text: 'Corny on the Bob is the golden meme king of Solana — part corn, part Bob, all chaos.',
  },
  {
    title: 'Built for Bonking',
    text: 'Tap Bob, stack combos, and watch the live bonk counter climb with the whole corn gang.',
  },
  {
    title: 'Community First',
    text: 'No fluff, just vibes. Hold CORNY, share the memes, and grow the field together.',
  },
]

function AboutCorny() {
  return (
    <section className="about-corny" id="about">
      <AboutCornField />
      <div className="about-corny__inner">
        <motion.div
          className="about-corny__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about-corny__eyebrow">Meet the legend</p>
          <h2 className="about-corny__title">About Corny</h2>

          <div className="about-corny__grid">
            {highlights.map((item, index) => (
              <motion.article
                key={item.title}
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="about-corny__art"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={cornyAboutImg} alt="Corny on the Bob" />
        </motion.div>
      </div>
    </section>
  )
}

export default AboutCorny
