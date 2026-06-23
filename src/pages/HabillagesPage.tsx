import { useState, useMemo, useEffect } from 'react'
import { PageTitle } from '@/components/ui/page-title'
import { ToggleGroupLabel } from '@/components/ui/toggle-group'
import { Autocomplete } from '@/components/ui/autocomplete'
import type { AutocompleteOption } from '@/components/ui/autocomplete'
import { CARD, LABEL } from '@/lib/styles'
import { sons } from '@/data/sons'
import { useNavigation } from '@/contexts/navigation-context'

const CONTENUS = [
  { label: 'Émission',  value: 'emission'  },
  { label: 'Diffusion', value: 'diffusion' },
]

export default function HabillagesPage() {
  const { navigate } = useNavigation()
  const [contenu, setContenu] = useState('diffusion')
  const [recherche, setRecherche] = useState('')

  useEffect(() => { setRecherche('') }, [contenu])

  const suggestions = useMemo<AutocompleteOption[]>(() => {
    if (contenu === 'emission') {
      return [...new Set(sons.map(s => s.emission))].map(label => ({ label }))
    }
    return sons.map(s => ({
      label: s.detail.titreComplet,
      sublabel: s.detail.diffuseAt,
    }))
  }, [contenu])

  function handleSelect(opt: AutocompleteOption) {
    navigate('HabillageDetail', { titre: opt.label, type: contenu })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1088px] mx-auto px-6 py-8">
        <PageTitle>Habillages</PageTitle>
        <div className={`${CARD} mt-6`}>
          <div className="flex gap-4 items-end">
            <ToggleGroupLabel
              label="Contenu"
              options={CONTENUS}
              value={contenu}
              onChange={setContenu}
            />
            <div className="flex flex-col gap-1 flex-1">
              <label className={LABEL}>Recherche</label>
              <Autocomplete
                options={suggestions}
                value={recherche}
                onChange={setRecherche}
                onSelect={handleSelect}
                placeholder={contenu === 'emission' ? "Nom de l'émission\u2026" : "Titre de la diffusion\u2026"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
