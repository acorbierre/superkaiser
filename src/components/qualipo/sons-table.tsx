
import { useState, useCallback } from 'react'
import { Check, Clock, Copy, ExternalLink, TriangleAlert, X } from 'lucide-react'
import type { Son, StatutSon } from '@/data/sons'
import type { FiltresState } from './filtres-panel'
import { LINK } from '@/lib/styles'
import { Tooltip } from '@/components/ui/tooltip'

// ─── Styles factorisés ────────────────────────────────────────────────────────
const ROW_BODY  = 'h-[60px]'
const ROW_HEAD  = 'h-[40px]'
const TH        = 'px-3 text-left text-[0.875rem] font-medium text-gray-500'
const TD        = 'px-3 text-[15px] font-normal text-[#333] align-middle group-hover:bg-black/[0.04] transition-colors duration-200'
const LINK_BOLD = `${LINK} font-medium`

const BG: Record<StatutSon, string> = {
  livre:             'bg-[#CFECD5]',
  livre_avance:      'bg-[#CFECD5]',
  attente:           'bg-white',
  duree_incoherente: 'bg-[#FFF2C6]',
  non_disponible:    'bg-[#FFB2B7]',
  droits_fermes:     'bg-[#FFB2B7]',
  mid_non_conforme:  'bg-[#FFB2B7]',
}

const BORDER: Record<StatutSon, string> = {
  livre:             'border-[#98d3ac]',
  livre_avance:      'border-[#98d3ac]',
  attente:           'border-black/5',
  duree_incoherente: 'border-[#e8c79d]',
  non_disponible:    'border-[#ea9797]',
  droits_fermes:     'border-[#ea9797]',
  mid_non_conforme:  'border-[#ea9797]',
}

interface Props {
  sons: Son[]
  filtres: FiltresState
  recherche: string
  onSelectSon?: (son: Son) => void
  loading?: boolean
}

function StatutCell({ son }: { son: Son }) {
  switch (son.statut) {
    case 'livre':
    case 'livre_avance':
      return <span className="flex items-center gap-1.5"><Check className="size-4 shrink-0 text-[#25bc95]" />Livré</span>
    case 'non_disponible':
      return <span className="flex items-center gap-1.5"><X className="size-4 shrink-0 text-red-500" />Non disponible : plusieurs sons livrés</span>
    case 'droits_fermes':
      return <span className="flex items-center gap-1.5"><X className="size-4 shrink-0 text-red-500" />Non disponible : droits fermés</span>
    case 'mid_non_conforme':
      return <span className="flex items-center gap-1.5"><X className="size-4 shrink-0 text-red-500" />Non disponible : MID non conforme</span>
    case 'attente':
      return <span className="flex items-center gap-1.5"><Clock className="size-4 shrink-0 text-gray-500" />{son.minutesRestantes != null ? `Fin dans ${son.minutesRestantes} min` : 'En attente'}</span>
    case 'duree_incoherente':
      return <span className="flex items-center gap-1.5"><TriangleAlert className="size-4 shrink-0 text-[#d36d27]" />{son.dureeAttendue && son.dureeReelle ? `Attendu : ${son.dureeAttendue} — Livré : ${son.dureeReelle}` : 'Durée incohérente'}</span>
  }
}

function matchesFiltres(son: Son, f: FiltresState, recherche: string): boolean {
  if (recherche && !son.emission.toLowerCase().includes(recherche.toLowerCase())) return false
  if (son.badge === 'NATIO'     && !f.natio)              return false
  if (son.badge === 'MULTIDIFF' && !f.multidiff)          return false
  if (son.statut === 'livre'             && !f.livresDiffuses)    return false
  if (son.statut === 'livre_avance'      && !f.livresEnAvance)    return false
  if (son.statut === 'attente'           && !f.enAttente)         return false
  if (son.statut === 'duree_incoherente' && !f.dureesIncoherentes) return false
  if (son.statut === 'non_disponible'    && !f.nonDisponibles)    return false
  if (son.statut === 'droits_fermes'     && !f.nonDisponibles)    return false
  if (son.statut === 'mid_non_conforme'  && !f.nonDisponibles)    return false
  return true
}

export default function SonsTable({ sons, filtres, recherche, onSelectSon, loading }: Props) {
  const [overridden, setOverridden] = useState<Set<string>>(new Set())
  const [sortAsc, setSortAsc] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = useCallback((e: React.MouseEvent, son: Son) => {
    e.stopPropagation()
    navigator.clipboard.writeText(son.numeroMagnetotheque)
    setCopiedId(son.id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  function parseTime(t: string): number {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  function toggleOverride(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setOverridden(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function effectiveStatut(son: Son): StatutSon {
    return son.statut === 'duree_incoherente' && overridden.has(son.id) ? 'livre' : son.statut
  }

  const filtered = sons
    .filter(s => matchesFiltres(s, filtres, recherche))
    .sort((a, b) => sortAsc
      ? parseTime(a.debut) - parseTime(b.debut)
      : parseTime(b.debut) - parseTime(a.debut)
    )

  return (
    <div className="flex-1 overflow-auto relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
          <div className="size-10 rounded-full border-[3px] border-gray-200 border-t-[#463acb] animate-spin" />
        </div>
      )}
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col className="w-[56px]" />
          <col className="w-[52px]" />
          <col className="w-[52px]" />
          <col className="w-[160px]" />
          <col className="w-[236px]" />
          <col className="w-[130px]" />
          <col className="w-[140px]" />
          <col className="w-[260px]" />
          <col className="w-[48px]" />
        </colgroup>

        <thead>
          <tr className={`${ROW_HEAD} bg-white border-b border-gray-200 sticky top-0 z-10`}>
            <th className={TH}>Date</th>
            <th className={`${TH} whitespace-nowrap`}>
              <button
                onClick={() => setSortAsc(a => !a)}
                className="flex items-center gap-1 cursor-pointer hover:text-[#333] transition-colors"
              >
                Début
                <span className="text-gray-400 transition-transform duration-200" style={{ display: 'inline-block', transform: sortAsc ? 'rotate(0deg)' : 'rotate(180deg)' }}>↓</span>
              </button>
            </th>
            <th className={TH}>Fin</th>
            <th className={TH}>Émission</th>
            <th className={TH}>Titre</th>
            <th className={TH}>N° Magnétothèque</th>
            <th className={TH}>Liens</th>
            <th className={TH}>Statut du son</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {filtered.map(son => (
            <tr
              key={son.id}
              onClick={() => onSelectSon?.(son)}
              className={`${ROW_BODY} group border-b cursor-pointer ${BG[effectiveStatut(son)]} ${BORDER[effectiveStatut(son)]}`}
            >
              <td className={`${TD} whitespace-nowrap font-light`}>{son.date}</td>
              <td className={`${TD} whitespace-nowrap font-light`}>{son.debut}</td>
              <td className={`${TD} whitespace-nowrap font-light`}>{son.fin}</td>
              <td className={`${TD} font-semibold max-w-0`}><span className="block truncate">{son.emission}</span></td>

              {/* Titre — tronqué */}
              <td className={`${TD} max-w-0`}>
                {son.sousElements ? (
                  <div className="space-y-1">
                    {son.sousElements.map((s, i) => (
                      <div key={i} className="flex items-center gap-1 truncate">
                        <span className="text-gray-400 shrink-0">•</span>
                        <span className="truncate font-semibold">{s.titre}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate font-semibold">{son.titre}</span>
                    {son.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded leading-none shrink-0">
                        {son.badge}
                      </span>
                    )}
                  </div>
                )}
              </td>

              {/* N° Magnétothèque */}
              <td className={`${TD} whitespace-nowrap font-light`}>
                <div className="flex items-center gap-1.5">
                  <span>{son.numeroMagnetotheque}</span>
                  <button
                    onClick={e => handleCopy(e, son)}
                    className="transition-colors cursor-pointer"
                    title="Copier"
                  >
                    {copiedId === son.id
                      ? <Check className="size-3.5 text-green-600" />
                      : <Copy className="size-3.5 text-gray-400 hover:text-black" />
                    }
                  </button>
                </div>
              </td>

              {/* Liens */}
              <td className={TD}>
                <div className="flex items-center gap-3">
                  <span className={LINK_BOLD}>Superkaiser</span>
                  <span className={LINK_BOLD}>Itéma <ExternalLink className="size-3.5" /></span>
                </div>
              </td>

              {/* Statut */}
              <td className={`${TD} font-light`}><StatutCell son={{ ...son, statut: effectiveStatut(son) }} /></td>

              {/* Actions */}
              <td className={`${TD} text-center align-middle`}>
                {son.statut === 'duree_incoherente' && (
                  <Tooltip label={overridden.has(son.id) ? 'Repasser en statut "Durée incohérente"' : 'Passer en statut "Livré"'}>
                    <button
                      onClick={e => toggleOverride(son.id, e)}
                      className="p-1.5 rounded bg-[#463ACB] text-white hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span className="relative size-4 block">
                        <Check className={`size-4 absolute inset-0 transition-opacity duration-200 ${overridden.has(son.id) ? 'opacity-0' : 'opacity-100'}`} />
                        <TriangleAlert className={`size-4 absolute inset-0 transition-opacity duration-200 ${overridden.has(son.id) ? 'opacity-100' : 'opacity-0'}`} />
                      </span>
                    </button>
                  </Tooltip>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="flex items-center justify-center h-40 text-[15px] text-gray-400">
          Aucun son ne correspond aux filtres sélectionnés.
        </p>
      )}
    </div>
  )
}
