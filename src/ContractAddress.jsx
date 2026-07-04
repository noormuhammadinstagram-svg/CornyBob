import { useCallback, useState } from 'react'
import { motion } from 'motion/react'

/** Replace with your real Solana mint / contract address */
export const CONTRACT_ADDRESS =
  'CornY111111111111111111111111111111111111111'

function shortenAddress(address) {
  if (address.length <= 18) return address
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

function ContractAddress() {
  const [copied, setCopied] = useState(false)

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      const input = document.createElement('input')
      input.value = CONTRACT_ADDRESS
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
  }, [])

  return (
    <motion.div
      className="ca-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ca-section__header">
        <p className="ca-section__eyebrow">Official CA</p>
        <h2 className="ca-section__title">Contract Address</h2>
        <p className="ca-section__subtitle">
          Always verify the contract before you buy. Tap copy and paste it into
          your wallet or swap.
        </p>
      </div>

      <div className="ca-panel">
        <div className="ca-panel__glow" aria-hidden="true" />

        <div className="ca-panel__top">
          <div className="ca-panel__chips">
            <span className="ca-panel__chip">Solana</span>
            <span className="ca-panel__chip ca-panel__chip--soft">CORNY</span>
          </div>
          <span className={`ca-panel__status${copied ? ' is-live' : ''}`}>
            {copied ? 'Copied to clipboard' : 'Ready to copy'}
          </span>
        </div>

        <div className="ca-panel__main">
          <code className="ca-panel__address" title={CONTRACT_ADDRESS}>
            <span className="ca-panel__address-full">{CONTRACT_ADDRESS}</span>
            <span className="ca-panel__address-short">
              {shortenAddress(CONTRACT_ADDRESS)}
            </span>
          </code>

          <button
            type="button"
            className={`ca-panel__copy${copied ? ' is-copied' : ''}`}
            onClick={copyAddress}
            aria-label="Copy contract address"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.55 18.2 3.8 12.45l1.9-1.9 3.85 3.85L18.3 5.65l1.9 1.9z"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  />
                </svg>
                Copy CA
              </>
            )}
          </button>
        </div>

        <p className="ca-panel__hint">
          Double-check the full address before sending funds.
        </p>
      </div>
    </motion.div>
  )
}

export default ContractAddress
