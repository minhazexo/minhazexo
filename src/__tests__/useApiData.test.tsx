import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useApiData } from '@/hooks/useApiData'

function TestHarness({ url = '/api/x', fallback = [{ id: 'fallback' }] }: { url?: string; fallback?: any[] }) {
  const { data, loading, error } = useApiData<any>(url, fallback)
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error || ''}</span>
      <span data-testid="count">{data.length}</span>
      <span data-testid="data">{data.map((d: any) => d.id).join(',')}</span>
    </div>
  )
}

const okResponse = (body: any) => ({
  ok: true,
  json: async () => body,
})

describe('useApiData', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('replaces fallback with API data once fetched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([{ id: 'a' }, { id: 'b' }])))
    render(<TestHarness fallback={[{ id: 'fallback' }]} />)
    // fallback rendered initially
    expect(screen.getByTestId('data').textContent).toBe('fallback')
    await waitFor(() => expect(screen.getByTestId('data').textContent).toBe('a,b'))
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('accepts an empty array and clears the fallback data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([])))
    render(<TestHarness fallback={[{ id: 'fallback' }]} />)
    // An empty result (e.g. every project hidden) must NOT keep fallback data
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'))
  })

  it('retries transient failures before giving up', async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) }) // fail
      .mockResolvedValueOnce(okResponse([{ id: 'retried' }])) // success on retry
    vi.stubGlobal('fetch', fetchMock)

    render(<TestHarness />)
    // first attempt fails, second succeeds — advance past the retry delay
    await act(async () => { await vi.advanceTimersByTimeAsync(5000) })
    expect(screen.getByTestId('data').textContent).toBe('retried')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('refetches when the tab regains focus', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okResponse([{ id: 'v1' }]))
      .mockResolvedValueOnce(okResponse([{ id: 'v2' }]))
    vi.stubGlobal('fetch', fetchMock)

    render(<TestHarness />)
    await waitFor(() => expect(screen.getByTestId('data').textContent).toBe('v1'))

    // simulate returning to the tab
    await act(async () => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await waitFor(() => expect(screen.getByTestId('data').textContent).toBe('v2'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
