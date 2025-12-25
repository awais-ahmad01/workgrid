'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store/store'

/**
 * StoreProvider Component
 * - Wraps app with Redux Provider
 * - Creates store once and reuses it
 * - Prevents store recreation on hot reloads
 */
export default function StoreProvider({ children }) {
  // Use useRef to persist store across re-renders
  const storeRef = useRef()
  if (!storeRef.current) {
    // Create the store instance once
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}