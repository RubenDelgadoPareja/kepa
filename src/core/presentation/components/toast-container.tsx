import { observer } from 'mobx-react-lite'
import { toastStore } from '../stores/toast.store'

export const ToastContainer = observer(function ToastContainer() {
  if (toastStore.toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toastStore.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white pointer-events-auto animate-slide-up ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800 dark:bg-slate-700'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
})
