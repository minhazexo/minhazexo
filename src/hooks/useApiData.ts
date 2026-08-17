import { useState, useEffect, useCallback, useRef } from 'react'

interface UseApiDataOptions {
  /** Number of retry attempts after a transient failure (default 2) */
  retries?: number
  /** Base delay between retries in ms; grows with each attempt (default 1000) */
  retryDelay?: number
  /** Refetch when the tab regains focus so admin edits appear without a reload (default true) */
  refetchOnFocus?: boolean
}

export function useApiData<T>(
  url: string,
  fallback: T[],
  enabled = true,
  { retries = 2, retryDelay = 1000, refetchOnFocus = true }: UseApiDataOptions = {}
) {
  const [data, setData] = useState<T[]>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const attemptRef = useRef(0)
  const mountedRef = useRef(true)
  const urlRef = useRef(url)
  const enabledRef = useRef(enabled)
  urlRef.current = url
  enabledRef.current = enabled

  const fetchData = useCallback(async () => {
    if (!enabledRef.current) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(urlRef.current)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      if (!mountedRef.current) return
      // Accept empty arrays too — an empty result (e.g. every project hidden)
      // must clear the fallback data instead of silently keeping it.
      if (Array.isArray(json)) setData(json)
      setError(null)
      setLoading(false)
      attemptRef.current = 0
    } catch (err) {
      if (!mountedRef.current) return
      if (attemptRef.current < retries) {
        attemptRef.current += 1
        // Retry transient failures (cold starts, network blips) so the static
        // fallback data is only ever shown when the API is truly unavailable.
        const delay = retryDelay * attemptRef.current
        await new Promise((r) => setTimeout(r, delay))
        if (!mountedRef.current) return
        return fetchData()
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch')
      setLoading(false)
    }
  }, [retries, retryDelay])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  // Keep the section in sync with admin edits: when the user switches back to
  // this tab after updating something in the admin, refetch the latest data.
  useEffect(() => {
    if (!refetchOnFocus) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchData()
    }
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchData, refetchOnFocus])

  return { data, loading, error }
}
