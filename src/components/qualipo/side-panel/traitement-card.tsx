import { useState } from 'react'
import { Check, Headphones, ChevronDown, ChevronUp } from 'lucide-react'
import { CARD } from '@/lib/styles'
import AudioPlayer from '@/components/qualipo/audio-player'

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

export function TraitementCard() {
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
