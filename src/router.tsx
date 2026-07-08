import { useNavigation } from '@/contexts/navigation-context'
import QualipoPage from '@/pages/QualipoPage'
import DiffusionsPage from '@/pages/DiffusionsPage'
import HabillagesPage from '@/pages/HabillagesPage'
import HabillageDetailPage from '@/pages/HabillageDetailPage'
import CalendrierPage from '@/pages/CalendrierPage'
import ListeEpisodesPage from '@/pages/ListeEpisodesPage'
import ComponentsPage from '@/pages/ComponentsPage'

export default function Router() {
  const { page } = useNavigation()

  switch (page) {
    case 'Diffusions':      return <DiffusionsPage />
    case 'Habillages':      return <HabillagesPage />
    case 'HabillageDetail': return <HabillageDetailPage />
    case 'Calendrier':      return <CalendrierPage />
    case 'ListeEpisodes':   return <ListeEpisodesPage />
    case 'Composants':      return <ComponentsPage />
    default:                return <QualipoPage />
  }
}
