import { useState, useMemo } from 'react'
import { ArrowLeft, Copy, Check, ArrowRightToLine, ArrowRightFromLine, Mic } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { CardTitle } from '@/components/ui/card-title'
import { ItemTitle } from '@/components/ui/item-title'
import { SelectField } from '@/components/ui/select-field'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, CARD_BLUE, LABEL } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { sons } from '@/data/sons'
import { STATION } from '@/data/constants'

function extractBR(programme: string): string {
  const match = programme.match(/BR\s*:\s*(\d+)/)
  return match ? match[1] : '—'
}

export default function HabillageDetailPage() {
  const { params } = useNavigation()
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
                {son?.detail.diffuseAt && (
                  <span>Diffusé le {son.detail.diffuseAt}</span>
                )}
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

            </div>
          </div>

          {/* Section Habillage */}
          <CardTitle className="text-gray-900 mt-8">Habillage</CardTitle>
          <div className={`${CARD_BLUE} mt-4`}>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightToLine className="size-3.5" />Pré-roll</span>}>
                  <option>Xavier Mauduit - Intro Promo</option>
                </SelectField>
                <AudioPlayer compact noBg dureeLabel="00:00:11" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className={`${LABEL} flex items-center gap-1.5`}><Mic className="size-3.5" />Épisode</label>
                  <div className="h-10 flex items-center justify-between px-3 rounded bg-blue-rf/10 text-[1rem] text-[#444]">
                    <span className="truncate">{titre ?? '—'}</span>
                    <span className="flex-1 text-right text-sm text-[#444] ml-2">(13:00)</span>
                  </div>
                </div>
                <AudioPlayer compact noBg dureeLabel="00:13:00" />
              </div>
              <div className="flex flex-col gap-2">
                <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightFromLine className="size-3.5" />Post-roll</span>}>
                  <option>Écoute série complète</option>
                </SelectField>
                <AudioPlayer compact noBg dureeLabel="00:00:11" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className={`${CARD} mt-4`}>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <ItemTitle>Fil de diffusion</ItemTitle>
            </div>
            <div className="flex flex-col gap-2 border-l border-gray-100 pl-8">
              <ItemTitle>Canaux de diffusion</ItemTitle>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-100 pt-8">
              <ItemTitle>Contexte</ItemTitle>
            </div>
            <div className="flex flex-col gap-2 border-t border-l border-gray-100 pt-8 pl-8">
              <ItemTitle>Dates de validité</ItemTitle>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
