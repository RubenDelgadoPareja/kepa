import { useEffect, useState } from 'react'
import type { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'

export function useViewModel<T extends BaseViewModel>(factory: () => T): T {
  const [vm] = useState(factory)

  useEffect(() => {
    vm.didMount()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        vm.onFocus()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      vm.willUnmount()
    }
  }, [vm])

  return vm
}
