import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Navbar from './components/layouts/navbar'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  )
}

export default App
