import Home from "@/pages/Home"
import Header from "@/widgets/Header"
import Sidebar from "@/widgets/Sidebar"
import { Navigate, Route, Routes } from "react-router-dom"

function App() {

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Header />
      <main className="flex-1 relative">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default App
