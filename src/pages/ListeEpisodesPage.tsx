import { useState, useMemo } from 'react'
import { ArrowLeft, CalendarDays, List, ChevronDown, Copy, Check, Volume2 } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { useNavigation } from '@/contexts/navigation-context'
import { BTN_PRIMARY, INPUT, LABEL } from '@/lib/styles'
import { STATION } from '@/data/constants'

// ── Checkbox ──────────────────────────────────────────────────────────────────

function StyledCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`size-5 rounded-[6px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
        checked ? 'bg-blue-rf border-blue-rf' : 'bg-white border-gray-300'
      }`}
    >
      {checked && <Check className="size-3 text-white" strokeWidth={2.5} />}
    </button>
  )
}

// ── Mock ──────────────────────────────────────────────────────────────────────

const TODAY = new Date()
const Y = TODAY.getFullYear()
const M = TODAY.getMonth()

const MOCK_EPISODES = [
  { id: 1, titre: 'Grande traversée des Alpes',         mid: '1234501', heure: '09:00', date: new Date(Y, M, 2),  redistribution: true,  preRoll: true,  preRollSon: 'Xavier Mauduit - Intro Promo (7s)',  postRoll: true,  postRollSon: 'Écoute série complète (11s)' },
  { id: 2, titre: 'La forêt amazonienne',               mid: '1234502', heure: '14:00', date: new Date(Y, M, 5),  redistribution: false, preRoll: true,  preRollSon: 'Générique court (4s)',               postRoll: false, postRollSon: null },
  { id: 3, titre: "Les pionniers de l'électronique",    mid: '1234503', heure: '09:00', date: new Date(Y, M, 9),  redistribution: true,  preRoll: false, preRollSon: null,                                 postRoll: true,  postRollSon: 'Abonnez-vous (8s)' },
  { id: 4, titre: 'Nuits blanches à Reykjavik',         mid: '1234504', heure: '09:00', date: new Date(Y, M, 12), redistribution: false, preRoll: false, preRollSon: null,                                 postRoll: false, postRollSon: null },
  { id: 5, titre: 'Histoire du jazz en France',         mid: '1234505', heure: '14:00', date: new Date(Y, M, 16), redistribution: true,  preRoll: true,  preRollSon: 'Intro musique (10s)',                postRoll: true,  postRollSon: 'Écoute série complète (11s)' },
  { id: 6, titre: 'Grande traversée des Alpes',         mid: '1234506', heure: '09:00', date: new Date(Y, M, 19), redistribution: false, preRoll: true,  preRollSon: 'Xavier Mauduit - Intro Promo (7s)',  postRoll: false, postRollSon: null },
  { id: 7, titre: 'Le mystère des marées',              mid: '1234507', heure: '09:00', date: new Date(Y, M, 23), redistribution: false, preRoll: false, preRollSon: null,                                 postRoll: false, postRollSon: null },
  { id: 8, titre: 'Nuits de France Culture — Archives', mid: '1234508', heure: '00:00', date: new Date(Y, M, 26), redistribution: true,  preRoll: false, preRollSon: null,                                 postRoll: true,  postRollSon: 'Abonnez-vous (8s)' },
  { id: 9, titre: 'Grande traversée des Alpes',         mid: '1234509', heure: '09:00', date: new Date(Y, M, 30), redistribution: false, preRoll: true,  preRollSon: 'Générique court (4s)',               postRoll: true,  postRollSon: 'Intro musique (10s)' },
].filter(e => e.date.getMonth() === M)

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function formatDate(d: Date) {
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ListeEpisodesPage() {
  const { params, navigate } = useNavigation()
  const { titre } = params
  const [dateDebut, setDateDebut] = useState(params.dateDebut ?? '')
  const [dateFin, setDateFin]     = useState(params.dateFin ?? '')
  const [appliedRange, setAppliedRange] = useState({ debut: params.dateDebut ?? '', fin: params.dateFin ?? '' })
  const [copiedId, setCopiedId]   = useState<number | null>(null)

  const filteredEpisodes = useMemo(() => {
    const { debut, fin } = appliedRange
    if (!debut && !fin) return MOCK_EPISODES
    return MOCK_EPISODES.filter(ep => {
      const d = ep.date
      if (debut && d < new Date(debut)) return false
      if (fin && d > new Date(fin + 'T23:59:59')) return false
      return true
    })
  }, [appliedRange])

  const [selected, setSelected] = useState<Set<number>>(new Set())

  const allSelected = filteredEpisodes.length > 0 && filteredEpisodes.every(ep => selected.has(ep.id))

  function toggleOne(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filteredEpisodes.map(e => e.id)))
  }

  function copyMid(id: number, mid: string) {
    navigator.clipboard.writeText(mid)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1088px] mx-auto px-6 py-8">

        {/* Header hors card */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('HabillageDetail', { titre: titre ?? '', type: 'emission' })}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
            >
              <ArrowLeft className="size-4" />
              Retour à l'émission
            </button>
            <div className="mt-2">
              <PageTitle>{titre ?? '—'}</PageTitle>
            </div>
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            <button
              onClick={() => navigate('Calendrier', { titre: titre ?? '' })}
              className="flex items-center gap-1.5 px-3 h-8 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors border-r border-gray-200"
            >
              <CalendarDays className="size-4" />
              Calendrier
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 font-semibold text-blue-rf bg-blue-rf/10 cursor-default">
              <List className="size-4" />
              Liste
            </button>
          </div>
        </div>

        {/* Card filtre période */}
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Filtrer du</label>
              <input
                type="date"
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                className={INPUT}
                style={!dateDebut ? { color: '#d1d5db' } : undefined}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Au</label>
              <input
                type="date"
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                className={INPUT}
                style={!dateFin ? { color: '#d1d5db' } : undefined}
              />
            </div>
            <button className={BTN_PRIMARY} onClick={() => setAppliedRange({ debut: dateDebut, fin: dateFin })}>Rechercher</button>
            {(dateDebut || dateFin) && (
              <button
                onClick={() => { setDateDebut(''); setDateFin(''); setAppliedRange({ debut: '', fin: '' }) }}
                className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Tri */}
        <div className="flex justify-end mb-3">
          <div className="relative">
            <select
              defaultValue="desc"
              className="h-10 pl-3 pr-8 rounded border border-gray-300 bg-white text-[15px] text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="desc">Trier du plus récent au plus ancien</option>
              <option value="asc">Trier du plus ancien au plus récent</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* En-têtes colonnes + tout sélectionner */}
        <div className="flex items-center gap-5 px-6 mb-4 text-sm font-normal text-gray-400">
          <div className="flex items-center w-5 shrink-0">
            <StyledCheckbox checked={allSelected} onChange={toggleAll} />
          </div>
          <div className="w-24 shrink-0">Date</div>
          <div className="w-16 shrink-0">Heure</div>
          <div className="w-7 shrink-0" />
          <div className="flex-1">Titre et MID</div>
          <div className="w-40 shrink-0">Pré-roll</div>
          <div className="w-40 shrink-0">Post-roll</div>
        </div>

        {/* Cards épisodes */}
        <div className="flex flex-col gap-3">
          {filteredEpisodes.map(ep => (
            <div
              key={ep.id}
              className={`bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] px-6 py-5 flex items-center gap-5 transition-all ${selected.has(ep.id) ? 'ring-2 ring-blue-rf/30' : ''}`}
            >
              {/* Checkbox */}
              <StyledCheckbox checked={selected.has(ep.id)} onChange={() => toggleOne(ep.id)} />

              {/* Date */}
              <div className="w-24 shrink-0 text-sm text-gray-600">{formatDate(ep.date)}</div>

              {/* Heure */}
              <div className="w-16 shrink-0 text-sm text-gray-600">{ep.heure}</div>

              {/* Logo station */}
              <img
                src={STATION.logo}
                alt={STATION.label}
                className="size-7 rounded-full object-cover shrink-0"
              />

              {/* Titre + MID + R */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {ep.redistribution && (
                    <span className="text-[11px] font-semibold rounded-[3px] px-1 leading-tight shrink-0" style={{ background: '#374694', color: '#FFFFFF' }}>R</span>
                  )}
                  <button onClick={() => navigate('HabillageDetail', { titre: ep.titre, type: 'diffusion', emission: titre })} className="text-[15px] font-semibold text-gray-800 truncate hover:underline cursor-pointer text-left">{ep.titre}</button>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>MID : {ep.mid}</span>
                  <button
                    onClick={() => copyMid(ep.id, ep.mid)}
                    className="p-0.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-gray-400 hover:text-gray-600"
                  >
                    {copiedId === ep.id
                      ? <Check className="size-3 text-green-500" />
                      : <Copy className="size-3" />
                    }
                  </button>
                </div>
              </div>

              {/* Pré-roll */}
              <div className="w-40 shrink-0">
                {ep.preRollSon
                  ? <div className="flex items-center gap-1.5 text-sm text-gray-600"><Volume2 className="size-3.5 shrink-0" /><span className="truncate">{ep.preRollSon}</span></div>
                  : <span className="text-sm text-gray-300">—</span>
                }
              </div>

              {/* Post-roll */}
              <div className="w-40 shrink-0">
                {ep.postRollSon
                  ? <div className="flex items-center gap-1.5 text-sm text-gray-600"><Volume2 className="size-3.5 shrink-0" /><span className="truncate">{ep.postRollSon}</span></div>
                  : <span className="text-sm text-gray-300">—</span>
                }
              </div>

            </div>
          ))}
        </div>

        {/* Barre d'actions flottante */}
        {selected.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-gray-100 px-6 py-4 flex items-center gap-6 z-50">
            <span className="text-sm font-semibold text-gray-700">
              {selected.size} épisode{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
            </span>
            <button className={BTN_PRIMARY}>
              Appliquer un habillage
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
