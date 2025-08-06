import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/layout'
import { Dashboard } from './pages/dashboard'
import { Proxy } from './pages/proxy'
import { Toolkit } from './pages/toolkit'
import { Browser } from './pages/browser'
import { Settings } from './pages/settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proxy" element={<Proxy />} />
        <Route path="/toolkit" element={<Toolkit />} />
        <Route path="/browser" element={<Browser />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App