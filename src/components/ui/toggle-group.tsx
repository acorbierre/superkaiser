import { LABEL } from '@/lib/styles'

export interface Option {
  label: string
  value: string
}

interface ToggleGroupProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className="inline-flex h-10 bg-blue-rf/10 rounded-[6px] px-1 py-1 gap-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-full flex items-center px-5 rounded-[4px] text-[15px] font-medium transition-colors cursor-pointer ${
            value === opt.value
              ? 'bg-blue-rf text-white shadow-sm'
              : 'text-gray-900 hover:bg-gray-200/70'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface ToggleGroupLabelProps extends ToggleGroupProps {
  label: string
}

export function ToggleGroupLabel({ label, ...props }: ToggleGroupLabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className={LABEL}>{label}</span>
      <ToggleGroup {...props} />
    </div>
  )
}
