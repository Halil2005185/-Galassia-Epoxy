import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { logout, restoreSession } from "./lib/auth";
import { setOnSessionExpired } from "./api/client";

function App() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    setOnSessionExpired(() => setAuthed(false));
    restoreSession()
      .then(setAuthed)
      .finally(() => setCheckingSession(false));

    return () => setOnSessionExpired(null);
  }, []);

  if (checkingSession) {
    return <div className="min-h-screen bg-canvas" />;
  }

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        setAuthed(false);
        void logout();
      }}
    />
  );
}

export default App;
