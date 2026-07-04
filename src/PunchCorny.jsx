import { useCallback, useEffect, useRef, useState } from 'react'
import noHitImg from './assets/nohit.png'
import hitImg from './assets/hit.png'
import punchSoundUrl from './assets/Punch Sound Effect.mp3'
import { getVisitorId, isSupabaseConfigured, supabase } from './lib/supabase'

const SOUND_COMBO_MS = 450
const COMBO_DISPLAY_MS = 1600
const MAX_RATE = 2.4
const MIN_RATE = 1.15
const STORAGE_KEY = 'corny-total-bonks'
const LIVE_CHANNEL = 'bonk-live'

function formatNumber(value) {
  return value.toLocaleString('en-US')
}

function getComboLabel(combo) {
  if (combo >= 40) return 'CORN RAGE!'
  if (combo >= 20) return 'MEGA BONK!'
  if (combo >= 10) return 'SUPER BONK!'
  if (combo >= 5) return 'NICE BONK!'
  if (combo >= 1) return 'BONK!'
  return 'START BONKING'
}

function getComboProgress(combo) {
  if (combo <= 0) return 0
  if (combo < 5) return (combo / 5) * 100
  if (combo < 10) return ((combo - 5) / 5) * 100
  if (combo < 20) return ((combo - 10) / 10) * 100
  if (combo < 40) return ((combo - 20) / 20) * 100
  return Math.min(100, ((combo - 40) / 40) * 100)
}

function countPresence(state) {
  return Object.values(state).reduce((total, entries) => total + entries.length, 0)
}

function PunchCorny() {
  const [isHit, setIsHit] = useState(false)
  const [totalBonks, setTotalBonks] = useState(0)
  const [combo, setCombo] = useState(0)
  const [people, setPeople] = useState(isSupabaseConfigured ? 1 : 0)
  const [liveReady, setLiveReady] = useState(false)
  const resetTimer = useRef(0)
  const comboTimer = useRef(0)
  const recentClicks = useRef([])
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const saved = Number(localStorage.getItem(STORAGE_KEY))
      setTotalBonks(Number.isFinite(saved) ? saved : 0)
      setPeople(1)

      const id = window.setInterval(() => {
        setPeople((count) => {
          const drift = Math.floor(Math.random() * 3) - 1
          return Math.max(1, count + drift)
        })
      }, 4000)

      return () => {
        window.clearInterval(id)
        window.clearTimeout(resetTimer.current)
        window.clearTimeout(comboTimer.current)
      }
    }

    let active = true
    const visitorId = getVisitorId()

    const loadStats = async () => {
      const { data, error } = await supabase
        .from('global_stats')
        .select('total_bonks')
        .eq('id', 1)
        .single()

      if (!active || error) return
      setTotalBonks(Number(data?.total_bonks) || 0)
      setLiveReady(true)
    }

    loadStats()

    const statsChannel = supabase
      .channel('global-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_stats',
          filter: 'id=eq.1',
        },
        (payload) => {
          const next = Number(payload.new?.total_bonks)
          if (!Number.isFinite(next)) return
          setTotalBonks(next)
        },
      )
      .subscribe()

    const presenceChannel = supabase.channel(LIVE_CHANNEL, {
      config: {
        presence: {
          key: visitorId,
        },
      },
    })

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        setPeople(Math.max(1, countPresence(presenceChannel.presenceState())))
      })
      .on('presence', { event: 'join' }, () => {
        setPeople(Math.max(1, countPresence(presenceChannel.presenceState())))
      })
      .on('presence', { event: 'leave' }, () => {
        setPeople(Math.max(1, countPresence(presenceChannel.presenceState())))
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return
        await presenceChannel.track({
          online_at: new Date().toISOString(),
          visitor_id: visitorId,
        })
      })

    return () => {
      active = false
      window.clearTimeout(resetTimer.current)
      window.clearTimeout(comboTimer.current)
      supabase.removeChannel(statsChannel)
      supabase.removeChannel(presenceChannel)
    }
  }, [])

  const playPunchSound = useCallback((rate) => {
    const audio = new Audio(punchSoundUrl)
    audio.volume = 0.85
    audio.playbackRate = rate
    audio.preservesPitch = false
    audio.play().catch(() => {})
  }, [])

  const getSoundRate = useCallback(() => {
    const now = performance.now()
    recentClicks.current = recentClicks.current.filter(
      (time) => now - time < SOUND_COMBO_MS,
    )
    recentClicks.current.push(now)
    const streak = recentClicks.current.length
    return Math.min(MAX_RATE, MIN_RATE + (streak - 1) * 0.28)
  }, [])

  const syncPunchToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return

    const { data, error } = await supabase.rpc('increment_bonk')
    if (error) {
      console.error('Failed to sync punch:', error.message)
      return
    }

    if (typeof data === 'number') {
      setTotalBonks((current) => Math.max(current, data))
    }
  }, [])

  const punch = useCallback(() => {
    const rate = getSoundRate()

    setIsHit(true)
    setTotalBonks((count) => {
      const next = count + 1
      if (!isSupabaseConfigured) {
        localStorage.setItem(STORAGE_KEY, String(next))
      }
      return next
    })
    setCombo((count) => count + 1)
    playPunchSound(rate)

    if (isSupabaseConfigured) {
      syncPunchToSupabase()
    }

    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => {
      setIsHit(false)
    }, 120)

    window.clearTimeout(comboTimer.current)
    comboTimer.current = window.setTimeout(() => {
      setCombo(0)
    }, COMBO_DISPLAY_MS)
  }, [getSoundRate, playPunchSound, syncPunchToSupabase])

  const comboProgress = getComboProgress(combo)
  const comboLabel = getComboLabel(combo)

  return (
    <div className="punch-stage">
      <aside className="bonk-stats" aria-label="Bonk stats">
        <article className="bonk-card">
          <p className="bonk-card__label">
            Total Bonks
            {isSupabaseConfigured && liveReady ? (
              <span className="bonk-card__live">Live</span>
            ) : null}
          </p>
          <p className="bonk-card__value bonk-card__value--accent">
            {formatNumber(totalBonks)}
          </p>
          <p className="bonk-card__meta">
            <span className="bonk-card__icon" aria-hidden="true">
              🌽
            </span>
            Bonks
          </p>
        </article>

        <article className="bonk-card">
          <p className="bonk-card__label">Current Combo</p>
          <p className="bonk-card__value bonk-card__value--hot">
            {combo} {combo === 1 ? 'HIT' : 'HITS'}
          </p>
          <p className="bonk-card__status">{comboLabel}</p>
          <div className="bonk-card__bar" aria-hidden="true">
            <span style={{ width: `${comboProgress}%` }} />
          </div>
        </article>

        <article className="bonk-card">
          <p className="bonk-card__label">
            People Bonking Now
            {isSupabaseConfigured ? (
              <span className="bonk-card__live">Live</span>
            ) : null}
          </p>
          <p className="bonk-card__people">
            <span className="bonk-card__people-icon" aria-hidden="true">
              👥
            </span>
            {formatNumber(people)}
          </p>
        </article>
      </aside>

      <div className="punch-corny">
        <button
          type="button"
          className={`punch-corny__btn${isHit ? ' is-hit' : ''}`}
          onPointerDown={(event) => {
            if (event.button !== 0) return
            event.preventDefault()
            punch()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            punch()
          }}
          aria-label="Punch Corny"
        >
          <img
            className={`punch-corny__img punch-corny__img--idle${isHit ? ' is-hidden' : ''}`}
            src={noHitImg}
            alt="Corny ready to get punched"
            draggable="false"
          />
          <img
            className={`punch-corny__img punch-corny__img--hit${isHit ? ' is-visible' : ''}`}
            src={hitImg}
            alt="Corny got punched"
            draggable="false"
          />
        </button>
      </div>
    </div>
  )
}

export default PunchCorny
