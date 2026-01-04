import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PatientsListPage from "./pages/Patients/PatientsListPage";
import PatientDetailPage from "./pages/Patients/PatientDetailPage";
import AlertsPage from "./pages/Alert/AlertsPage";
import SettingsPage from "./pages/Settings/SettingsPage";

export default function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsListPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
