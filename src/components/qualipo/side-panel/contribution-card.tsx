import { ExternalLink } from 'lucide-react'
import type { Son } from '@/data/sons'
import { CARD, LINK } from '@/lib/styles'
import { Pill } from '@/components/ui/pill'

const DROITS = [
  { label: 'Podcast', du: '26/06/2025', pendant: 'illimité' },
  { label: 'AOD',     du: '26/06/2025', pendant: 'illimité' },
]

function statutPill(son: Son) {
  if (son.statut === 'liberation_programmee') return <Pill variant="purple">Programmé</Pill>
  if (son.statut === 'livre' || son.statut === 'livre_avance' || son.statut === 'duree_incoherente') return <Pill variant="green">Publié</Pill>
  return <Pill variant="orange">Brouillon</Pill>
}

export function ContributionCard({ son }: { son: Son }) {
  const droitsFermes = son.statut === 'droits_fermes'
  return (
    <div className={CARD}>
      <div className="space-y-4 text-[15px] text-[#333]">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Statut du son de l'épisode</span>
          {statutPill(son)}
          <span className={`${LINK} ml-auto`}>Voir dans Atlas <ExternalLink className="size-3.5" /></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Date de l'épisode :</span>
          <span className="text-gray-500">{son.detail.diffuseAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Date de mise en ligne :</span>
          <span className="text-gray-500">{son.detail.publiAt}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Droits de publication</span>
            <span className={LINK}>Modifier dans Magneto <ExternalLink className="size-3.5" /></span>
          </div>
          <div className="flex">
            {DROITS.map((d, i) => (
              <div key={d.label} className={`flex-1 space-y-0.5 ${i > 0 ? 'border-l border-gray-200 pl-5' : 'pr-5'}`}>
                <div className="flex items-center gap-2 font-semibold text-[14px]">
                  <span>{d.label} :</span>
                  <Pill variant={droitsFermes ? 'redSoft' : 'greenSoft'} small>{droitsFermes ? 'Non autorisé' : 'Autorisé'}</Pill>
                </div>
                {!droitsFermes && (
                  <>
                    <p className="text-[14px] text-gray-600">Du : {d.du}</p>
                    <p className="text-[14px] text-gray-600">Pendant : {d.pendant}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
