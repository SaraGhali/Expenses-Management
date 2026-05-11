import { useEffect, useState } from 'react'
import { authService } from '../utils/authService'

export function useAuthUser() {
  const [user, setUser] = useState(() => authService.getCurrentUser() || null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser || null)
      setInitializing(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, initializing }
}

