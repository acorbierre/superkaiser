import { ArrowRightToLine, ArrowRightFromLine, Mic } from 'lucide-react'
import { CardTitle } from '@/components/ui/card-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { INPUT, LABEL } from '@/lib/styles'
import { cn } from '@/lib/utils'

interface HabillageBlockProps {
  titre?: string
  showEpisode?: boolean
}

function Separator() {
  return <div className="h-px bg-blue-rf/20" />
}

export function HabillageBloc({ titre, showEpisode = true }: HabillageBlockProps) {
  return (
    <>
      <CardTitle>Habillage</CardTitle>
      <div className="mt-5 flex flex-col">

        {/* Pré-roll */}
        <div className="flex flex-col gap-4 py-6">
          <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightToLine className="size-4" />Pré-roll</span>}>
            <option>Xavier Mauduit - Intro Promo</option>
          </SelectField>
          <AudioPlayer compact noBg dureeLabel="00:00:11" />
          <div className="flex flex-col gap-2">
            <label className={LABEL}>Canaux de distribution</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Interne</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Externe</span>
              </label>
            </div>
          </div>
          {!showEpisode && (
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL}>Du</label>
                <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-01" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL}>Au</label>
                <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-30" />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Épisode */}
        {showEpisode && (
          <div className="flex flex-col gap-4 py-6">
            <div className="flex flex-col gap-1">
              <label className={`${LABEL} flex items-center gap-1.5`}><Mic className="size-4" />Épisode</label>
              <div className="h-10 flex items-center justify-between px-3 rounded border border-gray-200 bg-white text-[1rem] text-gray-700">
                <span className="truncate">{titre ?? '—'}</span>
                <span className="text-sm text-gray-400 ml-2 shrink-0">13:00</span>
              </div>
            </div>
            <AudioPlayer compact noBg dureeLabel="00:13:00" />
          </div>
        )}

        {showEpisode && <Separator />}

        {/* Post-roll */}
        <div className="flex flex-col gap-4 py-6">
          <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightFromLine className="size-4" />Post-roll</span>}>
            <option>Écoute série complète</option>
          </SelectField>
          <AudioPlayer compact noBg dureeLabel="00:00:11" />
          <div className="flex flex-col gap-2">
            <label className={LABEL}>Canaux de distribution</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Interne</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Externe</span>
              </label>
            </div>
          </div>
          {!showEpisode && (
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL}>Du</label>
                <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-01" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL}>Au</label>
                <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-30" />
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
