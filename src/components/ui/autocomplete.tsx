import { useState, useRef, useEffect, useMemo } from 'react'
import { INPUT } from '@/lib/styles'
import { cn } from '@/lib/utils'

export interface AutocompleteOption {
  label: string
  sublabel?: string
  logo?: string
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  value: string
  onChange: (value: string) => void
  /** Appelé quand l'utilisateur sélectionne explicitement une option (clic ou Entrée) */
  onSelect?: (option: AutocompleteOption) => void
  placeholder?: string
  className?: string
}

export function Autocomplete({ options, value, onChange, onSelect, placeholder, className }: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!value.trim()) return []
    const q = value.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, value])

  const showDropdown = open && filtered.length > 0

  // Remet le curseur à 0 quand la liste filtrée change
  useEffect(() => { setHighlighted(0) }, [filtered.length])

  // Fermeture au clic extérieur
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[highlighted]
      onChange(opt.label)
      setOpen(false)
      onSelect?.(opt)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function select(opt: AutocompleteOption) {
    onChange(opt.label)
    setOpen(false)
    onSelect?.(opt)
  }

  function highlightMatch(text: string) {
    const q = value.trim()
    if (!q) return <span>{text}</span>
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return <span>{text}</span>
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold text-blue-rf">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <input
        className={cn(INPUT, 'w-full')}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => { if (value.trim()) setOpen(true) }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-y-auto max-h-64">
          {filtered.map((opt, i) => (
            <button
              key={`${opt.label}-${i}`}
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(opt)}
              className={`w-full text-left px-4 py-2.5 cursor-pointer transition-colors ${
                i === highlighted ? 'bg-blue-rf/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.logo && (
                  <img src={opt.logo} alt="" className="size-4 rounded-full object-cover shrink-0" />
                )}
                <div className="text-[15px] text-gray-800">{highlightMatch(opt.label)}</div>
              </div>
              {opt.sublabel && (
                <div className="text-xs text-gray-400 mt-0.5 ml-6">{opt.sublabel}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
