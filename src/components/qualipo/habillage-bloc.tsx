import { useState, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { InfoMessage } from '@/components/ui/info-message'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, BTN_SECONDARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { getHabillageEpisode, subscribe } from '@/data/habillage-episode-store'

const ROLL_PILL = 'self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] text-blue-rf bg-blue-rf/10'

export function HabillageBloc({ emissionTitre, episodeTitre, ruleLabel }: {
  emissionTitre: string
  episodeTitre: string
  ruleLabel?: string
}) {
  const { navigate } = useNavigation()
  const [, forceUpdate] = useState(0)

  useEffect(() => { const u = subscribe(() => forceUpdate(n => n + 1)); return () => { u() } }, [])

  const h = getHabillageEpisode(episodeTitre)

  return (
    <div className={CARD}>

      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <ItemTitle>{h.isPersonnalise ? 'Personnalisé' : (ruleLabel ?? '—')}</ItemTitle>
          {ruleLabel && (
            h.isPersonnalise ? (
              <div className="mt-1">
                <InfoMessage>
                  Cet épisode a été personnalisé. Voir la{' '}
                  <button
                    onClick={() => navigate('HabillageDetail', { titre: emissionTitre, type: 'emission' })}
                    className="font-semibold hover:underline cursor-pointer"
                  >
                    règle émission du {ruleLabel}
                  </button>.
                </InfoMessage>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-0.5">
                Hérité de la{' '}
                <button
                  onClick={() => navigate('HabillageDetail', { titre: emissionTitre, type: 'emission' })}
                  className="hover:underline cursor-pointer"
                >
                  règle émission du {ruleLabel}
                </button>.
              </p>
            )
          )}
        </div>

        {/* Canaux */}
        <div className="flex items-center gap-3 shrink-0">
          {(['interne', 'externe'] as const).map(canal => {
            const on = h[canal]
            return (
              <span key={canal} className={`flex items-center gap-1 text-sm ${on ? 'text-gray-700' : 'text-gray-300'}`}>
                {on
                  ? <Check className="size-3.5 text-blue-rf" strokeWidth={2.5} />
                  : <X className="size-3.5 text-gray-300" strokeWidth={2.5} />
                }
                {canal.charAt(0).toUpperCase() + canal.slice(1)}
              </span>
            )
          })}
        </div>
      </div>

      {/* 2 colonnes pré/post-roll */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col gap-2">
          <span className={ROLL_PILL}>Pré-roll</span>
          {h.preroll
            ? <><p className="text-[15px] text-gray-900">{h.preroll}</p><AudioPlayer compact noBg noDurations dureeLabel="00:00:07" /></>
            : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
          }
        </div>
        <div className="flex flex-col gap-2">
          <span className={ROLL_PILL}>Post-roll</span>
          {h.postroll
            ? <><p className="text-[15px] text-gray-900">{h.postroll}</p><AudioPlayer compact noBg noDurations dureeLabel="00:00:07" /></>
            : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
          }
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => navigate('HabillageEpisode', { episodeTitre, emissionTitre, ruleLabel: ruleLabel ?? '' })}
          className={`${BTN_SECONDARY} flex items-center gap-1.5`}
        >
          <Pencil className="size-3.5" />
          Modifier
        </button>
      </div>

    </div>
  )
}
