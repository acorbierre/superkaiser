// Pill de statut, iso Atlas (Programmé / Publié / Brouillon)
type PillVariant = 'purple' | 'green' | 'orange' | 'greenSoft' | 'redSoft'

const VARIANT: Record<PillVariant, string> = {
  purple: 'bg-[#A845E4]',
  green:  'bg-[#188C18]',
  orange: 'bg-[#E55F01]',
  greenSoft: 'bg-[#25bc95]/20 text-[#0b6b53]',
  redSoft:   'bg-red-500/15 text-red-700',
}

export function Pill({ variant, small, children }: { variant: PillVariant; small?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex self-start items-center ${small ? 'px-2.5 h-6 text-xs' : 'px-3 h-[30px] text-sm'} rounded-full whitespace-nowrap ${variant.endsWith('Soft') ? '' : 'text-white '}${VARIANT[variant]}`}>
      {children}
    </span>
  )
}
