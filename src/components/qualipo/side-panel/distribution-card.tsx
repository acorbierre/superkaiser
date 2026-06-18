import { Check, ExternalLink } from 'lucide-react'
import { CARD, LINK } from '@/lib/styles'

function GreenCheck() {
  return (
    <div className="size-6 rounded-full bg-[#25bc95] flex items-center justify-center shrink-0">
      <Check className="size-3.5 text-white" strokeWidth={3} />
    </div>
  )
}

export function DistributionCard({ emission }: { emission: string }) {
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
