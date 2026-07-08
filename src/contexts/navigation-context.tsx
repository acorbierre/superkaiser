import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { CONTENUS_PAGE_SET } from '@/data/navigation'

type NavParams = Record<string, string>

interface NavigationCtx {
  page: string
  params: NavParams
  navigate: (page: string, params?: NavParams) => void
  isContenus: boolean
}

const NavigationContext = createContext<NavigationCtx | null>(null)

function pageToHash(page: string) {
  return page === 'Qualipo' ? '' : `#${page}`
}

function hashToPage(hash: string) {
  return hash.replace('#', '') || 'Qualipo'
}

function readNav(): { page: string; params: NavParams } {
  const state = window.history.state
  if (state?.page) return { page: state.page, params: state.params ?? {} }
  return { page: hashToPage(window.location.hash), params: {} }
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Page and params are derived from window.history.state on every render.
  // We only use a counter to trigger re-renders — no risk of stale state.
  const [, forceUpdate] = useState(0)

  const { page, params } = readNav()

  useEffect(() => {
    const initial = readNav()
    if (!window.history.state?.page) {
      window.history.replaceState({ page: initial.page, params: {} }, '', pageToHash(initial.page) || window.location.pathname)
    }

    function onPopState() { forceUpdate(n => n + 1) }
    function onHashChange() { forceUpdate(n => n + 1) }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const navigate = useRef((newPage: string, newParams: NavParams = {}) => {
    const url = pageToHash(newPage) || window.location.pathname
    window.history.pushState({ page: newPage, params: newParams }, '', url)
    forceUpdate(n => n + 1)
  }).current

  return (
    <NavigationContext.Provider value={{
      page,
      params,
      navigate,
      isContenus: CONTENUS_PAGE_SET.has(page),
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
