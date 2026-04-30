import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDidMount } from './useDidMount'

describe('useDidMount', () => {
  it('ejecuta el callback al montar', () => {
    const callback = vi.fn()
    renderHook(() => useDidMount(callback))
    expect(callback).toHaveBeenCalledOnce()
  })

  it('no vuelve a ejecutar el callback al rerenderizar', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(() => useDidMount(callback))
    rerender()
    rerender()
    expect(callback).toHaveBeenCalledOnce()
  })

  it('no ejecuta el callback al desmontar', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useDidMount(callback))
    callback.mockClear()
    unmount()
    expect(callback).not.toHaveBeenCalled()
  })
})
