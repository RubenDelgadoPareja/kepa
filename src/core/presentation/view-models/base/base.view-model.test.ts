import { describe, expect, it, vi } from 'vitest'
import { BaseViewModel } from './base.view-model'

class ConcreteViewModel extends BaseViewModel {
  override didMount() {}
  override willUnmount() {}
}

describe('BaseViewModel', () => {
  it('se puede instanciar una subclase', () => {
    const vm = new ConcreteViewModel()
    expect(vm).toBeInstanceOf(BaseViewModel)
  })

  it('didMount no lanza por defecto', () => {
    const vm = new ConcreteViewModel()
    expect(() => vm.didMount()).not.toThrow()
  })

  it('willUnmount no lanza por defecto', () => {
    const vm = new ConcreteViewModel()
    expect(() => vm.willUnmount()).not.toThrow()
  })

  it('los métodos de ciclo de vida son sobreescribibles', () => {
    const didMountSpy = vi.fn()
    const willUnmountSpy = vi.fn()

    class SpyViewModel extends BaseViewModel {
      override didMount() {
        didMountSpy()
      }
      override willUnmount() {
        willUnmountSpy()
      }
    }

    const vm = new SpyViewModel()
    vm.didMount()
    vm.willUnmount()

    expect(didMountSpy).toHaveBeenCalledOnce()
    expect(willUnmountSpy).toHaveBeenCalledOnce()
  })
})
