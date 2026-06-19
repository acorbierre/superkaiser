import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<string>(() => {
    if (window.history.state?.page) return window.history.state.page
    return hashToPage(window.location.hash)
  })
  const [params, setParams] = useState<NavParams>(() => window.history.state?.params ?? {})

  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page, params: {} }, '', pageToHash(page) || window.location.pathname)
    }

    function onPopState(e: PopStateEvent) {
      if (e.state?.page) {
        setPage(e.state.page)
        setParams(e.state.params ?? {})
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((newPage: string, newParams: NavParams = {}) => {
    setPage(newPage)
    setParams(newParams)
    // Pages avec params (ex: HabillageDetail) : pas de hash pour éviter la perte des params
    const hasParams = Object.keys(newParams).length > 0
    const url = hasParams ? window.location.pathname : (pageToHash(newPage) || window.location.pathname)
    window.history.pushState({ page: newPage, params: newParams }, '', url)
  }, [])

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
