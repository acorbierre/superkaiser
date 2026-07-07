import { useState, useMemo, useEffect } from 'react'
import { PageTitle } from '@/components/ui/page-title'
import { ToggleGroupLabel } from '@/components/ui/toggle-group'
import { Autocomplete } from '@/components/ui/autocomplete'
import type { AutocompleteOption } from '@/components/ui/autocomplete'
import { CARD, LABEL } from '@/lib/styles'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import { sons } from '@/data/sons'
import { useNavigation } from '@/contexts/navigation-context'
import { STATION } from '@/data/constants'

const STATIONS_FAVORITES = [
  { label: 'France Culture', logo: '/stations/france-culture.svg' },
  { label: 'France Inter',   logo: '/stations/france-inter.svg'   },
]

const EMISSIONS_FAVORITES = [
  { titre: 'À voix nue',           img: '/emissions/sc_a_voix_nue_1400.jpg'            },
  { titre: 'Affaires étrangères',  img: '/emissions/sc_affaires-etrangeres.png'         },
  { titre: 'Le cours de l\'histoire', img: '/emissions/sc_sc_le-cours-de-l-histoire.png' },
]

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
      return [...new Set(sons.map(s => s.emission))].map(label => ({ label, logo: STATION.logo }))
    }
    return sons.map(s => ({
      label: s.detail.titreComplet,
      sublabel: s.detail.diffuseAt,
      logo: STATION.logo,
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

        <SectionTitle className="mt-8">Accès rapides</SectionTitle>

        {/* Card favoris */}
        <div className={`${CARD} flex flex-col gap-6`}>

          {/* Émissions favorites */}
          <div className="flex flex-col gap-3">
            <ItemTitle>Émissions favorites</ItemTitle>
            <div className="flex gap-4">
              {EMISSIONS_FAVORITES.map(e => (
                <button
                  key={e.titre}
                  onClick={() => navigate('HabillageDetail', { titre: e.titre, type: 'emission' })}
                  className="cursor-pointer group shrink-0"
                >
                  <img
                    src={e.img}
                    alt={e.titre}
                    className="w-40 h-40 rounded-lg object-cover group-hover:brightness-90 transition-all"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Card paramétrage des stations */}
        <div className={`${CARD} mt-4 flex flex-col gap-4`}>
          <ItemTitle>Paramétrage des stations</ItemTitle>
          <div className="flex gap-4">
            {STATIONS_FAVORITES.map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1.5">
                <img src={s.logo} alt={s.label} className="size-12 rounded-full object-cover" />
                <span className="text-sm text-gray-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
