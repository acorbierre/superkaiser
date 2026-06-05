import { useState } from 'react'
import TopNav from '@/components/qualipo/top-nav'
import SubNav from '@/components/qualipo/sub-nav'
import QualipoHeader from '@/components/qualipo/qualipo-header'
import SonsTable from '@/components/qualipo/sons-table'
import SidePanel from '@/components/qualipo/side-panel'
import DiffusionsPage from '@/pages/DiffusionsPage'
import { sons, type Son } from '@/data/sons'
import { DEFAULT_FILTRES, type FiltresState } from '@/components/qualipo/filtres-panel'

const CONTENUS_PAGES = new Set([
  "Programmes", "Diffusions", "Concerts", "Replays",
  "Podcasts", "Stations", "Gestion des expressions", "Editions des tags",
])

export default function App() {
  const [page, setPage] = useState('Qualipo')
  const [filtres, setFiltres] = useState<FiltresState>(DEFAULT_FILTRES)
  const [recherche, setRecherche] = useState('')
  const [selectedSon, setSelectedSon] = useState<Son | null>(null)
  const [loading, setLoading] = useState(false)

  const isContenus = CONTENUS_PAGES.has(page)

  function handleDateChange() {
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <TopNav currentPage={page} onNavigate={setPage} />
      {isContenus && <SubNav activePage={page} onNavigate={setPage} />}

      {page === 'Diffusions' ? (
        <DiffusionsPage />
      ) : (
        <>
          <QualipoHeader
            filtres={filtres}
            onFiltresChange={setFiltres}
            recherche={recherche}
            onRechercheChange={setRecherche}
            onDateChange={handleDateChange}
          />
          <SonsTable
            sons={sons}
            filtres={filtres}
            recherche={recherche}
            onSelectSon={setSelectedSon}
            loading={loading}
          />
          {selectedSon && (
            <SidePanel
              son={selectedSon}
              onClose={() => setSelectedSon(null)}
            />
          )}
        </>
      )}
    </div>
  )
}
