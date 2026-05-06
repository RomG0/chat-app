import { Route, Router, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPanel from "./pages/AdminPanel";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./navigationBar";

// YZ: Any user can see Admin panel console??
const App = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
};

export default App;
