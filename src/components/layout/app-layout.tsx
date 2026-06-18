import TopNav from '@/components/qualipo/top-nav'
import SubNav from '@/components/qualipo/sub-nav'
import { useNavigation } from '@/contexts/navigation-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { page, navigate, isContenus } = useNavigation()

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <TopNav currentPage={page} onNavigate={navigate} />
      {isContenus && <SubNav activePage={page} onNavigate={navigate} />}
      {children}
    </div>
  )
}
