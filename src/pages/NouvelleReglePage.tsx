import { useState, useMemo } from 'react'
import { ArrowLeft, Calendar, List } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { ItemTitle } from '@/components/ui/item-title'
import { SectionTitle } from '@/components/ui/section-title'
import { SelectField } from '@/components/ui/select-field'
import { Switch } from '@/components/ui/switch'
import AudioPlayer from '@/components/qualipo/audio-player'
import { CARD, LINK, INPUT, BTN_PRIMARY, LABEL } from '@/lib/styles'
import { useNavigation } from '@/contexts/navigation-context'
import { sons } from '@/data/sons'
import { STATION } from '@/data/constants'
import {
  getRegleById, addRegle, updateRegle,
  mockEpisodeCount, formatDateFr,
  SONS_PREROLL, SONS_POSTROLL,
  JOURS, JOURS_LABELS, JOURS_COURTS, JOURS_SEMAINE, JOURS_WEEKEND,
  MODE_LABELS, EMPTY_CONFIG, defaultConfigJours,
  type ModeTemporalite, type RollConfig, type JourSemaine,
} from '@/data/regles-store'

const EMISSIONS_IMAGES: Record<string, string> = {
  'À voix nue':              '/emissions/sc_a_voix_nue_1400.jpg',
  'Affaires étrangères':     '/emissions/sc_affaires-etrangeres.png',
  'Le cours de l\'histoire': '/emissions/sc_sc_le-cours-de-l-histoire.png',
}

// ── 2 colonnes pré/post-roll avec player ──────────────────────────────────────

function RollPairForm({ config, onChange }: { config: RollConfig; onChange: (c: RollConfig) => void }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <span className={LABEL}>Pré-roll</span>
        <SelectField value={config.preroll} onChange={val => onChange({ ...config, preroll: val })}>
          <option value="">Aucun habillage</option>
          {SONS_PREROLL.map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>
        <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
      </div>
      <div className="flex flex-col gap-2">
        <span className={LABEL}>Post-roll</span>
        <SelectField value={config.postroll} onChange={val => onChange({ ...config, postroll: val })}>
          <option value="">Aucun habillage</option>
          {SONS_POSTROLL.map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>
        <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
      </div>
    </div>
  )
}

// ── Mode alternance ────────────────────────────────────────────────────────────

function AlternanceConfig({
  configPaire, configImpaire, onChangePaire, onChangeImpaire,
}: {
  configPaire: RollConfig
  configImpaire: RollConfig
  onChangePaire: (c: RollConfig) => void
  onChangeImpaire: (c: RollConfig) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Semaines paires</p>
        <RollPairForm config={configPaire} onChange={onChangePaire} />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Semaines impaires</p>
        <RollPairForm config={configImpaire} onChange={onChangeImpaire} />
      </div>
    </div>
  )
}

// ── Mode par jour ──────────────────────────────────────────────────────────────

function ParJourConfig({
  joursActifs, configJours, onChangeJours, onChangeConfig,
}: {
  joursActifs: JourSemaine[]
  configJours: Record<JourSemaine, RollConfig>
  onChangeJours: (jours: JourSemaine[]) => void
  onChangeConfig: (jours: Record<JourSemaine, RollConfig>) => void
}) {
  function toggleJour(jour: JourSemaine) {
    if (joursActifs.includes(jour)) {
      onChangeJours(joursActifs.filter(j => j !== jour))
    } else {
      const next = [...joursActifs, jour].sort((a, b) => JOURS.indexOf(a) - JOURS.indexOf(b))
      onChangeJours(next as JourSemaine[])
    }
  }

  function updateDayConfig(jour: JourSemaine, config: RollConfig) {
    onChangeConfig({ ...configJours, [jour]: config })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Raccourcis */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 shrink-0">Raccourcis :</span>
        <button onClick={() => onChangeJours([...JOURS_SEMAINE])} className="text-blue-rf hover:underline cursor-pointer">Semaine</button>
        <span className="text-gray-300">·</span>
        <button onClick={() => onChangeJours([...JOURS_WEEKEND])} className="text-blue-rf hover:underline cursor-pointer">Weekend</button>
        <span className="text-gray-300">·</span>
        <button onClick={() => onChangeJours([...JOURS] as JourSemaine[])} className="text-blue-rf hover:underline cursor-pointer">Tous</button>
        {joursActifs.length > 0 && (
          <>
            <span className="text-gray-300">·</span>
            <button onClick={() => onChangeJours([])} className="text-gray-400 hover:text-gray-600 cursor-pointer">Effacer</button>
          </>
        )}
      </div>

      {/* Chips */}
      <div className="flex gap-2">
        {(JOURS as JourSemaine[]).map(jour => {
          const active = joursActifs.includes(jour)
          return (
            <button
              key={jour}
              onClick={() => toggleJour(jour)}
              className={`w-10 h-10 rounded-full text-[13px] font-medium cursor-pointer transition-colors ${
                active
                  ? 'bg-blue-rf text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {JOURS_COURTS[jour]}
            </button>
          )
        })}
      </div>

      {/* Blocs par jour actif */}
      {joursActifs.length > 0 && (
        <div className="flex flex-col mt-1">
          {joursActifs.map(jour => {
            const c = configJours[jour]
            return (
              <div key={jour} className="flex flex-col gap-3 py-3 border-b border-gray-100">
                <span className="self-start px-3 py-1 rounded-full bg-gray-100 text-[13px] font-medium text-gray-600">
                  {JOURS_LABELS[jour]}
                </span>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className={LABEL}>Pré-roll</span>
                    <SelectField value={c.preroll} onChange={val => updateDayConfig(jour, { ...c, preroll: val })}>
                      <option value="">Aucun habillage</option>
                      {SONS_PREROLL.map(s => <option key={s} value={s}>{s}</option>)}
                    </SelectField>
                    <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={LABEL}>Post-roll</span>
                    <SelectField value={c.postroll} onChange={val => updateDayConfig(jour, { ...c, postroll: val })}>
                      <option value="">Aucun habillage</option>
                      {SONS_POSTROLL.map(s => <option key={s} value={s}>{s}</option>)}
                    </SelectField>
                    <AudioPlayer compact noBg noDurations dureeLabel="00:00:07" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NouvelleReglePage() {
  const { params, navigate } = useNavigation()
  const { emissionTitre = '', regleId } = params

  const existingRegle = regleId ? getRegleById(emissionTitre, Number(regleId)) : undefined
  const isEditing = !!existingRegle

  const [dateDebut, setDateDebut]         = useState(existingRegle?.dateDebut ?? '')
  const [dateFin, setDateFin]             = useState(existingRegle?.dateFin ?? '')
  const [mode, setMode]                   = useState<ModeTemporalite>(existingRegle?.modeTemporalite ?? 'tous')
  const [interne, setInterne]             = useState(existingRegle?.interne ?? true)
  const [externe, setExterne]             = useState(existingRegle?.externe ?? true)
  const [config, setConfig]               = useState<RollConfig>(existingRegle?.config ?? EMPTY_CONFIG)
  const [configPaire, setConfigPaire]     = useState<RollConfig>(existingRegle?.configPaire ?? EMPTY_CONFIG)
  const [configImpaire, setConfigImpaire] = useState<RollConfig>(existingRegle?.configImpaire ?? EMPTY_CONFIG)
  const [joursActifs, setJoursActifs]     = useState<JourSemaine[]>(existingRegle?.joursActifs ?? [])
  const [configJours, setConfigJours]     = useState<Record<JourSemaine, RollConfig>>(
    existingRegle?.configJours ?? defaultConfigJours()
  )

  const emissionImage = EMISSIONS_IMAGES[emissionTitre] ?? null
  const son = useMemo(() => sons.find(s => s.emission === emissionTitre) ?? null, [emissionTitre])

  function handleValider() {
    const regle = {
      id: existingRegle?.id ?? Date.now(),
      dateDebut, dateFin,
      appliedDateDebut: dateDebut,
      appliedDateFin: dateFin,
      nbEpisodes: mockEpisodeCount(dateDebut, dateFin),
      modeTemporalite: mode,
      interne, externe,
      config,
      configPaire,
      configImpaire,
      joursActifs,
      configJours,
    }
    if (isEditing) {
      updateRegle(emissionTitre, regle)
    } else {
      addRegle(emissionTitre, regle)
    }
    navigate('HabillageDetail', { titre: emissionTitre, type: 'emission' })
  }

  function handleAnnuler() {
    navigate('HabillageDetail', { titre: emissionTitre, type: 'emission' })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1088px] mx-auto px-6 py-8">

        <button
          onClick={handleAnnuler}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 cursor-pointer transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Retour à l'émission
        </button>

        {/* Card émission */}
        <div className={`${CARD} mt-6`}>
          <div className="flex gap-8">
            {emissionImage ? (
              <img src={emissionImage} alt={emissionTitre} className="w-44 shrink-0 aspect-square rounded-lg object-cover" />
            ) : (
              <div className="w-44 shrink-0 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="size-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            )}
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <div className="flex items-center gap-2">
                <img src={STATION.logo} alt={STATION.label} className="size-8 rounded-full object-cover shrink-0" />
                <span className="text-sm font-medium text-gray-600">{STATION.label}</span>
              </div>
              <PageTitle>{emissionTitre || '—'}</PageTitle>
              <span className="self-start px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gray-100 text-gray-600">
                Émission
              </span>
              {son?.detail.programme && (
                <p className="text-sm text-gray-500">BR : {son.detail.programme.match(/BR\s*:\s*(\d+)/)?.[1] ?? '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* 2 colonnes */}
        <div className="grid grid-cols-[1fr_320px] gap-4 mt-4">

          {/* Formulaire */}
          <div>
            <SectionTitle className="mt-4">{isEditing ? 'Modifier la règle' : 'Nouvelle règle'}</SectionTitle>
            <div className={CARD}>

              {/* Titre + interne/externe */}
              <div className="flex items-start justify-between gap-4">
                <ItemTitle>{isEditing
                  ? `${formatDateFr(existingRegle.appliedDateDebut)} → ${formatDateFr(existingRegle.appliedDateFin)}`
                  : 'Nouvelle règle'
                }</ItemTitle>
                <div className="flex gap-5 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={interne} onCheckedChange={setInterne} />
                    <span className="text-[15px] text-gray-700">Interne</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={externe} onCheckedChange={setExterne} />
                    <span className="text-[15px] text-gray-700">Externe</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-6">

                {/* Période */}
                <div className="flex flex-col gap-2">
                  <span className={LABEL}>Période</span>
                  <div className="flex gap-3 items-center">
                    <input
                      type="date"
                      value={dateDebut}
                      onChange={e => setDateDebut(e.target.value)}
                      className={`${INPUT} w-40`}
                      style={!dateDebut ? { color: '#d1d5db' } : undefined}
                    />
                    <span className="text-gray-300">→</span>
                    <input
                      type="date"
                      value={dateFin}
                      onChange={e => setDateFin(e.target.value)}
                      className={`${INPUT} w-40`}
                      style={!dateFin ? { color: '#d1d5db' } : undefined}
                    />
                  </div>
                </div>

                {/* Fréquence */}
                <div className="flex flex-col gap-2">
                  <span className={LABEL}>Fréquence</span>
                  <SelectField
                    value={mode}
                    onChange={val => setMode(val as ModeTemporalite)}
                    className="w-64"
                  >
                    {(Object.entries(MODE_LABELS) as [ModeTemporalite, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </SelectField>
                </div>

                {/* Config habillage selon mode */}
                {mode === 'tous' && (
                  <RollPairForm config={config} onChange={setConfig} />
                )}
                {mode === 'alternance' && (
                  <AlternanceConfig
                    configPaire={configPaire}
                    configImpaire={configImpaire}
                    onChangePaire={setConfigPaire}
                    onChangeImpaire={setConfigImpaire}
                  />
                )}
                {mode === 'parjour' && (
                  <ParJourConfig
                    joursActifs={joursActifs}
                    configJours={configJours}
                    onChangeJours={setJoursActifs}
                    onChangeConfig={setConfigJours}
                  />
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleValider}
                    disabled={!dateDebut || !dateFin}
                    className={`${BTN_PRIMARY} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Valider
                  </button>
                  <button
                    onClick={handleAnnuler}
                    className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    Annuler
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="self-start">
            <SectionTitle className="mt-4">Informations du podcast</SectionTitle>
            <div className={CARD}>
              <ItemTitle>Tous les épisodes</ItemTitle>
              <button onClick={() => navigate('Calendrier', { titre: emissionTitre })} className={`${LINK} mt-3`}>
                <Calendar className="size-4" />Voir le calendrier
              </button>
              <button onClick={() => navigate('ListeEpisodes', { titre: emissionTitre })} className={`${LINK} mt-2`}>
                <List className="size-4" />Voir la liste
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
