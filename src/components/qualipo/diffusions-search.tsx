import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { sons } from "@/data/sons";
import { DatePickerPopup, formatDateShort } from "./date-picker";
import { BTN_PRIMARY } from "@/lib/styles";

const STATIONS = [
  { id: "1", label: "[1] France Inter" },
  { id: "2", label: "[2] France Info" },
  { id: "5", label: "[5] France Culture" },
];

const TYPES = ["Tous les types", "Antenne", "Web", "Externe"];

type Suggestion = { titre: string; mid: string };

const ALL_SUGGESTIONS: Suggestion[] = sons.map((s) => ({
  titre: s.titre,
  mid: s.numeroMagnetotheque,
}));

const INPUT_CLS = "h-10 px-3 rounded border border-gray-300 bg-white text-[1rem] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const LABEL_CLS = "text-[1rem] font-medium text-gray-700";
const SELECT_CLS = "w-full h-10 pl-3 pr-8 rounded border border-gray-300 bg-white text-[1rem] outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer";

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
  const [search, setSearch] = useState("");
  const [station, setStation] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [type, setType] = useState("");
  const [rediffusion, setRediffusion] = useState(false);
  const [open, setOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const suggestions = search.length >= 1
    ? ALL_SUGGESTIONS.filter((s) =>
        s.titre.toLowerCase().includes(search.toLowerCase()) ||
        s.mid.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node))
        setOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node))
        setCalendarOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className="flex flex-col gap-4 px-6 pt-5 pb-5 rounded-lg"
        style={{ width: 1100, background: "#E9ECEF" }}
      >
        {/* Ligne 1 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Station */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLS}>Station</label>
            <SelectWrapper empty={!station}>
              <select value={station} onChange={(e) => setStation(e.target.value)} className={SELECT_CLS}>
                <option value="">Toutes les stations</option>
                {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </SelectWrapper>
          </div>

          {/* Titre ou MID */}
          <div ref={searchContainerRef} className="col-span-2 flex flex-col gap-1.5 relative">
            <label className={LABEL_CLS}>Titre ou MID (N°Magnétothèque ID)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder="Saisissez les premiers caractères..."
              className={INPUT_CLS}
            />
            {open && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
                {suggestions.map((s) => (
                  <button key={s.mid} type="button"
                    onMouseDown={(e) => { e.preventDefault(); setSearch(s.titre); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[1rem] text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <img src="/stations/france-inter.svg" alt="France Inter" className="shrink-0 w-5 h-5 rounded-full" />
                    <span className="flex-1 truncate">
                      {s.titre} <span className="text-gray-400">— {s.mid}</span>
                    </span>
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
            <label className={LABEL_CLS}>Date</label>
            <button
              type="button"
              onClick={() => setCalendarOpen((o) => !o)}
              className={`h-10 px-3 rounded border border-gray-300 bg-white text-[1rem] outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition flex items-center gap-2 text-left w-full ${!date ? "text-gray-400" : "text-gray-800"}`}
            >
              <CalendarDays className="size-4 text-gray-400 shrink-0" />
              {date ? formatDateShort(date) : "jj/mm/aaaa"}
            </button>
            {calendarOpen && (
              <DatePickerPopup
                selected={date ?? new Date()}
                onChange={(d) => { setDate(d); setCalendarOpen(false); }}
                onClose={() => setCalendarOpen(false)}
              />
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLS}>Type (kind)</label>
            <SelectWrapper empty={!type || type === "Tous les types"}>
              <select value={type} onChange={(e) => setType(e.target.value)} className={SELECT_CLS}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </SelectWrapper>
          </div>

          {/* Rediffusion */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLS}>Rediffusion</label>
            <button
              type="button"
              onClick={() => setRediffusion((v) => !v)}
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
