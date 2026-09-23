import { BrowserRouter, Route, Routes } from "react-router-dom"

import AddFarmPage from "./pages/AddFarmPage"
import AgriNCommonsPage from "./pages/AgriNCommonsPage"
import AnalysisPage from "./pages/AnalysisPage"
import CropDoctorPage from "./pages/CropDoctorPage"
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
        <Route path="/farm/:farmId/analysis" element={<AnalysisPage />} />
        <Route path="/crop-doctor" element={<CropDoctorPage />} />
        <Route path="/agrin-commons" element={<AgriNCommonsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App