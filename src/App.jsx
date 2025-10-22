import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home1 from "./pages/Home1"; // Login/Register stranica
import Home2 from "./pages/Home2"; // Authenticated Home
import LostAndFound from "./pages/LostAndFound";
import Extracurriculars from "./pages/Extracurriculars";
import TrackChild from "./pages/TrackChild";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DeteDashboard from "./pages/DeteDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import QuizPage from "./pages/QuizPage";
import RegisterChild from "./pages/RegisterChild";
import AdminDashboard from "./pages/AdminDashboard";
import AddUser from "./components/AddUser";
import AddActivity from "./components/AddActivity";
import AddPrivateLesson from "./components/AddPrivateLessons";
import PrivateLessons from "./pages/PrivateLessons";
import ChangePassword from "./components/ChangePassword";
import User from "./pages/User";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Protected Route komponenta - zahteva login
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" />;
  }

  return children;
}

// Komponenta koja redirektuje Admin i Dete na njihove dashboarde
function RoleBasedRedirect({ children }) {
  const { user } = useAuth();
  
  if (user?.role === "Admin" || user?.role === "Domar") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  if (user?.role === "Dete") {
    return <Navigate to="/dete-dashboard" replace />;
  }
  
  return children;
}

export default function App() {
  const { user, loading } = useAuth();
  const isDete = user?.role === "Dete";
  const isAdmin = user?.role === "Admin" || user?.role === "Domar";

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar se prikazuje samo ako je korisnik ulogovan */}
      {user && <Navbar />}
      <ScrollToTop />
      <main style={{ 
        paddingTop: user ? "80px" : "0",
        minHeight: "100vh",
        transition: "padding-top 0.3s ease"
      }}>
        <Routes>
          {/* Javna ruta - Home1 (Login/Register) */}
          <Route 
            path="/" 
            element={
              user ? (
                isAdmin ? <Navigate to="/admin-dashboard" /> :
                isDete ? <Navigate to="/dete-dashboard" /> :
                <Navigate to="/home" />
              ) : (
                <Home1 />
              )
            } 
          />
          
          {/* Login i Register - dostupno samo neautentifikovanim */}
          <Route 
            path="/login" 
            element={
              user ? (
                isAdmin ? <Navigate to="/admin-dashboard" /> :
                isDete ? <Navigate to="/dete-dashboard" /> :
                <Navigate to="/home" />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? (
                isAdmin ? <Navigate to="/admin-dashboard" /> :
                isDete ? <Navigate to="/dete-dashboard" /> :
                <Navigate to="/home" />
              ) : (
                <Register />
              )
            } 
          />

          {/* Home2 - glavna stranica nakon logina (NE za Admin i Dete) */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <Home2 />
                </RoleBasedRedirect>
              </ProtectedRoute>
            } 
          />

          {/* Zaštićene rute - NE za Admin i Dete */}
          <Route 
            path="/izgubljeno-nadjeno" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <LostAndFound />
                </RoleBasedRedirect>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vannastavne-aktivnosti" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <Extracurriculars />
                </RoleBasedRedirect>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/privatni-casovi" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <PrivateLessons />
                </RoleBasedRedirect>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pronadji-dete" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect>
                  <TrackChild />
                </RoleBasedRedirect>
              </ProtectedRoute>
            } 
          />

          {/* Parent Dashboard i profil - NE za Admin i Dete */}
          <Route 
            path="/roditelj-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["Roditelj"]}>
                <ParentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register-child" 
            element={
              <ProtectedRoute allowedRoles={["Roditelj"]}>
                <RegisterChild />
              </ProtectedRoute>
            } 
          />

          {/* Dete Dashboard - SAMO za decu */}
          <Route 
            path="/dete-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["Dete"]}>
                <DeteDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Dashboard i opcije - SAMO za Admin i Domar */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={["Admin", "Domar"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-user" 
            element={
              <ProtectedRoute allowedRoles={["Admin", "Domar"]}>
                <AddUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-activity" 
            element={
              <ProtectedRoute allowedRoles={["Admin", "Domar"]}>
                <AddActivity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-private-lesson" 
            element={
              <ProtectedRoute allowedRoles={["Admin", "Domar"]}>
                <AddPrivateLesson />
              </ProtectedRoute>
            } 
          />

          {/* Kviz - NE za Admin, dostupno Detetu */}
          <Route 
            path="/kviz/:id" 
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin-dashboard" replace />
                ) : (
                  <QuizPage />
                )}
              </ProtectedRoute>
            } 
          />

          {/* Change Password - Dostupno svima osim Deteta */}
          <Route 
            path="/promeni-lozinku" 
            element={
              <ProtectedRoute>
                {isDete ? (
                  <Navigate to="/dete-dashboard" replace />
                ) : (
                  <ChangePassword />
                )}
              </ProtectedRoute>
            } 
          />

          {/* 404 - Redirect based on role */}
          <Route 
            path="*" 
            element={
              user ? (
                isAdmin ? <Navigate to="/admin-dashboard" replace /> :
                isDete ? <Navigate to="/dete-dashboard" replace /> :
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/profil" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
  },
  loadingContent: {
    textAlign: 'center',
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '4px solid rgba(251, 146, 60, 0.2)',
    borderTop: '4px solid #f97316',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '16px',
  },
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);