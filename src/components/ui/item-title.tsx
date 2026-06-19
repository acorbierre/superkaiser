interface ItemTitleProps {
  children: React.ReactNode
}

export function ItemTitle({ children }: ItemTitleProps) {
  return (
    <h3 className="font-sans font-semibold text-[17px] text-gray-900 leading-snug">
      {children}
    </h3>
  )
}
