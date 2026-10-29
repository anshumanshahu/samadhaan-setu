import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import LocationGate from "./components/LocationGate";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePageUI from "./pages/HomePageUI";
import AuthPage from "./pages/AuthPage";
import ReportIssue from "./pages/ReportIssue";
import AdminPanel from "./pages/AdminPanel";
import UnderDevelopment from "./pages/UnderDevelopment";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <LocationGate>
        <Header />
        <div className="pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePageUI />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportIssue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/under-development" element={<UnderDevelopment />} />
            <Route path="*" element={<HomePageUI />} />
          </Routes>
          <Footer />
        </div>
        <BottomNav />
      </LocationGate>
    </AuthProvider>
  );
}

export default App;