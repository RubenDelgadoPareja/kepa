import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useWillUnmount } from './useWillUnmount'

describe('useWillUnmount', () => {
  it('no ejecuta el callback al montar', () => {
    const callback = vi.fn()
    renderHook(() => useWillUnmount(callback))
    expect(callback).not.toHaveBeenCalled()
  })

  it('no ejecuta el callback al rerenderizar', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(() => useWillUnmount(callback))
    rerender()
    rerender()
    expect(callback).not.toHaveBeenCalled()
  })

  it('ejecuta el callback al desmontar', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useWillUnmount(callback))
    unmount()
    expect(callback).toHaveBeenCalledOnce()
  })
})
