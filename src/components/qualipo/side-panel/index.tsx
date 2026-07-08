import { useState } from 'react'
import { X, Copy, RefreshCw, ExternalLink } from 'lucide-react'
import type { Son, StatutSon } from '@/data/sons'
import { BTN_PRIMARY, CARD, LINK } from '@/lib/styles'
import AudioPlayer from '@/components/qualipo/audio-player'
import { StepIndicator, STEPS, getStepState, type StepState } from './step-indicator'
import { TraitementCard } from './traitement-card'
import { DistributionCard } from './distribution-card'
import { ConfirmModal } from './confirm-modal'

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
      <div className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[75px] right-0 h-[calc(100%-75px)] w-[640px] bg-[#fbfaff] z-50 flex flex-col shadow-[-8px_0_40px_rgba(0,0,0,0.1)] animate-in fade-in duration-200">

        <button
          onClick={onClose}
          className="absolute top-4 right-6 z-10 p-1.5 rounded-[6px] hover:bg-black/5 transition-colors cursor-pointer text-gray-500"
        >
          <X className="size-5" />
        </button>

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
                const isDone    = state === 'done'
                const isError   = state === 'error'
                const isPending = state === 'pending'
                const isLast    = i === STEPS.length - 1

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
                        isError && son.statut !== 'droits_fermes' ? (
                          /* ── Vue doublon non résolu ── */
                          <div className="space-y-3">
                            <div className="rounded-lg border border-red-200 bg-[#ffe2e2] p-4 text-[14px]">
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
                              Les sons ci-dessous ne sont plus accessibles dans Qualipo mais peuvent être réactivés à partir d&apos;<span className="underline cursor-pointer">Itema</span>.
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
                          <div className="space-y-3">
                            {son.statut === 'droits_fermes' && (
                              <div className="rounded-lg border border-red-200 bg-[#ffe2e2] p-4 text-[14px]">
                                <p className="text-red-600">Le son ne peut être diffusé car les droits doivent être modifiés dans Itema.</p>
                              </div>
                            )}
                            <TraitementCard hasError={son.statut === 'droits_fermes'} />
                          </div>
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
