import { useEffect, useRef } from 'react'

export function useDidMount(callback: () => void): void {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current()
  }, [])
}
