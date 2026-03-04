import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'
import { Toaster } from 'sonner'

function App() {

  return (
    <>

    <Toaster position='bottom-right' richColors closeButton={true} />
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>

    </>
  )
}

export default App
