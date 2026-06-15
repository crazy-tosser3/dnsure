import Home from "@/pages/Home"
import Header from "@/widgets/Header"
import { Navigate, Route, Routes } from "react-router-dom"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
