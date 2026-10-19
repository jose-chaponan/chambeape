import { AppProviders } from './app/AppProviders'
import { AppRouter } from './app/routes/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
