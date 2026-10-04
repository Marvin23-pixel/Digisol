import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Sales from "./Pages/Sales";
import Records from "./Pages/Records";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Adminfunctions/AdminDashboard";
import StoreInventory, { INITIAL_PRODUCTS } from "./Adminfunctions/StoreInventory";
import Permissions from "./Adminfunctions/Permissions";
import StaffAccounts from "./Adminfunctions/StaffAccounts";
import Notifications from "./Adminfunctions/Notifications";
import Settings from "./Adminfunctions/Settings";
import { logStaffOut } from "./utils/staffStore.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Lives here (not inside StoreInventory) so it survives navigating
  // away to other cards — it only resets on an actual page refresh.
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Login passes { staff, rememberTerminal, isSupervisor } to onLogin
  const handleLogin = (loginData) => {
    setCurrentStaff(loginData.staff);
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Mark the staff member offline in the shared directory
    if (currentStaff?.id) {
      logStaffOut(currentStaff.id);
    }

    // Brief loading state before returning to Login
    window.setTimeout(() => {
      setIsAuthenticated(false);
      setCurrentStaff(null);
      setCurrentPage("home");
      setIsLoggingOut(false);
    }, 1000);
  };

  // Show a loading screen while logging out
  if (isLoggingOut) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 12,
          background: " #090f22ed",
          color: "#E7ECF3",
        }}
      >
        <LoaderCircle className="spin" size={32} />
        <p style={{ margin: 0, fontSize: 15 }}>Logging out...</p>
      </div>
    );
  }

  // Show Login first. Login calls onLogin after the credentials are accepted.
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === "sales") {
    return <Sales onNavigate={setCurrentPage} />;
  }

  if (currentPage === "records") {
    return <Records onNavigate={setCurrentPage} />;
  }

  if (currentPage === "profile") {
    return (
      <Profile
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentStaff={currentStaff}
      />
    );
  }

  if (currentPage === "admin") {
    return (
      <AdminDashboard
        onNavigate={setCurrentPage}
        onBack={() => setCurrentPage("home")}
        products={products}
      />
    );
  }

  if (currentPage === "inventory") {
    return (
      <StoreInventory
        onBack={() => setCurrentPage("admin")}
        products={products}
        setProducts={setProducts}
      />
    );
  }

  if (currentPage === "permissions") {
    return <Permissions onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "staff") {
    return <StaffAccounts onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "notifications") {
    return <Notifications onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "settings") {
    return <Settings onBack={() => setCurrentPage("admin")} />;
  }

  return (
    <Home
      onNavigate={setCurrentPage}
      isChatbotOpen={isChatbotOpen}
      onOpenChatbot={() => setIsChatbotOpen(true)}
      onCloseChatbot={() => setIsChatbotOpen(false)}
    />
  );
}

export default App;