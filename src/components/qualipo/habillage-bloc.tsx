import { useState } from 'react'
import { GripVertical, Trash2, Plus } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, LINK } from '@/lib/styles'

const SONS_MOCK = [
  'Xavier Mauduit - Intro Promo (7s)',
  'Écoute série complète (11s)',
  'Générique court (4s)',
  'Intro musique (10s)',
  'Abonnez-vous (8s)',
]

interface RollItem { id: number; son: string }

function HabillageSection({ titre, isEpisode = false, episodeTitre }: {
  titre: string
  isEpisode?: boolean
  episodeTitre?: string
}) {
  const defaultSon = titre === 'Habillage Pré-roll' ? SONS_MOCK[0] : SONS_MOCK[1]
  const [items, setItems] = useState<RollItem[]>([{ id: 1, son: defaultSon }])

  function addItem() {
    setItems(prev => [...prev, { id: Date.now(), son: SONS_MOCK[0] }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className={`${CARD} flex flex-col gap-4`}>
      <ItemTitle>{titre}</ItemTitle>

      {isEpisode ? (
        <>
          <p className="text-[1rem] text-gray-800">
            {episodeTitre ?? '—'}{' '}
            <span className="text-gray-400 text-sm">(13m00s)</span>
          </p>
          <AudioPlayer compact noBg dureeLabel="00:13:00" />
        </>
      ) : (
        <div className="flex flex-col">
          {items.map((item, index, arr) => (
            <div key={item.id} className={`flex gap-10 items-start pb-4${index > 0 && arr.length > 1 ? ' border-t border-gray-200 pt-6' : ' pt-3'}`}>

              {/* Groupe : grip + numéro + son */}
              <div className="flex-1 flex gap-2 items-start">
                <GripVertical className="size-4 text-gray-400 shrink-0 mt-1.5 cursor-grab" />
                <div className="flex-1 flex flex-col gap-2">
                  <SelectField>
                    {SONS_MOCK.map(s => <option key={s}>{s}</option>)}
                  </SelectField>
                  <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                </div>
              </div>

              {/* Canaux de distribution */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Switch defaultChecked />
                  <span className="text-sm text-gray-700">Interne</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Switch defaultChecked />
                  <span className="text-sm text-gray-700">Externe</span>
                </label>
              </div>

              {/* Trash */}
              <button
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400 shrink-0 mt-0.5"
              >
                <Trash2 className="size-3.5" />
              </button>

            </div>
          ))}
          <button onClick={addItem} className={`${LINK} text-sm mt-1`}>
            <Plus className="size-4" />
            {titre === 'Habillage Pré-roll' ? 'Ajouter un pré-roll' : 'Ajouter un post-roll'}
          </button>
        </div>
      )}

    </div>
  )
}

export function HabillageBloc() {
  return (
    <div className="flex flex-col gap-4">
      <HabillageSection titre="Habillage Pré-roll" />
      <HabillageSection titre="Habillage Post-roll" />
    </div>
  )
}
