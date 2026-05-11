import { makeObservable, observable, action } from 'mobx'

export type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

class ToastStore {
  toasts: Toast[] = []
  private nextId = 0

  constructor() {
    makeObservable(this, {
      toasts: observable,
      show: action,
      dismiss: action,
    })
  }

  show(message: string, type: ToastType = 'success', duration = 2500) {
    const id = this.nextId++
    this.toasts.push({ id, message, type })
    setTimeout(() => this.dismiss(id), duration)
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }
}

export const toastStore = new ToastStore()
