import { useState, useEffect } from 'react'

export function useApiData<T>(
  url: string,
  fallback: T[],
  enabled = true
) {
  const [data, setData] = useState<T[]>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    let cancelled = false

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          if (Array.isArray(json) && json.length > 0) {
            setData(json)
          }
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [url, enabled])

  return { data, loading, error }
}
