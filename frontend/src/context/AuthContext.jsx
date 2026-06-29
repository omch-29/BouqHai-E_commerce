import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const loadSession = (role) => {
  const token = localStorage.getItem(`bouqhai_${role}_token`);
  const name = localStorage.getItem(`bouqhai_${role}_name`);
  return token ? { token, role, name } : null;
};

export const AuthProvider = ({ children }) => {
  // Admin and customer sessions are stored under separate keys and tracked
  // separately, so logging into one never overwrites or clears the other -
  // you can be logged in as a customer AND as the admin in the same browser.
  const [user, setUser] = useState(() => loadSession("user"));
  const [admin, setAdmin] = useState(() => loadSession("admin"));

  const loginAs = (role, { token, name }) => {
    localStorage.setItem(`bouqhai_${role}_token`, token);
    localStorage.setItem(`bouqhai_${role}_name`, name || "");
    if (role === "admin") setAdmin({ token, role, name });
    else setUser({ token, role, name });
  };

  const logoutAs = (role) => {
    localStorage.removeItem(`bouqhai_${role}_token`);
    localStorage.removeItem(`bouqhai_${role}_name`);
    if (role === "admin") setAdmin(null);
    else setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loginAs, logoutAs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
