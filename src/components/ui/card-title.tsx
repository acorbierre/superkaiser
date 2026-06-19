import { cn } from '@/lib/utils'

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h2 className={cn('font-sans font-semibold text-lg text-blue-rf', className)}>
      {children}
    </h2>
  )
}
