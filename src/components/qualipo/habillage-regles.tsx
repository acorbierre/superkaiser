import { useState, useEffect } from 'react'
import { Trash2, Plus, List, Check, X, Pencil } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, BTN_PRIMARY, BTN_SECONDARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import {
  getRegles, removeRegle, subscribe, formatDateFr,
  MODE_LABELS, JOURS, JOURS_LABELS, JOURS_COURTS, MOIS,
  type Regle, type RollConfig, type JourSemaine,
} from '@/data/regles-store'

const ROLL_PILL = 'self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] text-blue-rf bg-blue-rf/10'

// ── Timeline récap des règles ───────────────────────────────────────────────────

const TIMELINE_PALETTE = ['bg-blue-rf', 'bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-pink-500']

function buildMonthTicks(minMs: number, maxMs: number): { key: string; label: string; pct: number }[] {
  const range = maxMs - minMs || 1
  const start = new Date(minMs)
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const ticks: { key: string; label: string; pct: number }[] = []
  let guard = 0
  while (cursor.getTime() <= maxMs && guard < 12) {
    const pct = ((cursor.getTime() - minMs) / range) * 100
    ticks.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: `${MOIS[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`,
      pct: Math.min(Math.max(pct, 0), 100),
    })
    cursor.setMonth(cursor.getMonth() + 1)
    guard++
  }
  return ticks
}

function ReglesTimeline({
  regles, onSelectRegle, onAddRegle,
}: {
  regles: Regle[]
  onSelectRegle: (id: number) => void
  onAddRegle: () => void
}) {
  if (regles.length === 0) return null

  const sorted = [...regles].sort((a, b) => a.appliedDateDebut.localeCompare(b.appliedDateDebut))

  const starts = sorted.map(r => new Date(r.appliedDateDebut).getTime())
  const finiteEnds = sorted.filter(r => r.appliedDateFin).map(r => new Date(r.appliedDateFin).getTime())
  const today = Date.now()
  const minDate = Math.min(...starts)
  const maxDate = Math.max(...starts, ...finiteEnds, today)
  const range = Math.max(maxDate - minDate, 1000 * 60 * 60 * 24)

  const monthTicks = buildMonthTicks(minDate, maxDate)

  const segments = sorted.map((r, i) => {
    const ongoing = !r.appliedDateFin
    const start = new Date(r.appliedDateDebut).getTime()
    const end = ongoing ? maxDate : new Date(r.appliedDateFin).getTime()
    const left = ((start - minDate) / range) * 100
    const width = Math.max(((end - start) / range) * 100, 1.5)
    const label = `${formatDateFr(r.appliedDateDebut)} → ${ongoing ? 'en cours' : formatDateFr(r.appliedDateFin)}`
    return { regle: r, color: TIMELINE_PALETTE[i % TIMELINE_PALETTE.length], left, width, ongoing, label }
  })

  return (
    <div className={CARD}>
      <ItemTitle>{regles.length} règle{regles.length > 1 ? 's' : ''} active{regles.length > 1 ? 's' : ''}</ItemTitle>

      {/* Segments : nom + dates + piste, zone de hover unifiee */}
      <div className="relative mt-8 h-[54px]">
        <div className="absolute inset-x-0 top-[48px] h-1.5 rounded-full bg-gray-100 -z-10" />
        {segments.map(s => (
          <button
            key={s.regle.id}
            type="button"
            onClick={() => onSelectRegle(s.regle.id)}
            title={s.label}
            className="group absolute top-0 flex flex-col items-start text-left cursor-pointer"
            style={{ left: `${s.left}%`, width: `${s.width}%` }}
          >
            <span className="text-[14px] leading-4 font-semibold text-gray-700 whitespace-nowrap">
              {s.regle.nom || ' '}
            </span>
            <span className="text-[14px] leading-4 text-gray-500 whitespace-nowrap mt-1">{s.label}</span>
            <span
              className={`block w-full h-1.5 rounded-full mt-3 transition-transform duration-150 group-hover:scale-y-150 ${s.color}`}
              style={{ maskImage: s.ongoing ? 'linear-gradient(to right, black 80%, transparent 100%)' : undefined }}
            />
          </button>
        ))}
      </div>

      <div className="relative mt-2 h-4">
        {monthTicks.map(t => (
          <span
            key={t.key}
            className="absolute text-[13px] text-gray-500 whitespace-nowrap"
            style={{ left: `${t.pct}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>

      <button onClick={onAddRegle} className={`${BTN_PRIMARY} mt-6`}>
        <Plus className="size-4" />
        Ajouter une règle
      </button>
    </div>
  )
}

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
        <span className={ROLL_PILL}>Pré-roll</span>
        {config.preroll
          ? <>
              <p className="text-[15px] text-gray-900">{config.preroll}</p>
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </>
          : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
        }
      </div>
      <div className="flex flex-col gap-2">
        <span className={ROLL_PILL}>Post-roll</span>
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
            <span className={ROLL_PILL}>Pré-roll</span>
            <span className={ROLL_PILL}>Post-roll</span>
          </div>
          {joursActifs.map(jour => {
            const c = regle.configJours?.[jour] ?? { preroll: '', postroll: '' }
            return (
              <div key={jour} className="flex flex-col gap-3 py-3 border-b border-gray-100">
                <span className={ROLL_PILL}>{JOURS_LABELS[jour]}</span>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className={ROLL_PILL}>Pré-roll</span>
                    {c.preroll
                      ? <><p className="text-[15px] text-gray-900">{c.preroll}</p><AudioPlayer compact noBg noDurations dureeLabel="00:00:07" /></>
                      : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
                    }
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className={ROLL_PILL}>Post-roll</span>
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

  function scrollToRegle(id: number) {
    document.getElementById(`regle-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <SectionTitle className="mt-4 mb-5">Règles d'habillage en cours</SectionTitle>

      <ReglesTimeline
        regles={regles}
        onSelectRegle={scrollToRegle}
        onAddRegle={() => navigate('NouvelleRegle', { emissionTitre })}
      />

      <div className="flex flex-col gap-3 mt-4">

        {regles.map(regle => (
          <div key={regle.id} id={`regle-${regle.id}`} className={CARD}>

            {/* En-tête : nom + date + mode */}
            <div className="flex flex-col gap-1">
              <ItemTitle>
                {regle.appliedDateDebut ? (
                  regle.nom
                    ? `${regle.nom} (${formatDateFr(regle.appliedDateDebut)} → ${regle.appliedDateFin ? formatDateFr(regle.appliedDateFin) : 'en cours'})`
                    : `${formatDateFr(regle.appliedDateDebut)} → ${regle.appliedDateFin ? formatDateFr(regle.appliedDateFin) : 'en cours'}`
                ) : 'Nouvelle règle'}
              </ItemTitle>
              <span className="text-[13px] text-gray-400">{MODE_LABELS[regle.modeTemporalite]}</span>
            </div>

            <RegleReadView regle={regle} />

            {/* Canaux */}
            <div className="mt-6">
              <CanauxBadges interne={regle.interne} externe={regle.externe} />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => navigate('NouvelleRegle', { emissionTitre, regleId: String(regle.id) })}
                className={`${BTN_SECONDARY} flex items-center gap-1.5`}
              >
                <Pencil className="size-3.5" />
                Modifier
              </button>
              <button
                onClick={() => setConfirmDeleteId(regle.id)}
                title="Supprimer"
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-blue-rf hover:text-red-400"
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
