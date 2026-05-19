import { useState } from 'react'
import TopNav from '@/components/qualipo/top-nav'
import QualipoHeader from '@/components/qualipo/qualipo-header'
import SonsTable from '@/components/qualipo/sons-table'
import SidePanel from '@/components/qualipo/side-panel'
import { sons, type Son } from '@/data/sons'
import { DEFAULT_FILTRES, type FiltresState } from '@/components/qualipo/filtres-panel'

export default function App() {
  const [filtres, setFiltres] = useState<FiltresState>(DEFAULT_FILTRES)
  const [recherche, setRecherche] = useState('')
  const [selectedSon, setSelectedSon] = useState<Son | null>(null)
  const [loading, setLoading] = useState(false)

  function handleDateChange() {
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <TopNav />
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
    </div>
  )
}
