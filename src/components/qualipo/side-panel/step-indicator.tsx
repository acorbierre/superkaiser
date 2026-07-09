import { Check, X } from 'lucide-react'
import type { StatutSon } from '@/data/sons'

export type StepState = 'done' | 'error' | 'pending'

export const STEPS = [
  { label: 'Livraison du son',           subtitle: 'Itéma' },
  { label: 'Traitement numérique',        subtitle: 'ENCOM' },
  { label: 'Distribution sur les canaux', subtitle: '' },
]

export function getStepState(statut: StatutSon, index: number): StepState {
  if (statut === 'attente') return 'pending'
  if (statut === 'non_disponible') return index === 0 ? 'error' : 'pending'
  if (statut === 'mid_non_conforme') return index === 0 ? 'error' : 'pending'
  if (statut === 'droits_fermes') return index === 0 ? 'done' : index === 1 ? 'error' : 'pending'
  return 'done'
}

export function StepIndicator({ state }: { state: StepState }) {
  if (state === 'done') return (
    <div className="size-8 rounded-full bg-[#25bc95] flex items-center justify-center shrink-0 z-10">
      <Check className="size-4 text-white" strokeWidth={3} />
    </div>
  )
  if (state === 'error') return (
    <div className="size-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 z-10">
      <X className="size-4 text-white" strokeWidth={3} />
    </div>
  )
  return (
    <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 z-10">
      <div className="size-2 rounded-full bg-gray-400" />
    </div>
  )
}
