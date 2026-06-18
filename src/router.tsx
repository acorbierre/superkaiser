import { useNavigation } from '@/contexts/navigation-context'
import QualipoPage from '@/pages/QualipoPage'
import DiffusionsPage from '@/pages/DiffusionsPage'

export default function Router() {
  const { page } = useNavigation()

  switch (page) {
    case 'Diffusions': return <DiffusionsPage />
    default:           return <QualipoPage />
  }
}
