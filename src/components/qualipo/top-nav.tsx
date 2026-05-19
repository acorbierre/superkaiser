export default function TopNav() {
  const links = [
    { label: 'Grille des programmes', active: false },
    { label: 'Contenus',              active: false },
    { label: 'Qualipo',               active: true  },
    { label: 'RSS',                   active: false },
    { label: 'Streaming',             active: false },
    { label: 'Watchdog',              active: false },
  ]

  return (
    <nav className="h-[75px] bg-[#343A40] flex items-center px-4 gap-6 shrink-0 relative z-[60]">
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
        {links.map(({ label, active }) => (
          <span
            key={label}
            className={`text-[1rem] cursor-default select-none ${active ? 'text-white font-semibold' : 'text-[#999]'}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* User */}
      <span className="text-[1rem] text-[#999]">CORBIERRE Anne (externe)</span>
    </nav>
  )
}
