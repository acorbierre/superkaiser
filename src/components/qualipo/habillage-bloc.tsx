import { ArrowRightToLine, ArrowRightFromLine, Mic } from 'lucide-react'
import { CardTitle } from '@/components/ui/card-title'
import { SelectField } from '@/components/ui/select-field'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD_BLUE, LABEL } from '@/lib/styles'

interface HabillageBlockProps {
  titre?: string
  showEpisode?: boolean
}

export function HabillageBloc({ titre, showEpisode = true }: HabillageBlockProps) {
  return (
    <>
      <CardTitle className="text-gray-900 mt-8">Habillage</CardTitle>
      <div className={`${CARD_BLUE} mt-4`}>
        <div className={`grid gap-6 ${showEpisode ? 'grid-cols-3' : 'grid-cols-2'}`}>

          <div className="flex flex-col gap-2">
            <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightToLine className="size-3.5" />Pré-roll</span>}>
              <option>Xavier Mauduit - Intro Promo</option>
            </SelectField>
            <AudioPlayer compact noBg dureeLabel="00:00:11" />
          </div>

          {showEpisode && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className={`${LABEL} flex items-center gap-1.5`}><Mic className="size-3.5" />Épisode</label>
                <div className="h-10 flex items-center justify-between px-3 rounded bg-blue-rf/10 text-[1rem] text-[#444]">
                  <span className="truncate">{titre ?? '—'}</span>
                  <span className="flex-1 text-right text-sm text-[#444] ml-2">(13:00)</span>
                </div>
              </div>
              <AudioPlayer compact noBg dureeLabel="00:13:00" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <SelectField label={<span className="flex items-center gap-1.5"><ArrowRightFromLine className="size-3.5" />Post-roll</span>}>
              <option>Écoute série complète</option>
            </SelectField>
            <AudioPlayer compact noBg dureeLabel="00:00:11" />
          </div>

        </div>
      </div>
    </>
  )
}
