import { useState } from 'react'
import { Play, Pause, Download } from 'lucide-react'
import { BTN_PRIMARY } from '@/lib/styles'
import { formatDuration, parseDuration } from '@/lib/utils'

interface Props {
  fichier?: string
  dureeLabel?: string
  onConserver?: () => void
  compact?: boolean
  noBg?: boolean
}

export default function AudioPlayer({ fichier, dureeLabel = '00:13:00', onConserver, compact = false, noBg = false }: Props) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const totalSecs = parseDuration(dureeLabel)
  const currentSecs = Math.round(progress / 100 * totalSecs)

  const progressBar = (
    <div className="relative flex-1 flex items-center h-4 cursor-pointer">
      <div className="absolute w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full bg-[#463acb] rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <input
        type="range" min={0} max={100} value={progress}
        onChange={e => setProgress(Number(e.target.value))}
        className="absolute w-full opacity-0 cursor-pointer h-full"
      />
    </div>
  )

  const controls = (
    <div className="flex items-center gap-3">
      <button onClick={() => setPlaying(p => !p)} className="text-[#463acb] shrink-0 cursor-pointer">
        {playing
          ? <Pause className="size-5" style={{ fill: '#463acb', stroke: 'none' }} />
          : <Play  className="size-5" style={{ fill: '#463acb', stroke: 'none' }} />
        }
      </button>
      <span className="text-[13px] tabular-nums text-gray-500 shrink-0">{formatDuration(currentSecs)}</span>
      {progressBar}
      <span className="text-[13px] tabular-nums text-gray-500 shrink-0">{formatDuration(totalSecs)}</span>
      {!compact && (
        <button className="text-[#463acb] shrink-0 cursor-pointer">
          <Download className="size-5" />
        </button>
      )}
      {onConserver && (
        <button onClick={onConserver} className={`${BTN_PRIMARY} ml-2 shrink-0`}>
          Conserver ce son
        </button>
      )}
    </div>
  )

  if (compact) {
    return noBg
      ? <div className="py-2">{controls}</div>
      : <div className="px-4 py-3 rounded-xl bg-[#eef0ff]">{controls}</div>
  }

  return (
    <div className="rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] px-6 py-4">
      {fichier && <p className="text-[14px] text-[#333] mb-3 break-all">{fichier}</p>}
      {fichier && <hr className="border-gray-100 mb-3" />}
      {controls}
    </div>
  )
}
