import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Tab from './components/Tab'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate('/tab')}>Guitar Tab</button>
      <button>Button2</button>
      <button>Button3</button>
    </div>
  )
}

const TabPage = () => {
  return <div>
    <h1>Tab Page</h1>
  </div>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tab" element={<TabPage />} />
    </Routes>
  )
}

export default App;