import { Info } from 'lucide-react'

interface InfoMessageProps {
  children: React.ReactNode
}

export function InfoMessage({ children }: InfoMessageProps) {
  return (
    <div className="rounded-md flex items-start gap-3 px-5 py-4 text-[15px] text-blue-rf bg-[#DBEAFF]">
      <Info className="size-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  )
}
