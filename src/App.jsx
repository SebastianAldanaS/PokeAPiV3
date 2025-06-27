import { AppRouter } from './AppRouter'
import { PokemonProvider } from './context/PokemonProvider'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

function App() {

  return (
    <ErrorBoundary>
      <PokemonProvider>
        <AppRouter />
      </PokemonProvider>
    </ErrorBoundary>
  )
}

export default App
