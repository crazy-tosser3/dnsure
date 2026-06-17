import Home from "@/pages/Home"
import Result from "@/pages/Result"
import Header from "@/widgets/Header"
import Sidebar from "@/widgets/Sidebar"
import { Navigate, Route, Routes } from "react-router-dom"

function App() {

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Header />
      <div className="flex-1 relative">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App
