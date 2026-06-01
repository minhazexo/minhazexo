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
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={() => {
            if (!hasInteracted || !isPlaying) {
              togglePlay()
            } else {
              setShowControls(!showControls)
            }
          }}
          className="w-14 h-14 rounded-full glass-strong flex items-center justify-center text-white shadow-neon relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isPlaying
              ? '0 0 30px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.3)'
              : '0 0 20px rgba(255, 255, 255, 0.1)',
          }}
          title={!hasInteracted ? 'Enable background music' : isPlaying ? 'Pause background music' : 'Play background music'}
          aria-label={!hasInteracted ? 'Enable background music' : isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {!hasInteracted ? (
            <Music className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          ) : (
            <Play className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          )}

          {/* Pulse animation when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Expanded Controls */}
        <AnimatePresence>
          {showControls && hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 glass-strong rounded-2xl p-4 w-64 space-y-4"
            >
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play
                  </>
                )}
              </button>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleMute}
                    className="text-gray-300 hover:text-white transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-xs text-gray-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-cyan-400 cursor-pointer"
                  aria-label="Volume control"
                />
              </div>

              {/* Music Info */}
              <div className="text-center text-xs text-gray-500 border-t border-white/10 pt-3">
                <Music className="w-3 h-3 inline-block mr-1" />
                Copyright-free ambient music
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
            className="fixed bottom-24 right-6 z-50 glass-strong rounded-2xl p-4 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-magenta-500 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm mb-1">Background Music</h4>
                <p className="text-gray-400 text-xs mb-3">
                  Enjoy copyright-free ambient music while browsing my portfolio.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={togglePlay}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Enable
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="flex-1 py-2 rounded-lg glass text-gray-300 text-xs font-medium hover:bg-white/10 transition-colors"
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
