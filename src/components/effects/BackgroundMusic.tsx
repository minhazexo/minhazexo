'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils'
import { audioAssets } from '@/data/assets'

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const playAttemptedRef = useRef(false)
  const playInProgressRef = useRef(false)
  const mountedRef = useRef(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { backgroundMusic: musicUrl } = audioAssets

  // Attempt to play audio, returns true if successful
  const attemptPlay = useCallback(async (audio: HTMLAudioElement): Promise<boolean> => {
    try {
      // If audio hasn't loaded yet, wait for it
      if (audio.readyState < 2) { // HAVE_CURRENT_DATA or less
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener('canplaythrough', onCanPlay)
            audio.removeEventListener('error', onError)
            resolve()
          }
          const onError = () => {
            audio.removeEventListener('canplaythrough', onCanPlay)
            audio.removeEventListener('error', onError)
            reject(new Error('Audio failed to load'))
          }
          audio.addEventListener('canplaythrough', onCanPlay, { once: true })
          audio.addEventListener('error', onError, { once: true })
          audio.load()
        })
      }
      await audio.play()
      return true
    } catch {
      return false
    }
  }, [])

  // Initialize audio on mount and handle reconnection
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.loop = true
    audio.preload = 'auto'

    // Handle audio load errors - attempt to reconnect
    const handleError = () => {
      console.error('Background music failed to load, will retry on next interaction')
      setLoadError(true)
    }

    audio.addEventListener('error', handleError)

    return () => {
      mountedRef.current = false
      audio.pause()
      audio.removeEventListener('error', handleError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-play for returning users who had music enabled
  useEffect(() => {
    const savedPreference = getLocalStorageItem('music-enabled')

    if (savedPreference === 'true') {
      setHasInteracted(true)
      // Attempt auto-play after a short delay to ensure DOM is ready
      const timer = setTimeout(async () => {
        if (!mountedRef.current) return
        const audio = audioRef.current
        if (audio && !playAttemptedRef.current && !playInProgressRef.current) {
          playAttemptedRef.current = true
          playInProgressRef.current = true
          const success = await attemptPlay(audio)
          if (success && mountedRef.current) {
            setIsPlaying(true)
          }
          if (mountedRef.current) {
            playInProgressRef.current = false
          }
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [attemptPlay])

  // Sync volume to audio element without re-render loop
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = isMuted ? 0 : volume
      audio.muted = isMuted
    }
  }, [volume, isMuted])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    // Guard against rapid clicks while a play/pause action is in flight
    if (playInProgressRef.current) return

    setHasInteracted(true)
    playAttemptedRef.current = true

    if (isPlaying) {
      playInProgressRef.current = true
      audio.pause()
      setIsPlaying(false)
      setLocalStorageItem('music-enabled', 'false')
      playInProgressRef.current = false
      return
    }

    // If there was a previous load error, reset and retry
    if (loadError) {
      setLoadError(false)
      audio.src = musicUrl
    }

    playInProgressRef.current = true
    const success = await attemptPlay(audio)
    if (success) {
      setIsPlaying(true)
      setLocalStorageItem('music-enabled', 'true')
    } else {
      console.error('Could not play background music. The audio file may be missing or corrupted.')
    }
    playInProgressRef.current = false
  }, [isPlaying, loadError, musicUrl, attemptPlay])

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    if (audioRef.current) {
      audioRef.current.muted = newMutedState
    }
  }, [isMuted])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const dismissPrompt = useCallback(() => {
    setHasInteracted(true)
    setLocalStorageItem('music-enabled', 'false')
  }, [])

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        aria-label="Background music"
      />

      {/* Music Control Button */}
      <motion.div
        className={`fixed z-50 ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={() => {
            if (!hasInteracted) {
              togglePlay()
              setShowControls(true)
            } else {
              setShowControls(!showControls)
            }
          }}
          style={{
            width: isMobile ? 46 : 54, height: isMobile ? 46 : 54, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            background: 'var(--gradient-primary)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: isPlaying
              ? '0 8px 28px rgba(0, 0, 0, 0.4), 0 0 24px var(--glow-color)'
              : '0 8px 24px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            position: 'relative',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={!hasInteracted ? 'Enable background music' : isPlaying ? 'Pause background music' : 'Play background music'}
          aria-label={!hasInteracted ? 'Enable background music' : isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {!hasInteracted ? (
            <Music style={{ width: isMobile ? 19 : 23, height: isMobile ? 19 : 23, color: '#fff' }} aria-hidden="true" />
          ) : isPlaying ? (
            <Pause style={{ width: isMobile ? 19 : 23, height: isMobile ? 19 : 23, color: '#fff' }} aria-hidden="true" />
          ) : (
            <Play style={{ width: isMobile ? 19 : 23, height: isMobile ? 19 : 23, color: '#fff' }} aria-hidden="true" />
          )}

          {/* Pulse ring when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid var(--primary)' }}
              animate={{ scale: [1, 1.45], opacity: [0.8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* Equalizer dots when playing */}
          {isPlaying && (
            <motion.span
              className="absolute -bottom-1.5 left-1/2"
              style={{ transform: 'translateX(-50%)', display: 'flex', gap: 3 }}
              aria-hidden="true"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--primary)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.22 }}
                />
              ))}
            </motion.span>
          )}
        </motion.button>

        {/* Expanded Controls */}
        <AnimatePresence>
          {showControls && hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              style={{
                position: 'absolute', bottom: isMobile ? 64 : 72, right: 0,
                width: isMobile ? 'min(196px, calc(100vw - 48px))' : 'min(240px, calc(100vw - 48px))',
                padding: isMobile ? 14 : 18,
                borderRadius: isMobile ? 16 : 20,
                background: 'rgba(9, 12, 18, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--border-strong)',
                boxShadow: 'var(--shadow-floating)',
                display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Music style={{ width: isMobile ? 14 : 17, height: isMobile ? 14 : 17, color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                      {isPlaying ? 'Now Playing' : 'Music Player'}
                    </p>
                    <p style={{ fontSize: isMobile ? 10 : 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      Ambient · Lo-fi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowControls(false)}
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  }}
                  aria-label="Close music controls"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, height: isMobile ? 40 : 44, borderRadius: isMobile ? 11 : 12,
                  background: 'var(--gradient-primary)', color: '#fff', fontWeight: 600,
                  fontSize: isMobile ? 13 : 14, border: 'none', cursor: 'pointer',
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} /> Pause
                  </>
                ) : (
                  <>
                    <Play className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} /> Play
                  </>
                )}
              </button>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleMute}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span style={{ fontSize: isMobile ? 10 : 11, color: 'var(--text-muted)' }}>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)', height: 18 }}
                  aria-label="Volume control"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Initial Music Prompt (shown once) */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: isMobile ? 68 : 88, right: isMobile ? 16 : 24, zIndex: 50,
              width: isMobile ? 'min(240px, calc(100vw - 32px))' : 'min(300px, calc(100vw - 48px))',
              padding: isMobile ? 14 : 16,
              borderRadius: isMobile ? 18 : 20,
              background: 'rgba(9, 12, 18, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-floating)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: isMobile ? 40 : 46, height: isMobile ? 40 : 46, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 0 18px var(--glow-color)',
                }}
              >
                <Music style={{ width: isMobile ? 19 : 22, height: isMobile ? 19 : 22, color: '#fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ color: 'var(--text)', fontWeight: 600, fontSize: isMobile ? 13 : 14, marginBottom: 2 }}>
                  Background Music
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? 11 : 12, lineHeight: 1.45, marginBottom: isMobile ? 12 : 14 }}>
                  Lo-fi ambient tracks, free to enjoy while you browse.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={togglePlay}
                    style={{
                      flex: 1, height: isMobile ? 36 : 40, borderRadius: isMobile ? 10 : 11,
                      background: 'var(--gradient-primary)', color: '#fff',
                      fontSize: isMobile ? 12 : 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                    }}
                  >
                    Enable
                  </button>
                  <button
                    onClick={dismissPrompt}
                    style={{
                      flex: 1, height: isMobile ? 36 : 40, borderRadius: isMobile ? 10 : 11,
                      background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)',
                      fontSize: isMobile ? 12 : 13, fontWeight: 500, border: '1px solid var(--border)', cursor: 'pointer',
                    }}
                  >
                    No Thanks
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
