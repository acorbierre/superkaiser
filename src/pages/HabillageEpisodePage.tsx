import { useState, useMemo } from 'react'
import { ArrowLeft, Calendar } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, LINK, BTN_PRIMARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { sons } from '@/data/sons'
import { STATION } from '@/data/constants'
import {
  getHabillageEpisode, setHabillageEpisode,
  SONS_PREROLL, SONS_POSTROLL,
} from '@/data/habillage-episode-store'

const ROLL_PILL = 'self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] text-blue-rf bg-blue-rf/10'

const EMISSIONS_IMAGES: Record<string, string> = {
  'À voix nue':              '/emissions/sc_a_voix_nue_1400.jpg',
  'Affaires étrangères':     '/emissions/sc_affaires-etrangeres.png',
  'Le cours de l\'histoire': '/emissions/sc_sc_le-cours-de-l-histoire.png',
}

const FALLBACK = {
  diffuseAt:   '15 juin 2026 à 09h00',
  liberationAt: '22 juin 2026 à 09h00',
  mid:         '2026-0615-FC',
}

export default function HabillageEpisodePage() {
  const { params, navigate } = useNavigation()
  const { episodeTitre = '', emissionTitre = '', ruleLabel = '' } = params

  const existing = getHabillageEpisode(episodeTitre)

  const [preroll, setPreroll]   = useState(existing.preroll)
  const [postroll, setPostroll] = useState(existing.postroll)
  const [interne, setInterne]   = useState(existing.interne)
  const [externe, setExterne]   = useState(existing.externe)

  const son = useMemo(() => sons.find(s => s.detail.titreComplet === episodeTitre) ?? null, [episodeTitre])
  const emissionImage = EMISSIONS_IMAGES[emissionTitre] ?? null

  const displayDiffuseAt = son?.detail.diffuseAt ?? FALLBACK.diffuseAt
  const displayMID       = son?.numeroMagnetotheque ?? FALLBACK.mid
  const displayEmission  = son?.emission ?? emissionTitre

  function handleValider() {
    setHabillageEpisode(episodeTitre, { preroll, postroll, interne, externe, isPersonnalise: true })
    navigate('HabillageDetail', { titre: episodeTitre, type: 'diffusion', emission: emissionTitre })
  }

  function handleAnnuler() {
    navigate('HabillageDetail', { titre: episodeTitre, type: 'diffusion', emission: emissionTitre })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1088px] mx-auto px-6 py-8">

        <button
          onClick={handleAnnuler}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Retour à l'épisode
        </button>

        {/* Card épisode */}
        <div className={`${CARD} mt-6`}>
          <div className="flex gap-8">
            {emissionImage ? (
              <img src={emissionImage} alt={emissionTitre} className="w-44 shrink-0 aspect-square rounded-lg object-cover" />
            ) : (
              <div className="w-44 shrink-0 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="size-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            )}
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <div className="flex items-center gap-2">
                <img src={STATION.logo} alt={STATION.label} className="size-8 rounded-full object-cover shrink-0" />
                <span className="text-sm font-medium text-gray-600">{STATION.label}</span>
              </div>
              <PageTitle>{episodeTitre || '—'}</PageTitle>
              <span className="self-start px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-blue-rf/10 text-gray-800">
                Diffusion
              </span>
              <div className="text-sm text-gray-500">
                <span>Numéro Magnétothèque (MID) : {displayMID}</span>
              </div>
              <AudioPlayer compact noBg dureeLabel="00:13:00" />
            </div>
          </div>
        </div>

        {/* 2 colonnes */}
        <div className="grid grid-cols-[1fr_320px] gap-4 mt-4">

          {/* Formulaire */}
          <div>
            <SectionTitle className="mt-4">Modifier l'habillage</SectionTitle>
            <div className={CARD}>

              {/* Titre + interne/externe */}
              <div className="flex items-start justify-between gap-4">
                <ItemTitle>{ruleLabel ? `Règle du ${ruleLabel}` : 'Habillage'}</ItemTitle>
                <div className="flex gap-5 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={interne} onCheckedChange={setInterne} />
                    <span className="text-[15px] text-gray-700">Interne</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={externe} onCheckedChange={setExterne} />
                    <span className="text-[15px] text-gray-700">Externe</span>
                  </label>
                </div>
              </div>

              {/* 2 colonnes pré/post-roll */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <span className={ROLL_PILL}>Pré-roll</span>
                  <SelectField value={preroll} onChange={setPreroll}>
                    <option value="">Aucun habillage</option>
                    {SONS_PREROLL.map(s => <option key={s} value={s}>{s}</option>)}
                  </SelectField>
                  <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className={ROLL_PILL}>Post-roll</span>
                  <SelectField value={postroll} onChange={setPostroll}>
                    <option value="">Aucun habillage</option>
                    {SONS_POSTROLL.map(s => <option key={s} value={s}>{s}</option>)}
                  </SelectField>
                  <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button onClick={handleValider} className={BTN_PRIMARY}>Valider</button>
                <button onClick={handleAnnuler} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  Annuler
                </button>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="self-start">
            <SectionTitle className="mt-4">Informations de l'épisode</SectionTitle>
            <div className={CARD}>
              <ItemTitle>Date de diffusion</ItemTitle>
              <p className="mt-3 text-sm text-gray-600">{displayDiffuseAt}</p>
              <div className="mt-6"><ItemTitle>Date de libération du son</ItemTitle></div>
              <p className="mt-3 text-sm text-gray-600">{FALLBACK.liberationAt}</p>
              <hr className="border-gray-100 mt-6 mb-6" />
              <ItemTitle>Podcast</ItemTitle>
              <button
                onClick={() => navigate('HabillageDetail', { titre: emissionTitre, type: 'emission' })}
                className={`${LINK} mt-3`}
              >
                {displayEmission}
              </button>
              <button
                onClick={() => navigate('Calendrier', { titre: emissionTitre })}
                className={`${LINK} mt-2`}
              >
                <Calendar className="size-4" />Calendrier des épisodes
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
