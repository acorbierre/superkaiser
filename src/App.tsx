import { NavigationProvider } from '@/contexts/navigation-context'
import AppLayout from '@/components/layout/app-layout'
import Router from '@/router'

export default function App() {
  return (
    <NavigationProvider>
      <AppLayout>
        <Router />
      </AppLayout>
    </NavigationProvider>
  )
}
