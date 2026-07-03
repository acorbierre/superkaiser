import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { useNavigation } from '@/contexts/navigation-context'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function getMonthCells(date: Date): { date: Date; currentMonth: boolean }[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const start = new Date(firstDay)
  start.setDate(1 - startOffset)
  const cells: { date: Date; currentMonth: boolean }[] = []
  const cur = new Date(start)
  while (cells.length < 35 || cur.getMonth() === month) {
    cells.push({ date: new Date(cur), currentMonth: cur.getMonth() === month })
    cur.setDate(cur.getDate() + 1)
    if (cells.length >= 42) break
  }
  return cells
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function getMockEpisodes(monthDate: Date) {
  const y = monthDate.getFullYear()
  const m = monthDate.getMonth()
  return [
    { id: 1, titre: 'Grande traversée des Alpes',          heure: '09:00', date: new Date(y, m, 2),  preRoll: true,  postRoll: true  },
    { id: 2, titre: 'La forêt amazonienne',                heure: '14:00', date: new Date(y, m, 5),  preRoll: true,  postRoll: false },
    { id: 3, titre: 'Les pionniers de l\'électronique',    heure: '09:00', date: new Date(y, m, 9),  preRoll: false, postRoll: true  },
    { id: 4, titre: 'Nuits blanches à Reykjavik',          heure: '09:00', date: new Date(y, m, 12), preRoll: false, postRoll: false },
    { id: 5, titre: 'Histoire du jazz en France',          heure: '14:00', date: new Date(y, m, 16), preRoll: true,  postRoll: true  },
    { id: 6, titre: 'Grande traversée des Alpes',          heure: '09:00', date: new Date(y, m, 19), preRoll: true,  postRoll: false },
    { id: 7, titre: 'Le mystère des marées',               heure: '09:00', date: new Date(y, m, 23), preRoll: false, postRoll: false },
    { id: 8, titre: 'Nuits de France Culture — Archives',  heure: '00:00', date: new Date(y, m, 26), preRoll: false, postRoll: true  },
    { id: 9, titre: 'Grande traversée des Alpes',          heure: '09:00', date: new Date(y, m, 30), preRoll: true,  postRoll: true  },
  ].filter(e => e.date.getMonth() === m)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalendrierPage() {
  const { params, navigate } = useNavigation()
  const { titre } = params

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const today = new Date()

  const cells = getMonthCells(currentDate)
  const episodes = getMockEpisodes(currentDate)

  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-8">

        {/* Calendrier */}
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">

          {/* Header : retour + titre centré + nav mois */}
          <div className="px-6 py-5 flex items-center border-b border-gray-100">
            <div className="w-56 shrink-0">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <ArrowLeft className="size-4" />
                Retour
              </button>
            </div>
            <div className="flex-1 text-center">
              <PageTitle>{titre ?? '—'}</PageTitle>
            </div>
            <div className="w-56 shrink-0 flex items-center justify-end gap-2">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 cursor-pointer transition-colors text-gray-500">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[15px] font-semibold text-gray-800 w-40 text-center">
                {MOIS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 cursor-pointer transition-colors text-gray-500">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {JOURS.map(j => (
              <div key={j} className="h-10 flex items-center justify-center text-sm font-semibold text-gray-500">
                {j}
              </div>
            ))}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-7">
            {cells.map(({ date, currentMonth }, i) => {
              const isToday = isSameDay(date, today)
              const dayEpisodes = episodes.filter(e => isSameDay(e.date, date))
              const colIndex = i % 7
              return (
                <div
                  key={i}
                  className={`min-h-[110px] p-2 flex flex-col gap-1.5 border-b border-gray-100${colIndex > 0 ? ' border-l border-gray-100' : ''}`}
                >
                  <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full${isToday ? ' bg-blue-rf text-white' : currentMonth ? ' text-gray-700' : ' text-gray-300'}`}>
                    {date.getDate()}
                  </span>

                  {dayEpisodes.map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => navigate('HabillageDetail', { titre: ep.titre, type: 'diffusion' })}
                      className="w-full text-left rounded text-[14px] px-1.5 py-1 flex flex-col gap-0.5 cursor-pointer hover:brightness-95 transition-all"
                      style={{ backgroundColor: '#DBEAFF', borderLeft: '3px solid #463acb' }}
                    >
                      <span className="font-bold text-gray-900">{ep.heure}</span>
                      <span className="truncate text-gray-700">{ep.titre}</span>
                      <div className="grid grid-cols-2 gap-1 mt-0.5">
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded leading-none flex items-center justify-center gap-0.5 ${ep.preRoll ? 'bg-white/80 text-[#463acb]' : 'bg-white/30 text-[#463acb]/30'}`}>
                          {ep.preRoll ? 'Pré-roll' : '—'}
                        </span>
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded leading-none flex items-center justify-center gap-0.5 ${ep.postRoll ? 'bg-white/80 text-[#463acb]' : 'bg-white/30 text-[#463acb]/30'}`}>
                          {ep.postRoll ? 'Post-roll' : '—'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
