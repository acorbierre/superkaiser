import { useState } from 'react'
import TopNav from '@/components/qualipo/top-nav'
import SubNav from '@/components/qualipo/sub-nav'
import { Drawer } from '@/components/ui/drawer'
import NavDrawer from '@/components/layout/nav-drawer'
import { useNavigation } from '@/contexts/navigation-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { page, navigate, isContenus } = useNavigation()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <TopNav
        currentPage={page}
        onNavigate={navigate}
        onOpenCatalog={() => setNavOpen(true)}
      />
      {isContenus && <SubNav activePage={page} onNavigate={navigate} />}
      {children}

      <Drawer open={navOpen} onClose={() => setNavOpen(false)}>
        <NavDrawer onClose={() => setNavOpen(false)} />
      </Drawer>
    </div>
  )
}
