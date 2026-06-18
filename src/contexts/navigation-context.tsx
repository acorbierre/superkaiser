import { createContext, useContext, useState } from 'react'
import { CONTENUS_PAGE_SET } from '@/data/navigation'

interface NavigationCtx {
  page: string
  navigate: (page: string) => void
  isContenus: boolean
}

const NavigationContext = createContext<NavigationCtx | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState('Qualipo')

  return (
    <NavigationContext.Provider value={{
      page,
      navigate: setPage,
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
