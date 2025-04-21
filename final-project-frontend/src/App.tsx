import { BrowserRouter, Routes, Route } from "react-router-dom";

// 📄 Pagina’s
import Home from "./pages/Home";
import Users from "./pages/Users";
import Properties from "./pages/Properties";
import AddProperty from "./components/AddProperty"; // ✅ nieuwe pagina
import Bookings from "./pages/Bookings";
import Amenities from "./pages/Amenities";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// 🧱 Componenten
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 📦 Alles binnen Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* 👤 Alleen admin mag users beheren */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* 🏠 Iedereen mag properties bekijken */}
          <Route path="properties" element={<Properties />} />

          {/* ➕ Alleen host mag properties toevoegen */}
          <Route
            path="properties/add"
            element={
              <ProtectedRoute allowedRoles={["host"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          {/* 📅 Alleen user mag eigen boekingen zien */}
          <Route
            path="bookings"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* 🛠️ Alleen admin mag amenities beheren */}
          <Route
            path="amenities"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Amenities />
              </ProtectedRoute>
            }
          />

          {/* 🔥 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 🔐 Loginpagina (buiten layout) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
