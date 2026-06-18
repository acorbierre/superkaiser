import { Check } from 'lucide-react'
import { BTN_PRIMARY, BTN_SECONDARY } from '@/lib/styles'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] px-10 py-10 w-[560px] text-center">
        <p className="text-[1.125rem] font-bold text-[#333] mb-3">
          Êtes-vous sûr de vouloir conserver ce son ?
        </p>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
          Après validation, les autres sons seront désactivés dans Qualipo.<br />
          Ils resteront néanmoins accessibles dans Itema.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={onCancel} className={BTN_SECONDARY}>Annuler</button>
          <button onClick={onConfirm} className={BTN_PRIMARY}>
            <Check className="size-4" />
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
