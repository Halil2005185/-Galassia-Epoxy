import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { isAuthenticated, logout } from "./lib/auth";

function App() {
  const [authed, setAuthed] = useState(isAuthenticated);

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        logout();
        setAuthed(false);
      }}
    />
  );
}

export default App;
