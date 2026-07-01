import { ItemTitle } from '@/components/ui/item-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, INPUT, LABEL } from '@/lib/styles'
import { cn } from '@/lib/utils'

interface HabillageBlockProps {
  showEpisode?: boolean
}

function HabillageSection({ titre, showEpisode, isEpisode = false, episodeTitre }: {
  titre: string
  showEpisode: boolean
  isEpisode?: boolean
  episodeTitre?: string
}) {
  return (
    <div className={`${CARD} flex flex-col gap-4`}>
      <ItemTitle>{titre}</ItemTitle>

      {/* Son */}
      {isEpisode ? (
        <>
          <p className="text-[1rem] text-gray-800">
            {episodeTitre ?? '—'}{' '}
            <span className="text-gray-400 text-sm">(13m00s)</span>
          </p>
          <AudioPlayer compact noBg dureeLabel="00:13:00" />
        </>
      ) : (
        <div className="flex gap-8 items-start">
          {/* Col 1 : son */}
          <div className="flex-[3] flex flex-col gap-3">
            <SelectField>
              <option>{titre === 'Habillage Pré-roll' ? 'Xavier Mauduit - Intro Promo (7s)' : 'Écoute série complète (11s)'}</option>
            </SelectField>
            <AudioPlayer compact noBg noDurations dureeLabel="00:00:11" />
          </div>
          <div className="w-px bg-gray-200 self-stretch shrink-0" />
          {/* Col 2 : canaux */}
          <div className="flex-[2] flex flex-col gap-1">
            <label className={LABEL}>Canaux de distribution</label>
            <div className="flex items-center gap-6 h-10">
              <label className="flex items-center gap-1 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Interne</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <Switch defaultChecked />
                <span className="text-sm text-gray-700">Externe</span>
              </label>
            </div>
            {!showEpisode && (
              <div className="flex gap-2 items-end mt-2" style={{ display: 'none' }}>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label className={LABEL}>Du</label>
                  <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-01" />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label className={LABEL}>Au</label>
                  <input type="date" className={cn(INPUT, 'w-full')} defaultValue="2025-06-30" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export function HabillageBloc({ showEpisode = true }: HabillageBlockProps) {
  return (
    <div className="flex flex-col gap-4">

      <HabillageSection titre="Habillage Pré-roll" showEpisode={showEpisode} />

      <HabillageSection titre="Habillage Post-roll" showEpisode={showEpisode} />

    </div>
  )
}
