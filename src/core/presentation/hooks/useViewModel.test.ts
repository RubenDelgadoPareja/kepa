import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import { useViewModel } from './useViewModel'

class TestViewModel extends BaseViewModel {
  didMountCalled = false
  willUnmountCalled = false

  override didMount() {
    this.didMountCalled = true
  }

  override willUnmount() {
    this.willUnmountCalled = true
  }
}

describe('useViewModel', () => {
  it('crea el ViewModel con la factory', () => {
    const factory = vi.fn(() => new TestViewModel())
    const { result } = renderHook(() => useViewModel(factory))
    expect(result.current).toBeInstanceOf(TestViewModel)
  })

  it('llama a la factory solo una vez aunque el componente rerenderice', () => {
    const factory = vi.fn(() => new TestViewModel())
    const { rerender } = renderHook(() => useViewModel(factory))
    rerender()
    rerender()
    expect(factory).toHaveBeenCalledOnce()
  })

  it('llama a didMount al montar', () => {
    const { result } = renderHook(() => useViewModel(() => new TestViewModel()))
    expect(result.current.didMountCalled).toBe(true)
  })

  it('llama a willUnmount al desmontar', () => {
    const { result, unmount } = renderHook(() => useViewModel(() => new TestViewModel()))
    unmount()
    expect(result.current.willUnmountCalled).toBe(true)
  })
})
