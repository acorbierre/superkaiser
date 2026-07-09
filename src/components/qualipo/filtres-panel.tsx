
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip } from '@/components/ui/tooltip'
import { Bell, Check, Clock, Calendar, Info, TriangleAlert, X } from 'lucide-react'
import { BTN_PRIMARY } from '@/lib/styles'

export interface FiltresState {
  livresDiffuses: boolean
  livresEnAvance: boolean
  enAttente: boolean
  dureesIncoherentes: boolean
  nonDisponibles: boolean
  natio: boolean
  multidiff: boolean
  toleranceMinutes: number
  tolerancePct: number
  joursPassés: number
  joursFuturs: number
}

interface Props {
  filtres: FiltresState
  onChange: (f: FiltresState) => void
  onActualiser: () => void
}

export const DEFAULT_FILTRES: FiltresState = {
  livresDiffuses: true,
  livresEnAvance: true,
  enAttente: true,
  dureesIncoherentes: true,
  nonDisponibles: true,
  natio: false,
  multidiff: false,
  toleranceMinutes: 2,
  tolerancePct: 10,
  joursPassés: 3,
  joursFuturs: 1,
}

export default function FiltresPanel({ filtres, onChange, onActualiser }: Props) {
  function set<K extends keyof FiltresState>(key: K, value: FiltresState[K]) {
    onChange({ ...filtres, [key]: value })
  }

  return (
    <div className="fixed top-[145px] left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl w-[1200px] shadow-[0_16px_60px_rgba(0,0,0,0.22)] [clip-path:inset(0_-100px_-100px_-100px)] animate-in fade-in duration-200">
      <div className="py-8 grid grid-cols-3 divide-x divide-gray-200">

        {/* Colonne 1 — Types de sons */}
        <div className="space-y-4 px-10">
          <div className="flex items-center gap-2 font-medium text-[1.125rem] text-gray-800">
            <Bell className="size-5" />
            Sons affichés
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={filtres.livresDiffuses}
                onCheckedChange={v => set('livresDiffuses', !!v)}
                className="size-6 rounded !border-0 !bg-[#CFECD5] text-transparent data-checked:!text-green-800"
              />
              <span className="text-[0.9375rem] text-gray-700">Livrés et diffusés</span>
              <Check className="size-4 text-[#25bc95] ml-auto shrink-0" />
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={filtres.livresEnAvance}
                onCheckedChange={v => set('livresEnAvance', !!v)}
                className="size-6 rounded !border-0 !bg-[#CFECD5] text-transparent data-checked:!text-green-800"
              />
              <span className="text-[0.9375rem] text-gray-700">Livrés en avance</span>
              <Check className="size-4 text-[#25bc95] ml-auto shrink-0" />
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={filtres.enAttente}
                onCheckedChange={v => set('enAttente', !!v)}
                className="size-6 rounded !border-0 !bg-gray-200 text-transparent data-checked:!text-gray-600"
              />
              <span className="text-[0.9375rem] text-gray-700">En attente de diffusion</span>
              <Clock className="size-4 text-gray-400 ml-auto shrink-0" />
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={filtres.dureesIncoherentes}
                onCheckedChange={v => set('dureesIncoherentes', !!v)}
                className="size-6 rounded !border-0 !bg-[#FFF2C6] text-transparent data-checked:!text-yellow-800"
              />
              <span className="text-[0.9375rem] text-gray-700">Livrés avec une durée incohérente</span>
              <TriangleAlert className="size-4 text-[#d36d27] ml-auto shrink-0" />
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={filtres.nonDisponibles}
                onCheckedChange={v => set('nonDisponibles', !!v)}
                className="size-6 rounded !border-0 !bg-[#FFB2B7] text-transparent data-checked:!text-red-800"
              />
              <span className="text-[0.9375rem] text-gray-700">Non disponibles</span>
              <X className="size-4 text-red-500 ml-auto shrink-0" />
            </label>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <Switch
                checked={filtres.natio}
                onCheckedChange={v => set('natio', v)}
                className="cursor-pointer data-checked:!bg-[#463acb] shrink-0"
              />
              <Label className="text-[0.9375rem] text-gray-700 cursor-pointer flex items-center gap-1">
                Natio <span className="text-gray-400 text-xs">ℹ</span>
              </Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch
                checked={filtres.multidiff}
                onCheckedChange={v => set('multidiff', v)}
                className="cursor-pointer data-checked:!bg-[#463acb] shrink-0"
              />
              <Label className="text-[0.9375rem] text-gray-700 cursor-pointer flex items-center gap-1">
                Multidiff <span className="text-gray-400 text-xs">ℹ</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Colonne 2 — Durées incohérentes */}
        <div className="space-y-4 px-8">
          <div className="flex items-center gap-2 font-medium text-[1.125rem] text-gray-800">
            <Clock className="size-5" />
            Détection de durées incohérentes
          </div>

          <div className="space-y-3">
            <p className="text-[0.9375rem] text-gray-600">Seuils de tolérance</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filtres.toleranceMinutes}
                onChange={e => set('toleranceMinutes', Number(e.target.value))}
                className="w-16 h-9 border border-gray-300 rounded px-2 text-[0.9375rem] text-center"
                min={0}
              />
              <span className="text-[0.9375rem] text-gray-500">minutes</span>
              <Tooltip align="center" width="w-[280px]" label="Exemple : avec une tolérance de 2 minutes, un son de 10 minutes (attendues) déclenchera une alerte pour une durée (livrée) inférieure à 8 minutes ou supérieure à 12 minutes.">
                <Info className="size-4 text-gray-400 shrink-0" />
              </Tooltip>
              <span className="text-[0.9375rem] text-gray-500">et</span>
              <input
                type="number"
                value={filtres.tolerancePct}
                onChange={e => set('tolerancePct', Number(e.target.value))}
                className="w-16 h-9 border border-gray-300 rounded px-2 text-[0.9375rem] text-center"
                min={0}
                max={100}
              />
              <span className="text-[0.9375rem] text-gray-500">%</span>
              <Tooltip align="center" width="w-[280px]" label="Exemple : avec une tolérance de 10%, un son de 10 minutes (attendues) déclenchera une alerte pour une durée (livrée) inférieure à 9 minutes ou supérieure à 11 minutes.">
                <Info className="size-4 text-gray-400 shrink-0" />
              </Tooltip>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <p className="text-[0.9375rem] text-gray-600 flex items-center gap-1">
              Personnaliser la tolérance d&apos;une émission
              <Tooltip align="center" width="w-[280px]" label="Vous pouvez affiner la détection des durées incohérentes pour une ou plusieurs émissions en particulier.">
                <Info className="size-4 text-gray-400 shrink-0" />
              </Tooltip>
            </p>
            <span className="text-[0.9375rem] text-[#463acb] cursor-pointer hover:underline">+ Ajouter une émission</span>
          </div>
        </div>

        {/* Colonne 3 — Jours affichés */}
        <div className="space-y-4 px-8">
          <div className="flex items-center gap-2 font-medium text-[1.125rem] text-gray-800">
            <Calendar className="size-5" />
            Jours affichés
          </div>

          <div className="flex items-start gap-6">
            <div className="space-y-1.5">
              <p className="text-[0.9375rem] text-gray-600">Passés</p>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={filtres.joursPassés}
                  onChange={e => set('joursPassés', Number(e.target.value))}
                  className="w-14 h-8 border border-gray-300 rounded px-2 text-[0.9375rem] text-center"
                  min={0}
                />
                <span className="text-[0.9375rem] text-gray-500">jours</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[0.9375rem] text-gray-600">Futurs</p>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={filtres.joursFuturs}
                  onChange={e => set('joursFuturs', Number(e.target.value))}
                  className="w-14 h-8 border border-gray-300 rounded px-2 text-[0.9375rem] text-center"
                  min={0}
                />
                <span className="text-[0.9375rem] text-gray-500">jours</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
            <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[0.875rem] text-blue-700 leading-snug">
              Le chargement des résultats peut prendre plus de temps au-delà de X jours affichés.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center py-7 bg-[#f5f5f9] rounded-b-xl">
        <button
          onClick={onActualiser}
          className={BTN_PRIMARY}
        >
          Actualiser
        </button>
      </div>
    </div>
  )
}
