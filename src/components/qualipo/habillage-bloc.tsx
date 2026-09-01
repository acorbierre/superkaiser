import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { InfoMessage } from '@/components/ui/info-message'
import { CanauxBadges, RollPairReadOnly } from '@/components/qualipo/habillage-shared'
import { CARD, BTN_SECONDARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { getHabillageEpisode, subscribe } from '@/data/habillage-episode-store'

export function HabillageBloc({ emissionTitre, episodeTitre, ruleLabel, ruleNom }: {
  emissionTitre: string
  episodeTitre: string
  ruleLabel?: string
  ruleNom?: string
}) {
  const { navigate } = useNavigation()
  const [, forceUpdate] = useState(0)

  useEffect(() => { const u = subscribe(() => forceUpdate(n => n + 1)); return () => { u() } }, [])

  const h = getHabillageEpisode(episodeTitre)
  const heriteLabel = ruleLabel ? (ruleNom ? `${ruleNom} (${ruleLabel})` : ruleLabel) : '—'
  const statutLabel = h.isPersonnalise ? 'Personnalisé' : heriteLabel

  return (
    <div className={CARD}>

      {/* En-tête */}
      <div className="flex flex-col gap-1">
        <ItemTitle>{h.nom ? `${h.nom} (${statutLabel})` : statutLabel}</ItemTitle>
        {ruleLabel && (
          h.isPersonnalise ? (
            <div className="mt-1 mb-3">
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
                className="text-blue-rf hover:underline cursor-pointer"
              >
                règle émission
              </button>.
            </p>
          )
        )}
      </div>

      {/* 2 colonnes pré/post-roll */}
      <RollPairReadOnly config={h} />

      {/* Canaux */}
      <div className="mt-6">
        <CanauxBadges interne={h.interne} externe={h.externe} />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => navigate('HabillageEpisode', { episodeTitre, emissionTitre, ruleLabel: ruleLabel ?? '' })}
          className={`${BTN_SECONDARY} flex items-center gap-1.5`}
        >
          <Pencil className="size-3.5" />
          {h.isPersonnalise ? 'Modifier' : 'Personnaliser'}
        </button>
      </div>

    </div>
  )
}
