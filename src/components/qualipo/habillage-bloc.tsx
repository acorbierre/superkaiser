import { useState } from 'react'
import { GripVertical, Trash2, Plus, X, Pencil, Check } from 'lucide-react'
import { ItemTitle } from '@/components/ui/item-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { InfoMessage } from '@/components/ui/info-message'
import { CARD, LINK, BTN_PRIMARY } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'

const SONS_MOCK = [
  'Xavier Mauduit - Intro Promo (7s)',
  'Écoute série complète (11s)',
  'Générique court (4s)',
  'Intro musique (10s)',
  'Abonnez-vous (8s)',
]

interface RollItem { id: number; son: string; interne: boolean; externe: boolean }

export function HabillageSection({ titre, isEpisode = false, episodeTitre, emissionTitre, ruleLabel, cardless = false, onRemoveSection }: {
  titre: string
  isEpisode?: boolean
  episodeTitre?: string
  emissionTitre?: string
  ruleLabel?: string
  cardless?: boolean
  onRemoveSection?: () => void
}) {
  const { navigate } = useNavigation()
  const defaultSon = titre === 'Habillage Pré-roll' || titre === 'Pré-roll' ? SONS_MOCK[0] : SONS_MOCK[1]
  const [items, setItems] = useState<RollItem[]>([{ id: 1, son: defaultSon, interne: true, externe: true }])
  const [isModified, setIsModified] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [snapshot, setSnapshot] = useState<RollItem[]>([])

  function enterEditMode() {
    setSnapshot(items.map(i => ({ ...i })))
    setIsEditing(true)
  }

  function validateEdit() {
    setIsModified(true)
    setIsEditing(false)
  }

  function cancelEdit() {
    setItems(snapshot)
    setIsEditing(false)
  }

  function addItem() {
    setItems(prev => [...prev, { id: Date.now(), son: SONS_MOCK[0], interne: true, externe: true }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function updateItem(id: number, field: string, value: string | boolean) {
    setItems(prev => prev.map(i => i.id !== id ? i : { ...i, [field]: value }))
  }

  const addLabel = titre === 'Habillage Pré-roll' || titre === 'Pré-roll'
    ? 'Ajouter un pré-roll'
    : 'Ajouter un post-roll'

  const ruleLink = ruleLabel ? (
    <button
      onClick={() => navigate('HabillageDetail', { titre: emissionTitre ?? '', type: 'emission' })}
      className="font-semibold hover:underline cursor-pointer"
    >
      règle émission du {ruleLabel}
    </button>
  ) : null

  const inner = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <ItemTitle>{titre}</ItemTitle>
          {ruleLabel && (
            isModified ? (
              <div className="mt-2">
                <InfoMessage>Cet épisode a été personnalisé. Voir la {ruleLink}.</InfoMessage>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1.5">Hérité de la {ruleLink}.</p>
            )
          )}
        </div>
        {cardless && onRemoveSection && (
          <button
            onClick={onRemoveSection}
            title="Retirer le post-roll"
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400 shrink-0"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {isEpisode ? (
        <>
          <p className="text-[1rem] text-gray-800">
            {episodeTitre ?? '—'}{' '}
            <span className="text-gray-400 text-sm">(13m00s)</span>
          </p>
          <AudioPlayer compact noBg dureeLabel="00:13:00" />
        </>
      ) : (
        <>
          <div className="flex flex-col">
            {items.map((item, index, arr) => (
              <div key={item.id} className={`flex gap-3 items-start pb-4${index > 0 && arr.length > 1 ? ' border-t border-gray-200 pt-6' : ' pt-3'}`}>

                {isEditing ? (
                  <>
                    <GripVertical className="size-4 text-gray-400 shrink-0 mt-2.5 cursor-grab" />
                    <div className="flex-1 flex flex-col gap-2">
                      <SelectField value={item.son} onChange={val => updateItem(item.id, 'son', val)}>
                        {SONS_MOCK.map(s => <option key={s} value={s}>{s}</option>)}
                      </SelectField>
                      <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <Switch checked={item.interne} onCheckedChange={val => updateItem(item.id, 'interne', val)} />
                        <span className="text-sm text-gray-700">Interne</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <Switch checked={item.externe} onCheckedChange={val => updateItem(item.id, 'externe', val)} />
                        <span className="text-sm text-gray-700">Externe</span>
                      </label>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer transition-colors text-gray-400 hover:text-red-400 shrink-0 mt-0.5"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[15px] text-gray-900">{item.son}</p>
                      <div className="flex items-center gap-3 shrink-0">
                        {(['interne', 'externe'] as const).map(canal => {
                          const on = item[canal]
                          return (
                            <span key={canal} className={`flex items-center gap-1 text-sm ${on ? 'text-gray-700' : 'text-gray-300'}`}>
                              {on
                                ? <Check className="size-3.5 text-blue-rf" strokeWidth={2.5} />
                                : <X className="size-3.5" strokeWidth={2.5} />
                              }
                              {canal.charAt(0).toUpperCase() + canal.slice(1)}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                  </div>
                )}

              </div>
            ))}
            {isEditing && (
              <button onClick={addItem} className={`${LINK} mt-1`}>
                <Plus className="size-4" />
                {addLabel}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={validateEdit} className={BTN_PRIMARY}>Valider</button>
                <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">Annuler</button>
              </>
            ) : (
              <button onClick={enterEditMode} className={`${BTN_PRIMARY} flex items-center gap-1.5`}>
                <Pencil className="size-3.5" />
                Modifier
              </button>
            )}
          </div>
        </>
      )}
    </>
  )

  if (cardless) return <div className="flex flex-col gap-4">{inner}</div>
  return <div className={`${CARD} flex flex-col gap-4${isEditing ? ' ring-2 ring-blue-rf/25' : ''}`}>{inner}</div>
}

export function HabillageBloc({ emissionTitre, ruleLabel }: {
  emissionTitre?: string
  ruleLabel?: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <HabillageSection titre="Habillage Pré-roll" emissionTitre={emissionTitre} ruleLabel={ruleLabel} />
      <HabillageSection titre="Habillage Post-roll" emissionTitre={emissionTitre} ruleLabel={ruleLabel} />
    </div>
  )
}
