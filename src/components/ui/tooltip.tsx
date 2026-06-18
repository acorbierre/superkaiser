interface TooltipProps {
  label: string
  children: React.ReactNode
  /** Alignement horizontal de la bulle par rapport au trigger (défaut : right) */
  align?: 'left' | 'center' | 'right'
  /** Classe de largeur Tailwind. Par défaut : whitespace-nowrap (largeur auto) */
  width?: string
}

export function Tooltip({ label, children, align = 'right', width }: TooltipProps) {
  const posClass = {
    left:   'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right:  'right-0',
  }[align]

  return (
    <div className="relative group/tip inline-flex cursor-pointer">
      {children}
      <span
        className={`pointer-events-none absolute bottom-full mb-2 rounded bg-gray-900 px-3 py-1.5 text-[13px] leading-snug text-white opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 ${posClass} ${width ?? 'whitespace-nowrap'}`}
      >
        {label}
      </span>
    </div>
  )
}
