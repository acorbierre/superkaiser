import { LABEL, SELECT } from '@/lib/styles'
import { cn } from '@/lib/utils'

interface SelectFieldProps {
  label: React.ReactNode
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function SelectField({ label, disabled, children, className }: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className={cn(LABEL, disabled && 'opacity-50')}>{label}</label>
      <div className="relative">
        <select className={SELECT} disabled={disabled}>
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
