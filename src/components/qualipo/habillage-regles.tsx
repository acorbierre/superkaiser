import { useState } from 'react'
import { Trash2, Plus, List, GripVertical, Pencil, Check, X } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { INPUT, LINK, CARD, BTN_PRIMARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'

// ── Sons mock par type ─────────────────────────────────────────────────────────

const SONS_PREROLL = [
  'Xavier Mauduit - Intro Promo (7s)',
  'Voix féminine - Intro (7s)',
  'Générique court (4s)',
]

const SONS_POSTROLL = [
  'Écoute série complète (11s)',
  'Abonnez-vous (8s)',
  'Intro musique (10s)',
]

// ── Types ──────────────────────────────────────────────────────────────────────

type RollType = 'preroll' | 'postroll'

interface RollItem {
  id: number
  type: RollType
  son: string
  interne: boolean
  externe: boolean
}

interface Regle {
  id: number
  items: RollItem[]
  dateDebut: string
  dateFin: string
  appliedDateDebut: string
  appliedDateFin: string
  nbEpisodes: number
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function formatDateFr(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} ${MOIS[parseInt(m) - 1]} ${y}`
}

function mockEpisodeCount(debut: string, fin: string): number {
  if (!debut || !fin) return 0
  const d1 = new Date(debut)
  const d2 = new Date(fin)
  if (d2 < d1) return 0
  return Math.max(1, Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7)))
}

// ── Mock ───────────────────────────────────────────────────────────────────────

const REGLES_MOCK: Regle[] = [
  {
    id: 2,
    items: [
      { id: 1, type: 'preroll',  son: SONS_PREROLL[0],  interne: true, externe: true },
      { id: 2, type: 'postroll', son: SONS_POSTROLL[0], interne: true, externe: false },
    ],
    dateDebut: '2026-07-01', dateFin: '2026-07-31',
    appliedDateDebut: '2026-07-01', appliedDateFin: '2026-07-31',
    nbEpisodes: 3,
  },
  {
    id: 1,
    items: [
      { id: 1, type: 'preroll', son: SONS_PREROLL[1], interne: true, externe: true },
    ],
    dateDebut: '2026-06-01', dateFin: '2026-06-30',
    appliedDateDebut: '2026-06-01', appliedDateFin: '2026-06-30',
    nbEpisodes: 4,
  },
]

// ── RollList ───────────────────────────────────────────────────────────────────

function RollList({ items, onAdd, onRemove, onUpdate, readOnly = false }: {
  items: RollItem[]
  onAdd: () => void
  onRemove: (id: number) => void
  onUpdate: (id: number, field: string, value: string | boolean) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col">
      {items.map((item, index, arr) => (
        <div
          key={item.id}
          className={`flex gap-3 items-start pb-4${index > 0 && arr.length > 1 ? ' border-t border-gray-200 pt-6' : ' pt-3'}`}
        >
          {!readOnly && <GripVertical className="size-4 text-gray-400 shrink-0 mt-2.5 cursor-grab" />}

          {readOnly ? (
            /* Lecture : libellé + canaux + player */
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[15px] text-gray-900">
                  <span className="font-semibold">{item.type === 'preroll' ? 'Pré-roll' : 'Post-roll'}</span> · {item.son}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  {(['interne', 'externe'] as const).map(canal => {
                    const on = item[canal]
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
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </div>
          ) : (
            <>
              {/* Type */}
              <SelectField
                className="w-32 shrink-0"
                value={item.type}
                onChange={val => {
                  onUpdate(item.id, 'type', val)
                  onUpdate(item.id, 'son', val === 'preroll' ? SONS_PREROLL[0] : SONS_POSTROLL[0])
                }}
              >
                <option value="preroll">Pré-roll</option>
                <option value="postroll">Post-roll</option>
              </SelectField>

              {/* Son + player */}
              <div className="flex-1 flex flex-col gap-2">
                <SelectField
                  value={item.son}
                  onChange={val => onUpdate(item.id, 'son', val)}
                >
                  {(item.type === 'preroll' ? SONS_PREROLL : SONS_POSTROLL).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </SelectField>
                <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
              </div>
            </>
          )}

          {/* Canaux */}
          {!readOnly && (
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Switch checked={item.interne} onCheckedChange={val => onUpdate(item.id, 'interne', val)} />
                <span className="text-sm text-gray-700">Interne</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Switch checked={item.externe} onCheckedChange={val => onUpdate(item.id, 'externe', val)} />
                <span className="text-sm text-gray-700">Externe</span>
              </label>
            </div>
          )}

          {/* Trash */}
          {!readOnly && (
            <button
              onClick={() => onRemove(item.id)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400 shrink-0 mt-0.5"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button onClick={onAdd} className={`${LINK} mt-1`}>
          <Plus className="size-4" />
          Ajouter un habillage
        </button>
      )}
    </div>
  )
}

// ── HabillageRegles ────────────────────────────────────────────────────────────

export function HabillageRegles({ emissionTitre }: { emissionTitre: string }) {
  const { navigate } = useNavigation()
  const [regles, setRegles] = useState<Regle[]>(REGLES_MOCK)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [snapshots, setSnapshots] = useState<Record<number, Regle>>({})

  // Nouvelle règle
  const [showNew, setShowNew]           = useState(false)
  const [newDateDebut, setNewDateDebut] = useState('')
  const [newDateFin, setNewDateFin]     = useState('')
  const [newItems, setNewItems]         = useState<RollItem[]>([{ id: 1, type: 'preroll', son: SONS_PREROLL[0], interne: true, externe: true }])

  function cancelNew() {
    setShowNew(false)
    setNewDateDebut('')
    setNewDateFin('')
    setNewItems([{ id: 1, type: 'preroll', son: SONS_PREROLL[0], interne: true, externe: true }])
  }

  function confirmNew() {
    setRegles(prev => [{
      id: Date.now(),
      items: newItems,
      dateDebut: newDateDebut,
      dateFin: newDateFin,
      appliedDateDebut: newDateDebut,
      appliedDateFin: newDateFin,
      nbEpisodes: mockEpisodeCount(newDateDebut, newDateFin),
    }, ...prev])
    cancelNew()
  }

  // Gestion règles existantes
  function removeRegle(id: number) {
    setRegles(prev => prev.filter(r => r.id !== id))
    setConfirmDeleteId(null)
  }

  function enterEditMode(regle: Regle) {
    setSnapshots(prev => ({ ...prev, [regle.id]: { ...regle, items: regle.items.map(i => ({ ...i })) } }))
    setEditingId(regle.id)
  }

  function cancelEdit(id: number) {
    const snap = snapshots[id]
    if (!snap?.appliedDateDebut && !snap?.appliedDateFin) {
      setRegles(prev => prev.filter(r => r.id !== id))
    } else {
      setRegles(prev => prev.map(r => r.id !== id ? r : snap))
    }
    setEditingId(null)
  }


  function updateDate(id: number, field: 'dateDebut' | 'dateFin', value: string) {
    setRegles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function validateEdit(id: number) {
    setRegles(prev => prev.map(r => r.id !== id ? r : {
      ...r,
      appliedDateDebut: r.dateDebut,
      appliedDateFin: r.dateFin,
      nbEpisodes: mockEpisodeCount(r.dateDebut, r.dateFin),
    }))
    setEditingId(null)
  }

  function addItem(regleId: number) {
    setRegles(prev => prev.map(r => r.id !== regleId ? r : {
      ...r,
      items: [...r.items, { id: Date.now(), type: 'preroll' as RollType, son: SONS_PREROLL[0], interne: true, externe: true }],
    }))
  }

  function removeItem(regleId: number, itemId: number) {
    setRegles(prev => prev.map(r => r.id !== regleId ? r : {
      ...r,
      items: r.items.filter(item => item.id !== itemId),
    }))
  }

  function updateItem(regleId: number, itemId: number, field: string, value: string | boolean) {
    setRegles(prev => prev.map(r => r.id !== regleId ? r : {
      ...r,
      items: r.items.map(item => item.id !== itemId ? item : { ...item, [field]: value }),
    }))
  }

  return (
    <>
      <SectionTitle className="mt-4">Règles d'habillage en cours</SectionTitle>
      <div className="flex flex-col gap-3">

      {/* Bloc nouvelle règle */}
      {!showNew ? (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-blue-rf px-8 py-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-rf/40 transition-colors cursor-pointer w-full"
        >
          <Plus className="size-3.5 shrink-0" />
          <span className="text-[15px]">Ajouter une règle</span>
        </button>
      ) : (
        <div className={`${CARD} ring-2 ring-blue-rf/25`}>
          <ItemTitle>Nouvelle règle</ItemTitle>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-3 items-center">
              <span className="text-[13px] text-gray-400 shrink-0">Du</span>
              <input type="date" value={newDateDebut} onChange={e => setNewDateDebut(e.target.value)} className={`${INPUT} w-40`} style={!newDateDebut ? { color: '#d1d5db' } : undefined} />
              <span className="text-[13px] text-gray-400 shrink-0">au</span>
              <input type="date" value={newDateFin} onChange={e => setNewDateFin(e.target.value)} className={`${INPUT} w-40`} style={!newDateFin ? { color: '#d1d5db' } : undefined} />
            </div>
            <RollList
              items={newItems}
              onAdd={() => setNewItems(prev => [...prev, { id: Date.now(), type: 'preroll', son: SONS_PREROLL[0], interne: true, externe: true }])}
              onRemove={id => setNewItems(prev => prev.filter(i => i.id !== id))}
              onUpdate={(id, field, value) => setNewItems(prev => prev.map(i => i.id !== id ? i : { ...i, [field]: value }))}
            />
            <div className="flex items-center gap-2">
              <button onClick={confirmNew} disabled={!newDateDebut || !newDateFin} className={`${BTN_PRIMARY} disabled:opacity-40 disabled:cursor-not-allowed`}>
                Valider
              </button>
              <button onClick={cancelNew} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Règles existantes */}
      {regles.map(regle => {
        const isEditing = editingId === regle.id
        return (
          <div key={regle.id} className={`${CARD}${isEditing ? ' ring-2 ring-blue-rf/25' : ''}`}>

            {/* Header : titre + pill épisodes */}
            <div className="flex items-center justify-between gap-4">
              <ItemTitle>
                {regle.appliedDateDebut && regle.appliedDateFin
                  ? `${formatDateFr(regle.appliedDateDebut)} → ${formatDateFr(regle.appliedDateFin)}`
                  : 'Nouvelle règle'
                }
              </ItemTitle>
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

            {/* Dates (mode édition uniquement) */}
            {isEditing && (
              <div className="flex gap-3 items-center mt-4">
                <span className="text-[13px] text-gray-400 shrink-0">Du</span>
                <input type="date" value={regle.dateDebut} onChange={e => updateDate(regle.id, 'dateDebut', e.target.value)} className={`${INPUT} w-40`} style={!regle.dateDebut ? { color: '#d1d5db' } : undefined} />
                <span className="text-[13px] text-gray-400 shrink-0">au</span>
                <input type="date" value={regle.dateFin} onChange={e => updateDate(regle.id, 'dateFin', e.target.value)} className={`${INPUT} w-40`} style={!regle.dateFin ? { color: '#d1d5db' } : undefined} />
              </div>
            )}

            {/* Habillages + footer */}
            <div className={`flex flex-col gap-4 ${isEditing ? 'mt-4' : 'mt-6'}`}>
              <RollList
                items={regle.items}
                onAdd={() => addItem(regle.id)}
                onRemove={itemId => removeItem(regle.id, itemId)}
                onUpdate={(itemId, field, value) => updateItem(regle.id, itemId, field, value)}
                readOnly={!isEditing}
              />
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button onClick={() => validateEdit(regle.id)} disabled={!regle.dateDebut || !regle.dateFin} className={`${BTN_PRIMARY} disabled:opacity-40 disabled:cursor-not-allowed`}>
                      Valider
                    </button>
                    <button onClick={() => cancelEdit(regle.id)} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                      Annuler
                    </button>
                  </>
                ) : (
                  <button onClick={() => enterEditMode(regle)} className={`${BTN_PRIMARY} flex items-center gap-1.5`}>
                    <Pencil className="size-3.5" />
                    Modifier
                  </button>
                )}
                <div className="flex-1" />
                <button onClick={() => setConfirmDeleteId(regle.id)} title="Supprimer" className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

          </div>
        )
      })}

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
                onClick={() => removeRegle(confirmDeleteId)}
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
