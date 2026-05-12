import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import FileGrid from './components/FileGrid'
import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <FileGrid />
      </div>
    </div>
  )
}

export default App