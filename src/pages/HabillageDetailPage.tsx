import { useState, useMemo } from 'react'
import { ArrowLeft, Copy, Check, Heart, Calendar, List } from 'lucide-react'

const EMISSIONS_IMAGES: Record<string, string> = {
  'À voix nue':              '/emissions/sc_a_voix_nue_1400.jpg',
  'Affaires étrangères':     '/emissions/sc_affaires-etrangeres.png',
  'Le cours de l\'histoire': '/emissions/sc_sc_le-cours-de-l-histoire.png',
}
import { PageTitle } from '@/components/ui/page-title'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import { HabillageBloc } from '@/components/qualipo/habillage-bloc'
import { HabillageRegles } from '@/components/qualipo/habillage-regles'
import AudioPlayer from '@/components/qualipo/audio-player'

import { CARD, LINK } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { sons } from '@/data/sons'
import { STATION } from '@/data/constants'

function extractBR(programme: string): string {
  const match = programme.match(/BR\s*:\s*(\d+)/)
  return match ? match[1] : '—'
}

export default function HabillageDetailPage() {
  const { params, navigate } = useNavigation()
  const { titre, type, emission } = params
  const [copied, setCopied] = useState(false)
  const [favori, setFavori] = useState(true)
  const emissionImage = titre ? EMISSIONS_IMAGES[titre] ?? null : null

  const son = useMemo(() => {
    if (!titre) return null
    if (type === 'diffusion') return sons.find(s => s.detail.titreComplet === titre) ?? null
    return sons.find(s => s.emission === titre) ?? null
  }, [titre, type])

  const fallback = {
    diffuseAt: '15 juin 2026 à 09h00',
    liberationAt: '22 juin 2026 à 09h00',
    podcastPrincipalLabel: emission ?? titre ?? 'Émission',
    numeroMagnetotheque: '2026-0615-FC',
  }
  const displayDiffuseAt = son?.detail.diffuseAt ?? fallback.diffuseAt
  const displayMID = son?.numeroMagnetotheque ?? fallback.numeroMagnetotheque
  const displayPodcastLabel = son?.detail.podcastPrincipalLabel ?? fallback.podcastPrincipalLabel

  function copyMID() {
    if (!son?.numeroMagnetotheque) return
    navigator.clipboard.writeText(son.numeroMagnetotheque)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1088px] mx-auto px-6 py-8">

        <button
          onClick={() => navigate('Habillages')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Retour à l'accueil
        </button>

        {/* Card principale */}
        <div className={`${CARD} mt-6 relative`}>

          {/* Bouton favori */}
          <button
            onClick={() => setFavori(f => !f)}
            className="absolute top-8 right-10 cursor-pointer transition-colors"
          >
            <Heart
              className={`size-5 transition-colors ${favori ? 'fill-gray-400 text-gray-400' : 'text-gray-300 hover:text-gray-400'}`}
            />
          </button>

          <div className="flex gap-8">

            {/* Photo émission ou placeholder */}
            {emissionImage ? (
              <img src={emissionImage} alt={titre ?? ''} className="w-44 shrink-0 aspect-square rounded-lg object-cover" />
            ) : (
              <div className="w-44 shrink-0 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="size-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            )}

            {/* Informations */}
            <div className="flex flex-col gap-3 flex-1 justify-center">

              {/* Logo station */}
              <div className="flex items-center gap-2">
                <img
                  src={STATION.logo}
                  alt={STATION.label}
                  className="size-8 rounded-full object-cover shrink-0"
                />
                <span className="text-sm font-medium text-gray-600">{STATION.label}</span>
              </div>

              {/* Titre */}
              <PageTitle>{titre ?? '—'}</PageTitle>

              {/* Tag type */}
              <span className={`self-start px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                type === 'diffusion'
                  ? 'bg-blue-rf/10 text-gray-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {type === 'diffusion' ? 'Diffusion' : 'Émission'}
              </span>

              {/* Métadonnées */}
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                {type === 'diffusion' && (
                  <div className="flex items-center gap-1.5">
                    <span>Numéro Magnétothèque (MID) : {displayMID}</span>
                    <button
                      onClick={copyMID}
                      title="Copier le MID"
                      className="p-1 rounded hover:bg-gray-100 cursor-pointer transition-colors text-gray-400 hover:text-gray-600"
                    >
                      {copied
                        ? <Check className="size-3.5 text-green-500" />
                        : <Copy className="size-3.5" />
                      }
                    </button>
                  </div>
                )}
                {type === 'emission' && son?.detail.programme && (
                  <span>BR : {extractBR(son.detail.programme)}</span>
                )}
              </div>

              {/* Player épisode (mode diffusion uniquement) */}
              {type === 'diffusion' && (
                <AudioPlayer compact noBg dureeLabel="00:13:00" />
              )}

            </div>
          </div>

        </div>

        {/* 2 colonnes : habillage + sidebar */}
        <div className="grid grid-cols-[1fr_320px] gap-4 mt-4">

          {/* Colonne principale — habillage */}
          <div>
            {type === 'emission' ? (
              <HabillageRegles emissionTitre={titre ?? ''} />
            ) : (
              <>
                <SectionTitle className="mt-4">Règles en cours</SectionTitle>
                <HabillageBloc episodeTitre={titre ?? ''} emissionTitre={son?.emission ?? emission ?? ''} ruleLabel="01/07 → 31/07" />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="self-start">
            {type !== 'emission' && <SectionTitle className="mt-4">Informations de l'épisode</SectionTitle>}
            <div className={`${CARD}${type === 'emission' ? ' mt-4' : ''}`}>
            {type === 'emission' ? (
              <>
                <ItemTitle>Tous les épisodes du podcast</ItemTitle>
                <button onClick={() => navigate('Calendrier', { titre: type === 'emission' ? (titre ?? '') : (son?.emission ?? '') })} className={`${LINK} mt-3`}><Calendar className="size-4" />Voir le calendrier</button>
                <button onClick={() => navigate('ListeEpisodes', { titre: titre ?? '' })} className={`${LINK} mt-2`}><List className="size-4" />Voir la liste</button>
              </>
            ) : (
              <>
                <ItemTitle>Date de diffusion</ItemTitle>
                <p className="mt-3 text-sm text-gray-600">{displayDiffuseAt}</p>
                <div className="mt-6"><ItemTitle>Date de libération du son</ItemTitle></div>
                <p className="mt-3 text-sm text-gray-600">{fallback.liberationAt}</p>
                <hr className="border-gray-100 mt-6 mb-6" />
                <ItemTitle>Podcast</ItemTitle>
                <button
                  onClick={() => navigate('HabillageDetail', { titre: son?.emission ?? (emission ?? titre ?? ''), type: 'emission' })}
                  className={`${LINK} mt-3`}
                >{displayPodcastLabel}</button>
                <button onClick={() => navigate('Calendrier', { titre: type === 'emission' ? (titre ?? '') : (son?.emission ?? '') })} className={`${LINK} mt-2`}><Calendar className="size-4" />Calendrier des épisodes</button>
              </>
            )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
