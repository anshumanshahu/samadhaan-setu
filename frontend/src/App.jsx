import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import HomePageUI from "./pages/HomePageUI";
import UnderDevelopment from "./pages/UnderDevelopment";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePageUI />} />
          <Route path="/under-development" element={<UnderDevelopment />} />
          <Route path="*" element={<HomePageUI />} />
        </Routes>
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}

export default App;