import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"

import AddFarmPage from "./pages/AddFarmPage"
import AgriNCommonsPage from "./pages/AgriNCommonsPage"
import AnalysisPage from "./pages/AnalysisPage"
import CropDoctorPage from "./pages/CropDoctorPage"
import DashboardPage from "./pages/DashboardPage"
import FarmPage from "./pages/FarmPage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/agrin-commons"
          element={<AgriNCommonsPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-farm"
          element={
            <ProtectedRoute>
              <AddFarmPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farm/:farmId"
          element={
            <ProtectedRoute>
              <FarmPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farm/:farmId/analysis"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crop-doctor"
          element={
            <ProtectedRoute>
              <CropDoctorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}


export default App
