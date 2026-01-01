
'use client'

import { useDispatch, useSelector, useStore } from 'react-redux'

/**
 * Custom hooks for Redux with proper typing
 * - useAppDispatch: For dispatching actions
 * - useAppSelector: For selecting state
 * - useAppStore: For accessing the store directly (rarely needed)
 */
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
export const useAppStore = () => useStore()
