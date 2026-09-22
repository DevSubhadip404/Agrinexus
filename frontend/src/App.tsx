import { BrowserRouter, Route, Routes } from "react-router-dom"

import AddFarmPage from "./pages/AddFarmPage"
import DashboardPage from "./pages/DashboardPage"
import FarmPage from "./pages/FarmPage"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-farm" element={<AddFarmPage />} />
        <Route path="/farm/:farmId" element={<FarmPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App