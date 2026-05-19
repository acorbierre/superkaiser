
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, SlidersHorizontal, Search, RefreshCw, Maximize2, ChevronDown, Minus, Plus } from 'lucide-react'
import FiltresPanel, { type FiltresState } from './filtres-panel'
import { BTN_PRIMARY } from '@/lib/styles'
import { STATION } from '@/data/sons'

// ─── Datepicker ───────────────────────────────────────────────────────────────

const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']
const MOIS_LONGS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const JOURS_COURTS = ['lu','ma','me','je','ve','sa','di']
const JOURS_LONGS = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']

function formatDate(d: Date) {
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1 // 0=lundi
  const label = JOURS_LONGS[dow]
  return `${label.charAt(0).toUpperCase() + label.slice(1)} ${d.getDate()} ${MOIS_LONGS[d.getMonth()]} ${d.getFullYear()}`
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function getCalendarDays(year: number, month: number): { date: Date; current: boolean }[] {
  const firstDay = new Date(year, month, 1)
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // 0=lundi
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { date: Date; current: boolean }[] = []

  // jours mois précédent
  for (let i = startDow - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false })

  // jours mois courant
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true })

  // compléter jusqu'à multiple de 7
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7)
    for (let d = 1; d <= remaining; d++)
      cells.push({ date: new Date(year, month + 1, d), current: false })

  return cells
}

function DatePicker({ selected, onChange, onClose }: {
  selected: Date
  onChange: (d: Date) => void
  onClose: () => void
}) {
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())
  const [yearView, setYearView] = useState(false)
  const [decadeStart, setDecadeStart] = useState(Math.floor(selected.getFullYear() / 12) * 12)

  const cells = getCalendarDays(viewYear, viewMonth)
  const today = new Date()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-100 p-5 w-[340px]">
      {yearView ? (
        <>
          {/* Navigation décennie */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setDecadeStart(d => d - 12)} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-[15px] font-semibold text-[#463acb]">{decadeStart} — {decadeStart + 11}</span>
            <button onClick={() => setDecadeStart(d => d + 12)} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <hr className="border-gray-100 mb-3" />
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }, (_, i) => decadeStart + i).map(year => (
              <button
                key={year}
                onClick={() => { setViewYear(year); setYearView(false) }}
                className={`h-9 rounded-lg text-[14px] font-medium transition-colors cursor-pointer
                  ${year === viewYear ? 'bg-[#463acb] text-white' : 'text-[#333] hover:bg-gray-100'}
                  ${year === today.getFullYear() && year !== viewYear ? 'text-[#463acb]' : ''}
                `}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Navigation mois */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-0.5">
              <button onClick={prevMonth} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
                <ChevronLeft className="size-4" />
              </button>
            </div>
            <button
              onClick={() => { setDecadeStart(Math.floor(viewYear / 12) * 12); setYearView(true) }}
              className="text-[15px] font-semibold text-[#463acb] hover:underline cursor-pointer"
            >
              {MOIS[viewMonth]} <span className="font-bold">{viewYear}</span>
            </button>
            <div className="flex items-center gap-0.5">
              <button onClick={nextMonth} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <hr className="border-gray-100 mb-3" />

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 mb-1">
            {JOURS_COURTS.map(j => (
              <div key={j} className="text-center text-[13px] text-gray-400 py-1">{j}</div>
            ))}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-7">
            {cells.map(({ date, current }, idx) => {
              const isSelected = isSameDay(date, selected)
              const isToday = isSameDay(date, today)
              return (
                <button
                  key={idx}
                  onClick={() => { onChange(date); onClose() }}
                  className={`
                    text-[14px] h-9 w-full flex items-center justify-center rounded-lg transition-colors cursor-pointer
                    ${isSelected ? 'bg-[#463acb] text-white font-semibold' : ''}
                    ${!isSelected && isToday ? 'text-[#463acb] font-semibold' : ''}
                    ${!isSelected && !current ? 'text-gray-300' : ''}
                    ${!isSelected && current && !isToday ? 'text-[#333] hover:bg-gray-100' : ''}
                    ${isSelected ? 'hover:bg-[#3b30b0]' : ''}
                  `}
                >
                  {String(date.getDate()).padStart(2, '0')}
                </button>
              )
            })}
          </div>

          {/* Aujourd'hui */}
          <div className="mt-3">
            <button
              onClick={() => { onChange(today); onClose() }}
              className={`${BTN_PRIMARY} w-full justify-center`}
            >
              Aujourd'hui
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface Props {
  filtres: FiltresState
  onFiltresChange: (f: FiltresState) => void
  recherche: string
  onRechercheChange: (v: string) => void
  onDateChange?: () => void
}

export default function QualipoHeader({ filtres, onFiltresChange, recherche, onRechercheChange, onDateChange }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 19))
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [filtresOpen, setFiltresOpen] = useState(false)
  const [refreshOpen, setRefreshOpen] = useState(false)
  const [intervalMin, setIntervalMin] = useState(3)
  const [pendingMin, setPendingMin] = useState(3)
  const [countdown, setCountdown] = useState(180)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => c <= 1 ? intervalMin * 60 : c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [intervalMin])

  function validerInterval() {
    const val = Math.max(1, pendingMin)
    setIntervalMin(val)
    setCountdown(val * 60)
    setRefreshOpen(false)
  }

  function prevDay() {
    setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n })
    onDateChange?.()
  }
  function nextDay() {
    setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n })
    onDateChange?.()
  }

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  return (
    <div className="relative">
      <div className="flex items-center gap-6 px-4 h-[70px] bg-white border-b border-gray-200">
        {/* Station */}
        <button className="flex items-center gap-2 shrink-0 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors">
          <div
            className="size-8 rounded flex items-center justify-center text-white text-[10px] font-bold leading-none shrink-0"
            style={{ backgroundColor: STATION.couleur }}
          >
            {STATION.initiales}
          </div>
          <span className="font-medium text-[1.125rem] text-[#333]">{STATION.label}</span>
          <ChevronDown className="size-4 text-gray-500" />
        </button>

        {/* Navigation date + datepicker */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevDay}
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => { setCalendarOpen(o => !o); setRefreshOpen(false); setFiltresOpen(false) }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors cursor-pointer ${calendarOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <CalendarDays className="size-4 text-gray-500" />
              <span className="font-medium text-[1.125rem] text-[#333]">{formatDate(selectedDate)}</span>
            </button>

            {calendarOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCalendarOpen(false)} />
                <DatePicker
                  selected={selectedDate}
                  onChange={d => { setSelectedDate(d); onDateChange?.() }}
                  onClose={() => setCalendarOpen(false)}
                />
              </>
            )}
          </div>

          <button
            onClick={nextDay}
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4 text-gray-600" />
          </button>
        </div>

        {/* Filtres */}
        <button
          onClick={() => setFiltresOpen(o => !o)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-[1.125rem] font-medium transition-colors cursor-pointer ${
            filtresOpen ? 'bg-gray-100 text-[#333]' : 'text-[#333] hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="size-4" />
          Filtres
        </button>

        {/* Recherche */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            value={recherche}
            onChange={e => onRechercheChange(e.target.value)}
            placeholder="Rechercher une émission…"
            className="w-full h-10 pl-9 pr-3 text-[1.125rem] font-medium text-[#333] placeholder:font-normal placeholder:text-gray-400 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Refresh countdown + popover */}
          <div className="relative">
            <button
              onClick={() => { setRefreshOpen(o => !o); setPendingMin(intervalMin) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-sm text-gray-600"
            >
              <RefreshCw className="size-3.5" />
              <span className="tabular-nums font-medium">{mins}m{secs > 0 ? ` ${String(secs).padStart(2, '0')}s` : ''}</span>
            </button>

            {refreshOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRefreshOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-100 px-6 py-5 flex items-center gap-4 whitespace-nowrap">
                  <span className="text-[15px] text-[#333] font-medium">Rafraîchir toutes les</span>
                  <button
                    onClick={() => setPendingMin(v => Math.max(1, v - 1))}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-[#333] transition-colors"
                  >
                    <Minus className="size-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={pendingMin}
                      min={1}
                      onChange={e => setPendingMin(Math.max(1, Number(e.target.value)))}
                      className="w-12 h-9 border border-gray-200 rounded-lg text-center text-[15px] font-medium text-[#333] focus:outline-none focus:ring-2 focus:ring-[#463acb]/30"
                    />
                    <span className="text-[15px] text-gray-400">min(s)</span>
                  </div>
                  <button
                    onClick={() => setPendingMin(v => v + 1)}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-[#333] transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button onClick={validerInterval} className={BTN_PRIMARY}>
                    Valider
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
            <Maximize2 className="size-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Overlay + Panel filtres */}
      {filtresOpen && (
        <>
          <div
            className="fixed top-[145px] inset-x-0 bottom-0 bg-black/40 z-40"
            onClick={() => setFiltresOpen(false)}
          />
          <FiltresPanel
            filtres={filtres}
            onChange={onFiltresChange}
            onActualiser={() => setFiltresOpen(false)}
          />
        </>
      )}
    </div>
  )
}
