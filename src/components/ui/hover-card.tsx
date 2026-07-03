interface HoverCardProps {
  content: React.ReactNode
  children: React.ReactNode
}

export function HoverCard({ content, children }: HoverCardProps) {
  return (
    <div className="relative group/hc w-full">
      {children}
      <div className="pointer-events-none absolute bottom-full left-0 mb-2 z-50 opacity-0 group-hover/hc:opacity-100 transition-opacity w-max">
        <div className="bg-gray-50 rounded px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-gray-200">
          {content}
        </div>
      </div>
    </div>
  )
}
