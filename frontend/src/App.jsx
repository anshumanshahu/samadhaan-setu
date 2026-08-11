import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePageUI from "./pages/HomePageUI";
import UnderDevelopment from "./pages/UnderDevelopment";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePageUI />} />
        <Route path="/under-development" element={<UnderDevelopment />} />
        <Route path="*" element={<HomePageUI />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;