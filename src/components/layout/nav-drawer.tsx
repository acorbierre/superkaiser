import { LayoutGrid } from 'lucide-react'
import { useNavigation } from '@/contexts/navigation-context'

interface NavDrawerProps {
  onClose: () => void
}

interface NavLink {
  label: string
  page: string
  icon: React.ReactNode
}

const OUTILS: NavLink[] = [
  {
    label: 'Catalogue de composants',
    page: 'Composants',
    icon: <LayoutGrid className="size-4 shrink-0 text-gray-400" />,
  },
]

export default function NavDrawer({ onClose }: NavDrawerProps) {
  const { navigate, page: currentPage } = useNavigation()

  function goTo(e: React.MouseEvent, page: string) {
    e.preventDefault()
    navigate(page)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-200 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Menu</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-2">
          Outils
        </div>
        {OUTILS.map(({ label, page, icon }) => (
          <a
            key={page}
            href={`#${page}`}
            onClick={(e) => goTo(e, page)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer no-underline ${
              currentPage === page
                ? 'bg-blue-rf/10 text-blue-rf font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {icon}
            {label}
          </a>
        ))}
      </nav>
    </div>
  )
}
