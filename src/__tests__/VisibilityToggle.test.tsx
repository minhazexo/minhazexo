import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import VisibilityToggle from '@/components/admin/VisibilityToggle'

describe('VisibilityToggle', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const renderToggle = (props: Partial<React.ComponentProps<typeof VisibilityToggle>> = {}) => {
    const onToggle = vi.fn()
    const onError = vi.fn()
    const utils = render(
      <VisibilityToggle
        projectId={7}
        isVisible={true}
        onToggle={onToggle}
        onError={onError}
        {...props}
      />
    )
    return { onToggle, onError, ...utils }
  }

  it('shows Visible/ON state when isVisible is true', () => {
    renderToggle()
    expect(screen.getByText('Visible')).toBeTruthy()
    expect(screen.getByText('ON')).toBeTruthy()
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows Hidden/OFF state when isVisible is false', () => {
    renderToggle({ isVisible: false })
    expect(screen.getByText('Hidden')).toBeTruthy()
    expect(screen.getByText('OFF')).toBeTruthy()
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('PATCHes the visibility endpoint with the new value and reports the confirmed state', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 7, isVisible: false }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { onToggle } = renderToggle()

    fireEvent.click(screen.getByRole('switch'))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/admin/projects/7/visibility',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_visible: false }),
        })
      )
      expect(onToggle).toHaveBeenCalledWith(7, false)
    })

    // UI reflects the new OFF state without a page reload
    expect(screen.getByText('Hidden')).toBeTruthy()
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('blocks duplicate requests while an update is in flight', async () => {
    let resolveFetch: (value: any) => void
    const fetchMock = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve })
    )
    vi.stubGlobal('fetch', fetchMock)

    const { onToggle } = renderToggle()

    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    fireEvent.click(toggle)

    // Only the first click fired a request
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveFetch!({ ok: true, json: async () => ({ id: 7, isVisible: false }) })

    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(7, false))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reverts to the previous state and reports an error when the update fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Failed to update project visibility' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { onToggle, onError } = renderToggle({ isVisible: false })

    fireEvent.click(screen.getByRole('switch'))

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
      // Reverted back to OFF
      expect(screen.getByText('Hidden')).toBeTruthy()
      expect(screen.getByText('OFF')).toBeTruthy()
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    })
    expect(onToggle).not.toHaveBeenCalled()
  })
})
