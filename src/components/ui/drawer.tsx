import { useEffect } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  /** Classe Tailwind de largeur appliquée au panneau. Défaut : w-72 */
  className?: string
}

export function Drawer({ open, onClose, children, className = 'w-72' }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 left-0 z-[80] h-screen max-w-[92vw] bg-white shadow-2xl flex flex-col transition-transform duration-200 ${className} ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {children}
      </div>
    </>
  )
}
