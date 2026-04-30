import { useEffect, useState } from 'react'
import type { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'

export function useViewModel<T extends BaseViewModel>(factory: () => T): T {
  const [vm] = useState(factory)

  useEffect(() => {
    vm.didMount()
    return () => {
      vm.willUnmount()
    }
  }, [vm])

  return vm
}
