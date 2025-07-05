
import { Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import ProtectedRoutes from "@/components/protectedRoute";
import Index from "@/pages/index";
import Login from "@/pages/Login";
import PageNotFound from "@/pages/page-not-found";

// Initialize emailjs once outside of component


export default function App() {
  return (
    <>
    <AuthGuard>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route
        element={
          <AuthGuard>
            <ProtectedRoutes />
          </AuthGuard>
        }
      >
        <Route path="/index" element={<Index />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </AuthGuard>
    </>
  );
}
