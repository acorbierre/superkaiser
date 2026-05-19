import { useState } from 'react'
import { X, Copy, RefreshCw, ExternalLink, Check, Headphones, ChevronDown, ChevronUp } from 'lucide-react'
import type { Son, StatutSon } from '@/data/sons'
import { BTN_PRIMARY, BTN_SECONDARY, LINK, CARD } from '@/lib/styles'
import AudioPlayer from './audio-player'

// ─── Timeline ────────────────────────────────────────────────────────────────

type StepState = 'done' | 'error' | 'pending'

function getStepState(statut: StatutSon, index: number): StepState {
  if (statut === 'attente') return 'pending'
  if (statut === 'non_disponible') return index === 0 ? 'error' : 'pending'
  return 'done'
}

function StepIndicator({ state }: { state: StepState }) {
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

const STEPS = [
  { label: 'Livraison du son',          subtitle: 'Itéma' },
  { label: 'Traitement numérique',       subtitle: 'ENCOM' },
  { label: 'Distribution sur les canaux', subtitle: '' },
]

// ─── Étape 2 : Traitement numérique ──────────────────────────────────────────

interface Format {
  codec: string
  duree: string
  droits: string
}

interface Manifestation {
  label: string
  count: number
  duree: string
  formats: Format[]
}

const MANIFESTATIONS: Manifestation[] = [
  {
    label: 'AOD',
    count: 2,
    duree: '00:13:00',
    formats: [
      { codec: 'AAC 27', duree: '52 min 13 s', droits: "Droits jusqu'au 29/06/2026" },
      { codec: 'MP3 22', duree: '52 min 13 s', droits: "Droits jusqu'au 29/06/2026" },
    ],
  },
  {
    label: 'Podcast',
    count: 2,
    duree: '00:13:00',
    formats: [
      { codec: 'AAC 27', duree: '52 min 13 s', droits: "Droits jusqu'au 29/06/2026" },
      { codec: 'MP3 22', duree: '52 min 13 s', droits: "Droits jusqu'au 29/06/2026" },
    ],
  },
]

function AccordionItem({ label, count, duree, formats }: Manifestation) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#eef0ff] hover:bg-[#e6e9ff] transition-colors cursor-pointer"
      >
        <div className="size-6 rounded-full bg-[#25bc95] flex items-center justify-center shrink-0">
          <Check className="size-3.5 text-white" strokeWidth={3} />
        </div>
        <span className="text-[15px] font-semibold text-[#333] flex-1 text-left">{label} ({count})</span>
        {open ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
      </button>
      {open && (
        <div className="bg-[#eef0ff] px-4 pb-4 space-y-3">
          <AudioPlayer compact dureeLabel={duree} />
          <div className="divide-y divide-gray-200/60">
            {formats.map(f => (
              <div key={f.codec} className="flex items-center gap-4 py-2.5 text-[15px]">
                <span className="font-bold text-[#333] w-16 shrink-0">{f.codec}</span>
                <span className="text-gray-500">{f.duree}</span>
                <span className="text-gray-500 ml-auto">{f.droits}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TraitementCard() {
  return (
    <div className={CARD}>
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="size-5 text-[#333]" />
        <span className="text-[15px] font-semibold text-[#333]">4 manifestations</span>
      </div>
      <div className="space-y-2">
        {MANIFESTATIONS.map(m => <AccordionItem key={m.label} {...m} />)}
      </div>
    </div>
  )
}

// ─── Étape 3 : Distribution sur les canaux ────────────────────────────────────

function GreenCheck() {
  return (
    <div className="size-6 rounded-full bg-[#25bc95] flex items-center justify-center shrink-0">
      <Check className="size-3.5 text-white" strokeWidth={3} />
    </div>
  )
}

function DistributionCard({ emission }: { emission: string }) {
  return (
    <div className="space-y-3">
      <div className={CARD}>
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <GreenCheck />
            <span className={LINK}>Site web <ExternalLink className="size-3.5" /></span>
          </div>
          <div className="flex items-center gap-2.5">
            <GreenCheck />
            <span className="text-[15px] text-[#333]">Application Radio France</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <GreenCheck />
              <span className="text-[15px] text-[#333]">RSS</span>
            </div>
            <div className="pl-8 space-y-1.5">
              <div>
                <span className={LINK}>{emission} – Bouquet <ExternalLink className="size-3.5" /></span>
              </div>
              <div className="flex items-center gap-4">
                <span className={LINK}>Apple <ExternalLink className="size-3.5" /></span>
                <span className={LINK}>Spotify <ExternalLink className="size-3.5" /></span>
                <span className={LINK}>Deezer <ExternalLink className="size-3.5" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={CARD}>
        <p className="text-[15px] font-bold text-[#333] mb-3">Podcasts secondaires</p>
        <div className="space-y-2">
          {['Best of Rap', '20 ans de rap en France'].map(label => (
            <div key={label} className="flex items-center gap-4 text-[15px]">
              <span className="text-[#333] shrink-0">{label}</span>
              <span className={LINK}>Superkaiser <ExternalLink className="size-3.5" /></span>
              <span className={LINK}>Atlas <ExternalLink className="size-3.5" /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Modale de confirmation ───────────────────────────────────────────────────

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
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

// ─── Composant principal ──────────────────────────────────────────────────────

interface Props {
  son: Son
  onClose: () => void
}

export default function SidePanel({ son, onClose }: Props) {
  const [conservedFichier, setConservedFichier] = useState<string | null>(null)
  const [confirmingFichier, setConfirmingFichier] = useState<string | null>(null)

  const doublons = [
    { fichier: `PAD NET_MFO_${son.numeroMagnetotheque}_A`, duree: son.dureeReelle ?? '00:13:00' },
    { fichier: `PAD NET_MFO_${son.numeroMagnetotheque}_B`, duree: '00:11:42' },
  ]

  function effectiveStepState(statut: StatutSon, index: number): StepState {
    if (statut === 'non_disponible' && index === 0 && conservedFichier) return 'done'
    return getStepState(statut, index)
  }

  return (
    <>
      {confirmingFichier && (
        <ConfirmModal
          onConfirm={() => { setConservedFichier(confirmingFichier); setConfirmingFichier(null) }}
          onCancel={() => setConfirmingFichier(null)}
        />
      )}

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[75px] right-0 h-[calc(100%-75px)] w-[640px] bg-[#fbfaff] z-50 flex flex-col shadow-[-8px_0_40px_rgba(0,0,0,0.1)]">

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 z-10 p-1.5 rounded-[6px] hover:bg-black/5 transition-colors cursor-pointer text-gray-500"
        >
          <X className="size-5" />
        </button>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-10 pt-6 pb-10 space-y-8">

          {/* ── Section Diffusion ── */}
          <section>
            <h3 className="text-[1.125rem] font-bold text-[#333] mb-3">Diffusion</h3>
            <div className={CARD}>
              <div className="space-y-4">
                <div>
                  <p className="text-[15px] text-[#333] font-semibold leading-snug">{son.detail.titreComplet}</p>
                  <p className="text-[13px] text-gray-400 mt-0.5">
                    Diffusé le {son.detail.diffuseAt} · Publié le {son.detail.publiAt}
                  </p>
                </div>
                <div className="space-y-1.5 text-[15px] text-[#333]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">N° Magnétothèque :</span>
                    <span className="text-gray-500">{son.numeroMagnetotheque}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(son.numeroMagnetotheque)}
                      className="text-gray-400 hover:text-[#333] transition-colors cursor-pointer"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Programme :</span>
                    <span className="text-gray-500">{son.emission} (BR : 10001)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Podcast principal :</span>
                    <span className={LINK}>
                      {son.emission}
                      <ExternalLink className="size-3.5" />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-1 flex-wrap">
                  <button className={BTN_PRIMARY}>
                    <RefreshCw className="size-4" />
                    Republier
                  </button>
                  <span className={LINK}>Superkaiser <ExternalLink className="size-3.5" /></span>
                  <span className={LINK}>Replay <ExternalLink className="size-3.5" /></span>
                  <span className={LINK}>Itéma <ExternalLink className="size-3.5" /></span>
                  <span className={LINK}>Atlas <ExternalLink className="size-3.5" /></span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section Chemin du son ── */}
          <section>
            <h3 className="text-[1.125rem] font-bold text-[#333] mb-4">Chemin du son</h3>
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const state = effectiveStepState(son.statut, i)
                const isDone = state === 'done'
                const isError = state === 'error'
                const isPending = state === 'pending'
                const isLast = i === STEPS.length - 1

                return (
                  <div key={step.label} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <StepIndicator state={state} />
                      {!isLast && (
                        <div className={`w-[2px] flex-1 min-h-[24px] ${isDone ? 'bg-[#25bc95]' : 'bg-gray-200'}`} />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex items-baseline gap-1.5 mb-3 mt-0.5">
                        <span className={`font-semibold text-[15px] ${isPending ? 'text-gray-400' : 'text-[#333]'}`}>
                          {step.label}
                        </span>
                        {step.subtitle && (
                          <span className={`text-[13px] ${isPending ? 'text-gray-300' : 'text-gray-400'}`}>
                            ({step.subtitle})
                          </span>
                        )}
                      </div>

                      {(isDone || isError) && (
                        isError ? (
                          /* ── Vue doublon non résolu ── */
                          <div className="space-y-3">
                            <div className="rounded-xl border border-red-200 p-4 text-[14px]" style={{ backgroundColor: '#ffe2e2' }}>
                              <p className="text-red-600">
                                Deux sons ou plus ont été livrés. Choisissez le son à conserver : l'épisode sera republié et les autres sons seront automatiquement désactivés.
                              </p>
                            </div>
                            {doublons.map(d => (
                              <AudioPlayer
                                key={d.fichier}
                                fichier={d.fichier}
                                dureeLabel={d.duree}
                                onConserver={() => setConfirmingFichier(d.fichier)}
                              />
                            ))}
                          </div>
                        ) : i === 0 && conservedFichier ? (
                          /* ── Vue doublon résolu ── */
                          <div className="space-y-3">
                            <AudioPlayer
                              fichier={conservedFichier}
                              dureeLabel={doublons.find(d => d.fichier === conservedFichier)?.duree}
                            />
                            <div className="rounded-xl bg-[#eeeeff] border border-[#463acb]/20 px-5 py-4 text-[14px] text-[#463acb] leading-snug">
                              Les sons ci-dessous ne sont plus accessibles dans Qualipo mais peuvent être réactivés à partir d'<span className="underline cursor-pointer">Itema</span>.
                            </div>
                            {doublons.filter(d => d.fichier !== conservedFichier).map(d => (
                              <div key={d.fichier} className="rounded-xl bg-gray-100 px-6 py-4 text-[14px] text-gray-400 flex items-center gap-3">
                                <span className="flex-1 break-all">{d.fichier}</span>
                                <span className="shrink-0">({d.duree})</span>
                              </div>
                            ))}
                          </div>
                        ) : i === 0 ? (
                          /* ── Vue normale étape 1 ── */
                          <AudioPlayer
                            fichier={`PAD NET_MFO_${son.numeroMagnetotheque}`}
                            dureeLabel={son.dureeReelle ?? '00:13:00'}
                          />
                        ) : i === 1 ? (
                          /* ── Étape 2 ── */
                          <TraitementCard />
                        ) : (
                          /* ── Étape 3 ── */
                          <DistributionCard emission={son.emission} />
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
