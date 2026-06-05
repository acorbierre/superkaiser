import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BTN_PRIMARY } from '@/lib/styles'

const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']
const MOIS_LONGS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const JOURS_COURTS = ['lu','ma','me','je','ve','sa','di']
const JOURS_LONGS = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']

export function formatDate(d: Date) {
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
  const label = JOURS_LONGS[dow]
  return `${label.charAt(0).toUpperCase() + label.slice(1)} ${d.getDate()} ${MOIS_LONGS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateShort(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function getCalendarDays(year: number, month: number): { date: Date; current: boolean }[] {
  const firstDay = new Date(year, month, 1)
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const cells: { date: Date; current: boolean }[] = []
  for (let i = startDow - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true })
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7)
    for (let d = 1; d <= remaining; d++)
      cells.push({ date: new Date(year, month + 1, d), current: false })
  return cells
}

export function DatePickerPopup({ selected, onChange, onClose }: {
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
    <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-100 p-5 w-[340px]">
      {yearView ? (
        <>
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
              <button key={year} onClick={() => { setViewYear(year); setYearView(false) }}
                className={`h-9 rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${year === viewYear ? 'bg-[#463acb] text-white' : 'text-[#333] hover:bg-gray-100'} ${year === today.getFullYear() && year !== viewYear ? 'text-[#463acb]' : ''}`}>
                {year}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => { setDecadeStart(Math.floor(viewYear / 12) * 12); setYearView(true) }}
              className="text-[15px] font-semibold text-[#463acb] hover:underline cursor-pointer">
              {MOIS[viewMonth]} <span className="font-bold">{viewYear}</span>
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors text-[#463acb]">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <hr className="border-gray-100 mb-3" />
          <div className="grid grid-cols-7 mb-1">
            {JOURS_COURTS.map(j => <div key={j} className="text-center text-[13px] text-gray-400 py-1">{j}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map(({ date, current }, idx) => {
              const isSelected = isSameDay(date, selected)
              const isToday = isSameDay(date, today)
              return (
                <button key={idx} onClick={() => { onChange(date); onClose() }}
                  className={`text-[14px] h-9 w-full flex items-center justify-center rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-[#463acb] text-white font-semibold hover:bg-[#3b30b0]' : ''} ${!isSelected && isToday ? 'text-[#463acb] font-semibold' : ''} ${!isSelected && !current ? 'text-gray-300' : ''} ${!isSelected && current && !isToday ? 'text-[#333] hover:bg-gray-100' : ''}`}>
                  {String(date.getDate()).padStart(2, '0')}
                </button>
              )
            })}
          </div>
          <div className="mt-3">
            <button onClick={() => { onChange(today); onClose() }} className={`${BTN_PRIMARY} w-full justify-center`}>
              Aujourd'hui
            </button>
          </div>
        </>
      )}
    </div>
  )
}
