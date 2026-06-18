import { CONTENUS_PAGES } from "@/data/navigation";

interface SubNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function SubNav({ activePage, onNavigate }: SubNavProps) {
  return (
    <nav className="h-10 bg-[#343A40] flex items-center justify-center gap-6 shrink-0">
      {CONTENUS_PAGES.map(({ label, enabled }) => (
        <button
          key={label}
          type="button"
          onClick={() => enabled && onNavigate(label)}
          className={`text-[1rem] transition-colors border-none bg-transparent ${
            label === activePage
              ? "text-white font-semibold cursor-pointer"
              : enabled
              ? "text-[#999] hover:text-white cursor-pointer"
              : "text-[#999] cursor-default"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
