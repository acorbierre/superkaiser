import { Check, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { ROLL_PILL, LABEL, INPUT } from '@/lib/styles'
import type { RollConfig } from '@/data/regles-store'

// ── Canaux (interne / externe) — lecture seule ──────────────────────────────────

export function CanauxBadges({ interne, externe }: { interne: boolean; externe: boolean }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {(['interne', 'externe'] as const).map(canal => {
        const on = canal === 'interne' ? interne : externe
        return (
          <span key={canal} className={`flex items-center gap-1 text-sm ${on ? 'text-gray-700' : 'text-gray-300'}`}>
            {on
              ? <Check className="size-3.5 text-blue-rf" strokeWidth={2.5} />
              : <X className="size-3.5 text-gray-300" strokeWidth={2.5} />
            }
            {canal.charAt(0).toUpperCase() + canal.slice(1)}
          </span>
        )
      })}
    </div>
  )
}

// ── Canaux (interne / externe) — édition ────────────────────────────────────────

export function CanauxToggle({
  interne, onInterneChange, externe, onExterneChange,
}: {
  interne: boolean
  onInterneChange: (v: boolean) => void
  externe: boolean
  onExterneChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-5">
      <label className="flex items-center gap-2 cursor-pointer">
        <Switch checked={interne} onCheckedChange={onInterneChange} />
        <span className="text-[15px] text-gray-700">Interne</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <Switch checked={externe} onCheckedChange={onExterneChange} />
        <span className="text-[15px] text-gray-700">Externe</span>
      </label>
    </div>
  )
}

// ── Pré/Post-roll — lecture seule ────────────────────────────────────────────────

export function RollPairReadOnly({ config }: { config: RollConfig }) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      <div className="flex flex-col gap-2">
        <span className={ROLL_PILL}>Pré-roll</span>
        {config.preroll
          ? <>
              <p className="text-[15px] text-gray-900">{config.preroll}</p>
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </>
          : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
        }
      </div>
      <div className="flex flex-col gap-2">
        <span className={ROLL_PILL}>Post-roll</span>
        {config.postroll
          ? <>
              <p className="text-[15px] text-gray-900">{config.postroll}</p>
              <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
            </>
          : <p className="text-sm text-gray-400 italic">Aucun habillage</p>
        }
      </div>
    </div>
  )
}

// ── Nom de la règle — édition ────────────────────────────────────────────────────

export function NomRegleField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL}>Nom de la règle (facultatif)</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ex : Habillage spécial été"
        className={`${INPUT} w-full max-w-md`}
      />
    </div>
  )
}
