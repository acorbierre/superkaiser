import { Calendar, Check, X } from 'lucide-react'
import type { StatutSon } from '@/data/sons'

export type StepState = 'done' | 'error' | 'pending' | 'scheduled'

export const STEPS = [
  { label: 'Livraison du son',           subtitle: 'Itéma' },
  { label: 'Traitement numérique',        subtitle: 'ENCOM' },
  { label: 'Contribution',                subtitle: 'Atlas' },
  { label: 'Distribution sur les canaux', subtitle: '' },
]

export function getStepState(statut: StatutSon, index: number): StepState {
  if (statut === 'attente') return 'pending'
  if (statut === 'livre_plusieurs_fois' || statut === 'mid_non_conforme') return 'error'
  if (statut === 'droits_fermes') return index === 0 ? 'done' : 'error'
  if (statut === 'liberation_programmee') return index === 0 ? 'done' : index <= 2 ? 'scheduled' : 'error'
  return 'done'
}

export function StepIndicator({ state }: { state: StepState }) {
  if (state === 'done') return (
    <div className="size-8 rounded-full bg-[#25bc95] flex items-center justify-center shrink-0 z-10 ring-4 ring-[#fbfaff]">
      <Check className="size-4 text-white" strokeWidth={3} />
    </div>
  )
  if (state === 'error') return (
    <div className="size-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 z-10 ring-4 ring-[#fbfaff]">
      <X className="size-4 text-white" strokeWidth={3} />
    </div>
  )
  if (state === 'scheduled') return (
    <div className="size-8 rounded-full bg-[#A845E4] flex items-center justify-center shrink-0 z-10 ring-4 ring-[#fbfaff]">
      <Calendar className="size-4 text-white" strokeWidth={2.5} />
    </div>
  )
  return (
    <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 z-10 ring-4 ring-[#fbfaff]">
      <div className="size-2 rounded-full bg-gray-400" />
    </div>
  )
}
