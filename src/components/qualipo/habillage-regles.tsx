import { useState, useEffect } from 'react'
import { Trash2, Plus, List, Check, X } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, BTN_PRIMARY, BTN_SECONDARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import {
  getRegles, removeRegle, subscribe, formatDateFr,
  MODE_LABELS, JOURS, JOURS_LABELS, JOURS_COURTS,
  type Regle, type RollConfig, type JourSemaine,
} from '@/data/regles-store'

// ── Canaux (interne / externe) ─────────────────────────────────────────────────

function CanauxBadges({ interne, externe }: { interne: boolean; externe: boolean }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {(['interne', 'externe'] as const).map(canal => {
        const on = canal === 'interne' ? interne : externe
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
  )
}

// ── Affichage 2 colonnes pré/post-roll ────────────────────────────────────────

function RollPairReadOnly({ config }: { config: RollConfig }) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-gray-500">Pré-roll</p>
        {config.preroll
          ? <>
              <p className="text-[15px] text-gray-900">{config.preroll}</p>
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </>
          : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
        }
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-gray-500">Post-roll</p>
        {config.postroll
          ? <>
              <p className="text-[15px] text-gray-900">{config.postroll}</p>
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </>
          : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
        }
      </div>
    </div>
  )
}

// ── Vue lecture par mode ───────────────────────────────────────────────────────

function RegleReadView({ regle }: { regle: Regle }) {
  const { modeTemporalite: mode, config, configPaire, configImpaire } = regle

  if (mode === 'tous') {
    return <RollPairReadOnly config={config} />
  }

  if (mode === 'alternance') {
    return (
      <div className="flex flex-col gap-6 mt-4">
        <div>
          <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Semaines paires</p>
          <RollPairReadOnly config={configPaire ?? { preroll: '', postroll: '' }} />
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Semaines impaires</p>
          <RollPairReadOnly config={configImpaire ?? { preroll: '', postroll: '' }} />
        </div>
      </div>
    )
  }

  // parjour
  const joursActifs = regle.joursActifs ?? []
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Chips jours (read-only) */}
      <div className="flex gap-2">
        {(JOURS as JourSemaine[]).map(jour => {
          const active = joursActifs.includes(jour)
          return (
            <div
              key={jour}
              className={`w-10 h-10 rounded-full text-[13px] font-medium flex items-center justify-center ${
                active ? 'bg-blue-rf text-white' : 'bg-gray-100 text-gray-300'
              }`}
            >
              {JOURS_COURTS[jour]}
            </div>
          )
        })}
      </div>
      {/* Détail par jour actif */}
      {joursActifs.length > 0 && (
        <div className="flex flex-col">
          <div className="grid grid-cols-[110px_1fr_1fr] gap-4 pb-2 border-b border-gray-200">
            <span />
            <p className="text-[13px] font-medium text-gray-500">Pré-roll</p>
            <p className="text-[13px] font-medium text-gray-500">Post-roll</p>
          </div>
          {joursActifs.map(jour => {
            const c = regle.configJours?.[jour] ?? { preroll: '', postroll: '' }
            return (
              <div key={jour} className="flex flex-col gap-3 py-3 border-b border-gray-100">
                <span className="self-start px-3 py-1 rounded-full bg-gray-100 text-[13px] font-medium text-gray-600">
                  {JOURS_LABELS[jour]}
                </span>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] font-medium text-gray-500">Pré-roll</p>
                    {c.preroll
                      ? <><p className="text-[15px] text-gray-900">{c.preroll}</p><AudioPlayer compact noBg noDurations dureeLabel="00:00:07" /></>
                      : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
                    }
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] font-medium text-gray-500">Post-roll</p>
                    {c.postroll
                      ? <><p className="text-[15px] text-gray-900">{c.postroll}</p><AudioPlayer compact noBg noDurations dureeLabel="00:00:07" /></>
                      : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── HabillageRegles ────────────────────────────────────────────────────────────

export function HabillageRegles({ emissionTitre }: { emissionTitre: string }) {
  const { navigate } = useNavigation()
  const [, forceUpdate] = useState(0)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  useEffect(() => { const unsub = subscribe(() => forceUpdate(n => n + 1)); return () => { unsub() } }, [])

  const regles = getRegles(emissionTitre)

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <SectionTitle>Règles d'habillage en cours</SectionTitle>
        <button
          onClick={() => navigate('NouvelleRegle', { emissionTitre })}
          className={BTN_PRIMARY}
        >
          <Plus className="size-4" />
          Nouvelle règle
        </button>
      </div>
      <div className="flex flex-col gap-3">

        {regles.map(regle => (
          <div key={regle.id} className={CARD}>

            {/* En-tête : date + mode + canaux */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <ItemTitle>
                  {regle.appliedDateDebut && regle.appliedDateFin
                    ? `${formatDateFr(regle.appliedDateDebut)} → ${formatDateFr(regle.appliedDateFin)}`
                    : 'Nouvelle règle'
                  }
                </ItemTitle>
                <span className="text-[13px] text-gray-400">{MODE_LABELS[regle.modeTemporalite]}</span>
              </div>
              <CanauxBadges interne={regle.interne} externe={regle.externe} />
            </div>

            <RegleReadView regle={regle} />

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => navigate('NouvelleRegle', { emissionTitre, regleId: String(regle.id) })}
                className={BTN_SECONDARY}
              >
                Modifier
              </button>
              <button
                onClick={() => setConfirmDeleteId(regle.id)}
                title="Supprimer"
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400"
              >
                <Trash2 className="size-3.5" />
              </button>
              <div className="flex-1" />
              {regle.nbEpisodes > 0 && (
                <button
                  onClick={() => navigate('ListeEpisodes', { titre: emissionTitre, dateDebut: regle.appliedDateDebut, dateFin: regle.appliedDateFin })}
                  className="flex items-center gap-1.5 text-blue-rf text-[15px] cursor-pointer hover:underline transition-colors shrink-0"
                >
                  <List className="size-3.5" />
                  {regle.nbEpisodes} épisode{regle.nbEpisodes > 1 ? 's' : ''} concerné{regle.nbEpisodes > 1 ? 's' : ''}
                </button>
              )}
            </div>

          </div>
        ))}

        {confirmDeleteId !== null && (
          <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            onClick={() => setConfirmDeleteId(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col gap-3 w-80"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-gray-900">Supprimer cette règle ?</h3>
              <p className="text-sm text-gray-500">Cette action est irréversible. Les habillages associés seront perdus.</p>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => { removeRegle(emissionTitre, confirmDeleteId); setConfirmDeleteId(null) }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium cursor-pointer hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
