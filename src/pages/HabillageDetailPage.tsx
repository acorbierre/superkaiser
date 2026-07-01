import { useState, useMemo } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { ItemTitle } from '@/components/ui/item-title'
import { HabillageBloc } from '@/components/qualipo/habillage-bloc'
import AudioPlayer from '@/components/qualipo/audio-player'
import { InfoMessage } from '@/components/ui/info-message'
import { BTN_PRIMARY, CARD, LINK } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { sons } from '@/data/sons'
import { STATION } from '@/data/constants'

function extractBR(programme: string): string {
  const match = programme.match(/BR\s*:\s*(\d+)/)
  return match ? match[1] : '—'
}

export default function HabillageDetailPage() {
  const { params, navigate } = useNavigation()
  const { titre, type } = params
  const [copied, setCopied] = useState(false)

  const son = useMemo(() => {
    if (!titre) return null
    if (type === 'diffusion') return sons.find(s => s.detail.titreComplet === titre) ?? null
    return sons.find(s => s.emission === titre) ?? null
  }, [titre, type])

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
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Retour
        </button>

        {/* Card principale */}
        <div className={`${CARD} mt-6`}>
          <div className="flex gap-8">

            {/* Placeholder photo */}
            <div className="w-56 shrink-0 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="size-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>

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
                {type === 'diffusion' && son?.numeroMagnetotheque && (
                  <div className="flex items-center gap-1.5">
                    <span>Numéro Magnétothèque (MID) : {son.numeroMagnetotheque}</span>
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
          <div className="flex flex-col gap-4">
            {type === 'emission' && (
              <InfoMessage>
                Par défaut, tous les épisodes de ce podcast hériteront de ces habillages. Ils peuvent toutefois être personnalisés au niveau de chaque épisode.
              </InfoMessage>
            )}
            <HabillageBloc showEpisode={type === 'diffusion'} />
            <button className={`${BTN_PRIMARY} self-start`}>Enregistrer</button>
          </div>

          {/* Sidebar */}
          <div className={`${CARD} self-start`}>
            {type === 'emission' ? (
              <>
                <ItemTitle>Épisodes du podcast</ItemTitle>
                <a className={`${LINK} mt-3`}>Voir la liste des diffusions</a>
                <a className={`${LINK} mt-2`}>Voir le calendrier des épisodes</a>
              </>
            ) : (
              <>
                <ItemTitle>Date de diffusion</ItemTitle>
                {son?.detail.diffuseAt
                  ? <p className="mt-3 text-sm text-gray-600">{son.detail.diffuseAt}</p>
                  : <p className="mt-3 text-sm text-gray-400">—</p>
                }
                <div className="mt-6"><ItemTitle>Date de libération du son</ItemTitle></div>
                {son?.detail.diffuseAt
                  ? <p className="mt-3 text-sm text-gray-600">{son.detail.diffuseAt}</p>
                  : <p className="mt-3 text-sm text-gray-400">—</p>
                }
                <hr className="border-gray-100 mt-6 mb-6" />
                <ItemTitle>Podcast</ItemTitle>
                {son?.detail.podcastPrincipalLabel
                  ? <button
                      onClick={() => navigate('HabillageDetail', { titre: son.emission, type: 'emission' })}
                      className={`${LINK} mt-3`}
                    >{son.detail.podcastPrincipalLabel}</button>
                  : <p className="mt-3 text-sm text-gray-400">—</p>
                }
                <a className={`${LINK} mt-2`}>Voir le calendrier des épisodes</a>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
