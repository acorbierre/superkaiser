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

type NavState = { page: string; params: NavParams }

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [nav, setNav] = useState<NavState>(() => {
    if (window.history.state?.page) {
      return { page: window.history.state.page, params: window.history.state.params ?? {} }
    }
    return { page: hashToPage(window.location.hash), params: {} }
  })

  // Keep a ref to the setter so navigate (created once) always has a fresh reference
  const setNavRef = useRef(setNav)
  useEffect(() => { setNavRef.current = setNav })

  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: nav.page, params: {} }, '', pageToHash(nav.page) || window.location.pathname)
    }

    function onPopState(e: PopStateEvent) {
      if (e.state?.page) {
        setNavRef.current({ page: e.state.page, params: e.state.params ?? {} })
      }
    }

    function onHashChange() {
      const state = window.history.state
      if (state?.page) {
        setNavRef.current({ page: state.page, params: state.params ?? {} })
      } else {
        setNavRef.current({ page: hashToPage(window.location.hash), params: {} })
      }
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  // Created once — uses setNavRef.current so it's never stale
  const navigate = useRef((newPage: string, newParams: NavParams = {}) => {
    const url = pageToHash(newPage) || window.location.pathname
    window.history.pushState({ page: newPage, params: newParams }, '', url)
    setNavRef.current({ page: newPage, params: newParams })
  }).current

  return (
    <NavigationContext.Provider value={{
      page: nav.page,
      params: nav.params,
      navigate,
      isContenus: CONTENUS_PAGE_SET.has(nav.page),
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
