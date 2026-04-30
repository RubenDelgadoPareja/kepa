import { useEffect, useRef } from 'react'

export function useWillUnmount(callback: () => void): void {
  const callbackRef = useRef(callback)
  useEffect(
    () => () => {
      callbackRef.current()
    },
    [],
  )
}
