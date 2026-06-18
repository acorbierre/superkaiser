import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { sons } from "@/data/sons";
import { DatePickerPopup, formatDateShort } from "./date-picker";
import { BTN_PRIMARY, INPUT, LABEL, SELECT } from "@/lib/styles";

const STATIONS = [
  { id: "1", label: "[1] France Inter" },
  { id: "2", label: "[2] France Info" },
  { id: "5", label: "[5] France Culture" },
];

const TYPES = ["Tous les types", "Antenne", "Web", "Externe"];

const ALL_EMISSIONS = Array.from(new Set(sons.map(s => s.emission))).sort();
const ALL_MIDS = sons.map(s => ({ mid: s.numeroMagnetotheque, titre: s.titre }));

function SelectWrapper({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  return (
    <div className="relative">
      <div className={empty ? "text-gray-400" : "text-gray-800"}>
        {children}
      </div>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function DiffusionsSearch() {
  const [mid, setMid] = useState("");
  const [emission, setEmission] = useState("");
  const [station, setStation] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [type, setType] = useState("");
  const [rediffusion, setRediffusion] = useState(false);
  const [emissionOpen, setEmissionOpen] = useState(false);
  const [midOpen, setMidOpen] = useState(false);

  const emissionContainerRef = useRef<HTMLDivElement>(null);
  const midContainerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const emissionSuggestions = emission.length >= 1
    ? ALL_EMISSIONS.filter(e => e.toLowerCase().includes(emission.toLowerCase())).slice(0, 8)
    : [];

  const midSuggestions = mid.length >= 1
    ? ALL_MIDS.filter(m => m.mid.toLowerCase().includes(mid.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (emissionContainerRef.current && !emissionContainerRef.current.contains(e.target as Node))
        setEmissionOpen(false);
      if (midContainerRef.current && !midContainerRef.current.contains(e.target as Node))
        setMidOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node))
        setCalendarOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 px-6 pt-5 pb-5 rounded-lg" style={{ width: 1100, background: "#E9ECEF" }}>

        {/* Ligne 1 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Station */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Station</label>
            <SelectWrapper empty={!station}>
              <select value={station} onChange={e => setStation(e.target.value)} className={SELECT}>
                <option value="">Toutes les stations</option>
                {STATIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </SelectWrapper>
          </div>

          {/* Émission */}
          <div ref={emissionContainerRef} className="flex flex-col gap-1.5 relative">
            <label className={LABEL}>Émission</label>
            <input
              type="text"
              value={emission}
              onChange={e => { setEmission(e.target.value); setEmissionOpen(true); }}
              onFocus={() => emissionSuggestions.length > 0 && setEmissionOpen(true)}
              placeholder="Saisissez les premières lettres..."
              className={INPUT}
            />
            {emissionOpen && emissionSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
                {emissionSuggestions.map(e => (
                  <button key={e} type="button"
                    onMouseDown={ev => { ev.preventDefault(); setEmission(e); setEmissionOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[1rem] text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <img src="/stations/france-inter.svg" alt="France Inter" className="shrink-0 w-5 h-5 rounded-full" />
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MID */}
          <div ref={midContainerRef} className="flex flex-col gap-1.5 relative">
            <label className={LABEL}>MID (Magnétothèque MID)</label>
            <input
              type="text"
              value={mid}
              onChange={e => { setMid(e.target.value); setMidOpen(true); }}
              onFocus={() => midSuggestions.length > 0 && setMidOpen(true)}
              placeholder="Saisissez les premiers chiffres..."
              className={INPUT}
            />
            {midOpen && midSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
                {midSuggestions.map(m => (
                  <button key={m.mid} type="button"
                    onMouseDown={e => { e.preventDefault(); setMid(m.mid); setMidOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[1rem] text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3 min-w-0"
                  >
                    <img src="/stations/france-inter.svg" alt="France Inter" className="shrink-0 w-5 h-5 rounded-full" />
                    <span className="shrink-0">{m.mid}</span>
                    <span className="text-gray-400 truncate">— {m.titre}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ligne 2 */}
        <div className="grid grid-cols-3 gap-6 items-end">
          {/* Date */}
          <div ref={calendarRef} className="flex flex-col gap-1.5 relative">
            <label className={LABEL}>Date</label>
            <button
              type="button"
              onClick={() => setCalendarOpen(o => !o)}
              className={`h-10 px-3 rounded border border-gray-300 bg-white text-[1rem] outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition flex items-center gap-2 text-left w-full ${!date ? "text-gray-400" : "text-gray-800"}`}
            >
              <CalendarDays className="size-4 text-gray-400 shrink-0" />
              {date ? formatDateShort(date) : "jj/mm/aaaa"}
            </button>
            {calendarOpen && (
              <DatePickerPopup
                selected={date ?? new Date()}
                onChange={d => { setDate(d); setCalendarOpen(false); }}
                onClose={() => setCalendarOpen(false)}
              />
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Type (kind)</label>
            <SelectWrapper empty={!type || type === "Tous les types"}>
              <select value={type} onChange={e => setType(e.target.value)} className={SELECT}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </SelectWrapper>
          </div>

          {/* Rediffusion */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Rediffusion</label>
            <button
              type="button"
              onClick={() => setRediffusion(v => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${rediffusion ? "bg-[#463acb]" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${rediffusion ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Ligne 3 — Bouton */}
        <div className="flex justify-start">
          <button type="button" className={BTN_PRIMARY}>
            <Search className="size-4" />
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
