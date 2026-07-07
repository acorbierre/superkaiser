import { cn } from '@/lib/utils'

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-xl font-semibold text-gray-900 mb-4', className)}>
      {children}
    </h2>
  )
}
