import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export function useSharedState(defaultValue: any) {
  const router = useRouter()

  const [state, setState] = useState(defaultValue)

  useEffect(() => {
    const newState = router.query.sharedState
    if (newState !== undefined) {
      setState(newState)
    }
  }, [router.query.sharedState])

  function setSharedState(newValue: any) {
    router.push({
      pathname: router.pathname,
      query: { sharedState: newValue },
    })
    setState(newValue)
  }

  return [state, setSharedState]
}
