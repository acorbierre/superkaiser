interface PageTitleProps {
  children: React.ReactNode
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="font-sans font-semibold text-2xl text-[#0A0A0A]">
      {children}
    </h1>
  )
}
