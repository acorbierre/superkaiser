import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { CONTENUS_DROPDOWN, CONTENUS_PAGE_SET, TOP_NAV_LINKS } from "@/data/navigation";

interface TopNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCatalog: () => void;
}

function ContenusDropdown({ active, onNavigate }: { active: boolean; onNavigate: (page: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <span
        onClick={() => setOpen(v => !v)}
        className={`text-[1rem] cursor-pointer select-none transition-colors ${active ? "text-white font-semibold" : "text-[#999] hover:text-white"}`}
      >
        Contenus
      </span>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded shadow-xl z-50 py-1 overflow-hidden">
          {CONTENUS_DROPDOWN.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-gray-200" />
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => { if (item.enabled) { onNavigate(item.label); setOpen(false); } }}
                className={`w-full text-left px-4 py-2.5 text-[1rem] transition-colors ${item.enabled ? "text-gray-800 hover:bg-gray-100 cursor-pointer" : "text-gray-400 cursor-default"}`}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function TopNav({ currentPage, onNavigate, onOpenCatalog }: TopNavProps) {
  const isContenus = CONTENUS_PAGE_SET.has(currentPage);

  return (
    <nav className="h-[75px] bg-[#343A40] flex items-center px-4 gap-6 shrink-0 relative z-[60]">
      {/* Burger — catalogue de composants */}
      <button
        onClick={onOpenCatalog}
        className="p-1.5 rounded text-[#999] hover:text-white hover:bg-white/10 transition-colors shrink-0"
        title="Catalogue de composants"
      >
        <Menu className="size-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="flex items-center gap-1">
          <img src="/favicon.svg" className="size-5" alt="" />
          <span className="text-[1rem] font-bold tracking-tight text-white">SuperKaiser</span>
        </div>
        <span className="text-[10px] font-bold border border-[#666] text-[#777] px-1 py-0.5 rounded leading-none">
          PROTO
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-6 flex-1">
        <span className="text-[1rem] cursor-default select-none text-[#999]">
          Grille des programmes
        </span>

        <ContenusDropdown active={isContenus} onNavigate={onNavigate} />

        {TOP_NAV_LINKS.map(({ label, page }) => {
          const active = page === currentPage;
          const clickable = page !== null;
          return (
            <span
              key={label}
              onClick={() => page && onNavigate(page)}
              className={`text-[1rem] select-none transition-colors ${
                active
                  ? "text-white font-semibold"
                  : clickable
                  ? "text-[#999] cursor-pointer hover:text-white"
                  : "text-[#999] cursor-default"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* User */}
      <span className="text-[1rem] text-[#999]">CORBIERRE Anne (externe)</span>
    </nav>
  );
}
