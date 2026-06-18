import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, SlidersHorizontal, Search, RefreshCw, Maximize2, ChevronDown, Minus, Plus } from 'lucide-react'
import FiltresPanel, { type FiltresState } from './filtres-panel'
import { BTN_PRIMARY } from '@/lib/styles'
import { STATION } from '@/data/constants'
import { DatePickerPopup, formatDate } from './date-picker'

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
          <button onClick={prevDay} className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
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
                <DatePickerPopup
                  selected={selectedDate}
                  onChange={d => { setSelectedDate(d); onDateChange?.() }}
                  onClose={() => setCalendarOpen(false)}
                  className="left-1/2 -translate-x-1/2"
                />
              </>
            )}
          </div>

          <button onClick={nextDay} className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
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
